import { NextResponse } from "next/server";
import { db } from "../../../../../utils/firebaseConfig"; // 正しい相対パスを指定
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(
      collection(db, "companies"),
      where("approvalStatus", "==", "awaiting-approval")
    );
    const querySnapshot = await getDocs(q);

    const companies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(companies);
  } catch (error) {
    console.error("審査待ち企業の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "審査待ち企業の取得に失敗しました。" },
      { status: 500 }
    );
  }
}
