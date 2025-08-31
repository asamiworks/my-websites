"use client";

import Modal from "react-modal";
import { useEffect } from "react";


/**
 * Modalの初期化用カスタムフック
 */
const useInitializeModal = (): void => {
  useEffect(() => {
    try {
      Modal.setAppElement("#__next"); // ルート要素を設定
    } catch (error) {
      console.error("Modalの初期化エラー:", error);
    }
  }, []);
};

export default useInitializeModal;
