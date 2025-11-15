"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  multiFactor,
  TotpMultiFactorGenerator,
  MultiFactorResolver,
  MultiFactorError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  // MFA関連
  isMfaEnabled: () => boolean;
  enrollMfa: (displayName: string) => Promise<{ secret: string; qrCodeUrl: string }>;
  verifyMfaEnrollment: (verificationCode: string, secret: string) => Promise<void>;
  mfaResolver: MultiFactorResolver | null;
  verifyMfaLogin: (verificationCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [totpSecret, setTotpSecret] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestoreにユーザー情報を作成（初回のみ）
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          phone: null,
          authProvider: 'google',
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          stripeCustomerId: null,
        });
      }
    } catch (err: any) {
      // MFAエラーの場合
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = (err as any).resolver;
        setMfaResolver(resolver);
        setError('二段階認証が必要です。認証コードを入力してください。');
        throw err;
      }
      console.error('Google sign in error:', err);
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Email sign in error:', err);
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // プロフィール更新
      await updateProfile(user, { displayName: name });

      // メール認証送信
      await sendEmailVerification(user);

      // Firestoreにユーザー情報を作成
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        phone: phone || null,
        authProvider: 'email',
        emailVerified: false,
        createdAt: serverTimestamp(),
        stripeCustomerId: null,
      });
    } catch (err: any) {
      console.error('Email sign up error:', err);
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  // MFA関連の関数
  const isMfaEnabled = (): boolean => {
    if (!user) return false;
    return multiFactor(user).enrolledFactors.length > 0;
  };

  const enrollMfa = async (displayName: string) => {
    if (!user) throw new Error('ユーザーがログインしていません');

    try {
      setError(null);
      const multiFactorUser = multiFactor(user);

      // TOTPセッションを開始
      const multiFactorSession = await multiFactorUser.getSession();

      // TOTP secret生成
      const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

      // QRコードURL生成
      const qrCodeUrl = totpSecret.generateQrCodeUrl(
        user.email || 'user@asami-works.com',
        'AsamiWorks Admin'
      );

      // secretを一時保存
      setTotpSecret(totpSecret.secretKey);

      return {
        secret: totpSecret.secretKey,
        qrCodeUrl,
      };
    } catch (err: any) {
      console.error('MFA enrollment error:', err);
      setError('二段階認証の登録に失敗しました');
      throw err;
    }
  };

  const verifyMfaEnrollment = async (verificationCode: string, secret: string) => {
    if (!user) throw new Error('ユーザーがログインしていません');

    try {
      setError(null);
      const multiFactorUser = multiFactor(user);

      // 再度セッション取得
      const multiFactorSession = await multiFactorUser.getSession();

      // secret keyを使ってTOTPシークレットを再生成
      const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

      // 検証コードでMFAアサーションを作成
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
        totpSecret,
        verificationCode
      );

      // MFAを登録
      await multiFactorUser.enroll(multiFactorAssertion, 'TOTP Device');

      console.log('✅ MFA登録完了');
    } catch (err: any) {
      console.error('MFA verification error:', err);
      setError('認証コードが正しくありません');
      throw err;
    }
  };

  const verifyMfaLogin = async (verificationCode: string) => {
    if (!mfaResolver) throw new Error('MFA resolverがありません');

    try {
      setError(null);

      // TOTPファクターを取得
      const totpFactorInfo = mfaResolver.hints.find(
        (hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID
      );

      if (!totpFactorInfo) {
        throw new Error('TOTP factorが見つかりません');
      }

      // 検証コードでMFAアサーションを作成
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
        totpFactorInfo.uid,
        verificationCode
      );

      // MFA検証を完了してログイン
      await mfaResolver.resolveSignIn(multiFactorAssertion);

      setMfaResolver(null);
      console.log('✅ MFAログイン完了');
    } catch (err: any) {
      console.error('MFA login verification error:', err);
      setError('認証コードが正しくありません');
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    error,
    clearError,
    isMfaEnabled,
    enrollMfa,
    verifyMfaEnrollment,
    mfaResolver,
    verifyMfaLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// エラーメッセージを日本語化
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。';
    case 'auth/user-disabled':
      return 'このアカウントは無効化されています。';
    case 'auth/user-not-found':
      return 'メールアドレスまたはパスワードが正しくありません。';
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが正しくありません。';
    case 'auth/invalid-credential':
      return 'メールアドレスまたはパスワードが正しくありません。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/weak-password':
      return 'パスワードは8文字以上で設定してください。';
    case 'auth/operation-not-allowed':
      return 'この操作は許可されていません。';
    case 'auth/popup-closed-by-user':
      return 'ログインがキャンセルされました。';
    case 'auth/cancelled-popup-request':
      return 'ログインがキャンセルされました。';
    default:
      return '認証エラーが発生しました。もう一度お試しください。';
  }
}
