import { NextResponse } from "next/server";
import { db } from "../../../../../utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(
      collection(db, "companies"),
      where("status", "==", "awaiting-approval")
    );
    const querySnapshot = await getDocs(q);
    const companies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(companies);
  } catch (error) {
    // 現在未使用だが今後使う予定がある場合
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    console.error("データ取得中にエラーが発生しました:", error); // 追加でエラーをログ出力する形で暫定対応
    return NextResponse.json(
      { error: "データ取得に失敗しました" },
      { status: 500 }
    );
  }
}
