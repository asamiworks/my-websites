import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    return NextResponse.json({
      hasEnvKey: !!envKey,
      envKeyLength: envKey?.length || 0,
      envKeyStart: envKey?.substring(0, 50) || 'not found',
      canParse: (() => {
        if (!envKey) return false;
        try {
          const parsed = JSON.parse(envKey);
          return {
            success: true,
            hasType: !!parsed.type,
            hasProjectId: !!parsed.project_id,
            hasPrivateKey: !!parsed.private_key,
            projectId: parsed.project_id
          };
        } catch (e: any) {
          return {
            success: false,
            error: e.message
          };
        }
      })()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
