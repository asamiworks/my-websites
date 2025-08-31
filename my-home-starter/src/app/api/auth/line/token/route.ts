import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    // リクエストヘッダーからホストを取得
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/line/callback`;

    const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID!,
      client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
      redirect_uri: redirectUri,
    });

    const response = await axios.post(tokenEndpoint, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json({
      access_token: response.data.access_token,
      id_token: response.data.id_token,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}
