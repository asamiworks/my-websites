import { dbAdmin } from "../../utils/firebaseAdminConfig"; // dbAdmin を使用
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(____req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Firestore initialized:", !!dbAdmin); // Firestore が正しく初期化されているか確認
    const usersRef = dbAdmin.collection("users"); // dbAdmin を使用
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No users found");
      return res.status(404).json({ users: [] });
    }

    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
