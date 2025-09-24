// 保護者登録API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// リクエストデータのバリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  displayName: z.string().min(1, '表示名を入力してください'),
  agreeToTerms: z.boolean().refine(val => val === true, '利用規約への同意が必要です'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'プライバシーポリシーへの同意が必要です'),
  ageConfirm: z.boolean().refine(val => val === true, '年齢確認が必要です'),
  coppaConsent: z.boolean().optional(),
  childAge: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      displayName,
      agreeToTerms,
      agreeToPrivacy,
      ageConfirm,
      coppaConsent,
      childAge
    } = validationResult.data;

    // 13歳未満の子どもがいる場合のCOPPA同意チェック
    if (childAge && parseInt(childAge) < 13) {
      if (!coppaConsent) {
        return NextResponse.json(
          { error: '13歳未満のお子様についてのCOPPA同意が必要です' },
          { status: 400 }
        );
      }
    }

    // Firebase Authでユーザー作成
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // カスタムクレーム設定
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: 'parent',
      plan: 'free',
      emailVerified: false
    });

    // Firestoreにユーザー詳細データ作成
    const userData = {
      id: userRecord.uid,
      email,
      displayName,
      plan: 'free' as const,
      role: 'parent' as const,
      consents: {
        terms: {
          agreed: agreeToTerms,
          agreedAt: new Date(),
          version: '1.0'
        },
        privacy: {
          agreed: agreeToPrivacy,
          agreedAt: new Date(),
          version: '1.0'
        },
        coppa: coppaConsent ? {
          agreed: coppaConsent,
          agreedAt: new Date(),
          childAge: parseInt(childAge || '0'),
          version: '1.0'
        } : undefined,
        ageConfirm: {
          confirmed: ageConfirm,
          confirmedAt: new Date()
        }
      },
      settings: {
        notifications: {
          email: true,
          safety: true,
          usage: true,
          marketing: false
        },
        privacy: {
          allowAnalytics: true,
          allowPersonalization: true,
          childDataMinimization: childAge && parseInt(childAge) < 13
        }
      },
      profile: {
        createdAt: new Date(),
        lastLoginAt: new Date(),
        emailVerified: false
      },
      children: [],
      subscription: {
        plan: 'free',
        status: 'active',
        startedAt: new Date(),
        billingCycle: null,
        nextBilling: null
      }
    };

    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // メール認証送信
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email`,
      handleCodeInApp: true,
    };

    const emailVerificationLink = await adminAuth.generateEmailVerificationLink(
      email,
      actionCodeSettings
    );

    // TODO: メール送信サービス（SendGrid等）を使用してメール認証リンクを送信

    // レスポンス（パスワードは除外）
    const responseData = {
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      },
      userData: {
        ...userData,
        emailVerificationLink: process.env.NODE_ENV === 'development' ? emailVerificationLink : undefined
      },
      message: 'アカウントが作成されました。確認メールをお送りしましたので、メールアドレスの認証を完了してください。'
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error: any) {
    console.error('アカウント作成エラー:', error);

    // Firebase Auth エラーの処理
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-exists':
          return NextResponse.json(
            { error: 'このメールアドレスは既に使用されています' },
            { status: 409 }
          );
        case 'auth/invalid-email':
          return NextResponse.json(
            { error: '無効なメールアドレスです' },
            { status: 400 }
          );
        case 'auth/weak-password':
          return NextResponse.json(
            { error: 'パスワードが弱すぎます' },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: 'アカウントの作成に失敗しました' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}