// 子どもプロファイル作成API
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

// リクエストデータのバリデーションスキーマ
const createChildSchema = z.object({
  name: z.string().min(1, 'お子様の名前を入力してください').max(50, '名前が長すぎます'),
  birthMonth: z.string().regex(/^\d{4}-\d{2}$/, '有効な生年月を入力してください'),
  grade: z.string().min(1, '学年を選択してください'),
  interests: z.array(z.string()).min(1, '少なくとも1つの興味分野を選択してください'),
  learningGoals: z.array(z.string()).min(1, '少なくとも1つの学習目標を選択してください'),
  pin: z.string().regex(/^\d{4}$/, 'PINは4桁の数字で入力してください')
});

export async function POST(request: NextRequest) {
  try {
    // 認証ヘッダーからIDトークンを取得
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];

    // IDトークンの検証
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // リクエストボディのバリデーション
    const body = await request.json();
    const validationResult = createChildSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { name, birthMonth, grade, interests, learningGoals, pin } = validationResult.data;

    // ユーザーデータの取得
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const currentChildren = userData?.children || [];

    // プラン制限のチェック
    const planLimits = {
      free: 1,
      kids: 1,
      friends: 3,
      premium: 5
    };

    const plan = userData?.plan || 'free';
    if (currentChildren.length >= planLimits[plan as keyof typeof planLimits]) {
      return NextResponse.json(
        { error: 'プランの子どもプロファイル上限に達しています' },
        { status: 400 }
      );
    }

    // 年齢計算
    const birth = new Date(birthMonth + '-01');
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const calculatedAge = monthDiff < 0 ? age - 1 : age;

    // 年齢グループの判定
    let ageGroup: 'junior' | 'middle' | 'senior';
    if (calculatedAge <= 12) {
      ageGroup = 'junior';
    } else if (calculatedAge <= 15) {
      ageGroup = 'middle';
    } else {
      ageGroup = 'senior';
    }

    // PINのハッシュ化
    const hashedPin = await bcrypt.hash(pin, 12);

    // 子どもプロファイルデータの作成
    const childId = `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const childData = {
      id: childId,
      name,
      birthMonth,
      grade,
      age: calculatedAge,
      ageGroup,
      interests,
      learningGoals,
      pinHash: hashedPin,
      settings: {
        safetyLevel: calculatedAge < 13 ? 'strict' : 'moderate',
        allowVoiceInput: true,
        allowImageUploads: calculatedAge >= 10,
        sessionTimeout: calculatedAge < 10 ? 60 : 120, // 分
        parentalNotifications: calculatedAge < 13
      },
      privacy: {
        isUnder13: calculatedAge < 13,
        coppaCompliant: calculatedAge < 13,
        dataMinimization: calculatedAge < 13,
        parentalConsent: calculatedAge < 13
      },
      profile: {
        createdAt: new Date(),
        lastActiveAt: null,
        totalSessions: 0,
        totalMessages: 0
      },
      stats: {
        favoriteSubjects: [],
        learningStreaks: 0,
        achievements: []
      }
    };

    // Firestoreの更新
    await adminDb.collection('users').doc(userId).update({
      children: [...currentChildren, childData],
      'profile.lastUpdatedAt': new Date()
    });

    // 子どもプロファイル専用コレクションにも保存（検索・分析用）
    await adminDb.collection('child_profiles').doc(childId).set({
      ...childData,
      parentId: userId,
      parentEmail: userData?.email
    });

    // COPPA対応ログ（13歳未満の場合）
    if (calculatedAge < 13) {
      await adminDb.collection('coppa_logs').add({
        parentId: userId,
        childId,
        action: 'profile_created',
        timestamp: new Date(),
        childAge: calculatedAge,
        parentalConsent: true,
        metadata: {
          dataMinimization: true,
          safetyLevel: 'strict'
        }
      });
    }

    // セキュリティログ
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    await adminDb.collection('security_logs').add({
      userId,
      childId,
      action: 'child_profile_created',
      status: 'success',
      timestamp: new Date(),
      metadata: {
        ip: clientIP,
        childAge: calculatedAge,
        ageGroup
      }
    });

    // レスポンス（PINハッシュは除外）
    const { pinHash, ...responseChildData } = childData;

    return NextResponse.json({
      child: responseChildData,
      message: 'お子様のプロファイルが作成されました'
    }, { status: 201 });

  } catch (error: any) {
    console.error('子どもプロファイル作成エラー:', error);

    // エラーログ
    try {
      await adminDb.collection('error_logs').add({
        action: 'child_profile_creation',
        error: error.message,
        timestamp: new Date(),
        metadata: {
          stack: error.stack
        }
      });
    } catch (logError) {
      console.error('エラーログ記録失敗:', logError);
    }

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'セッションが期限切れです。再度ログインしてください' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'プロファイルの作成に失敗しました' },
      { status: 500 }
    );
  }
}