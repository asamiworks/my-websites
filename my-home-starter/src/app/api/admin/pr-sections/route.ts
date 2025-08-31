// src/app/api/admin/pr-sections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';

// 管理者チェック（実際の実装に合わせて調整してください）
async function isAdmin(request: NextRequest): Promise<boolean> {
  // Firebase Auth や NextAuth を使用している場合はここで認証をチェック
  // 仮の実装
  const session = await getServerSession();
  return session?.user?.email === 'admin@myhomestarter.com';
}

// PR枠一覧取得
export async function GET(request: NextRequest) {
  try {
    // 管理者チェック
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const prefecture = searchParams.get('prefecture');
    const city = searchParams.get('city');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (prefecture) where.prefecture = prefecture;
    if (city) where.city = city;
    if (isActive !== null) where.isActive = isActive === 'true';

    const prSections = await prisma.pRSection.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            corporateNumber: true,
          }
        }
      },
      orderBy: [
        { prefecture: 'asc' },
        { city: 'asc' },
        { displayOrder: 'asc' }
      ]
    });

    return NextResponse.json(prSections);
  } catch (error) {
    console.error('Error fetching PR sections:', error);
    return NextResponse.json(
      { error: 'PR枠の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PR枠作成
export async function POST(request: NextRequest) {
  try {
    // 管理者チェック
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const body = await request.json();
    const {
      prefecture,
      city,
      companyId,
      companyName,
      description,
      imageUrl,
      contactInfo,
      displayOrder,
      isActive,
      endDate
    } = body;

    // 必須フィールドのバリデーション
    if (!prefecture || !city || !companyName || !description) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    const prSection = await prisma.pRSection.create({
      data: {
        prefecture,
        city,
        companyId,
        companyName,
        description,
        imageUrl,
        contactInfo,
        displayOrder: displayOrder || 0,
        isActive: isActive !== false,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        company: true
      }
    });

    return NextResponse.json(prSection, { status: 201 });
  } catch (error) {
    console.error('Error creating PR section:', error);
    return NextResponse.json(
      { error: 'PR枠の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// PR枠更新
export async function PUT(request: NextRequest) {
  try {
    // 管理者チェック
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'IDが指定されていません' },
        { status: 400 }
      );
    }

    // 日付フィールドの変換
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const prSection = await prisma.pRSection.update({
      where: { id },
      data: updateData,
      include: {
        company: true
      }
    });

    return NextResponse.json(prSection);
  } catch (error) {
    console.error('Error updating PR section:', error);
    return NextResponse.json(
      { error: 'PR枠の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// PR枠削除
export async function DELETE(request: NextRequest) {
  try {
    // 管理者チェック
    if (!await isAdmin(request)) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'IDが指定されていません' },
        { status: 400 }
      );
    }

    await prisma.pRSection.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'PR枠を削除しました' });
  } catch (error) {
    console.error('Error deleting PR section:', error);
    return NextResponse.json(
      { error: 'PR枠の削除に失敗しました' },
      { status: 500 }
    );
  }
}