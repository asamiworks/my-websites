"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useSimulator } from "../../../contexts/SimulatorContext";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";
import { HouseSizeData } from "../../../types/simulator";
import styles from "./HouseSizePage.module.css";

// Modalのアプリケーション要素を設定（アクセシビリティ対応）
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

// 部屋の型定義
interface Room {
  id: string;
  size: number;
  preset: string;
}

// プリセット値の型定義
type PresetValue = number | "custom";

// プリセットアイテムの型定義
interface PresetItem {
  value: PresetValue;
  label: string;
  description: string;
  recommended?: boolean;
}

// 部屋サイズのプリセット定義
const ROOM_PRESETS: {
  ldk: PresetItem[];
  westernRoom: PresetItem[];
  masterBedroom: PresetItem[];
  japaneseRoom: PresetItem[];
  otherRoom: PresetItem[];
} = {
  ldk: [
    { value: 14, label: "コンパクト（14畳）", description: "必要最小限でOK" },
    { value: 16, label: "標準（16畳）", description: "家族で食事とくつろぎ", recommended: true },
    { value: 18, label: "ゆったり（18畳）", description: "来客も余裕で対応" },
    { value: 20, label: "広々（20畳）", description: "アイランドキッチンも可能" },
    { value: "custom", label: "カスタム", description: "" }
  ],
  westernRoom: [
    { value: 4.5, label: "ミニマム（4.5畳）", description: "ベッドと最小限の収納" },
    { value: 5, label: "標準（5畳）", description: "ベッド＋学習机" },
    { value: 6, label: "ゆったり（6畳）", description: "友達も呼べる広さ" },
    { value: "custom", label: "カスタム", description: "" }
  ],
  masterBedroom: [
    { value: 6, label: "コンパクト（6畳）", description: "ダブルベッド中心" },
    { value: 8, label: "標準（8畳）", description: "ベッド＋ドレッサー", recommended: true },
    { value: 10, label: "スイート（10畳）", description: "ソファも置ける" },
    { value: "custom", label: "カスタム", description: "" }
  ],
  japaneseRoom: [
    { value: 4.5, label: "小（4.5畳）", description: "客間として最小限" },
    { value: 6, label: "中（6畳）", description: "仏間も置ける", recommended: true },
    { value: 8, label: "大（8畳）", description: "本格的な和室" },
    { value: "custom", label: "カスタム", description: "" }
  ],
  otherRoom: [
    { value: 3, label: "小（3畳）", description: "納戸・収納部屋" },
    { value: 4.5, label: "中（4.5畳）", description: "書斎・趣味部屋" },
    { value: 6, label: "大（6畳）", description: "多目的スペース" },
    { value: "custom", label: "カスタム", description: "" }
  ]
};

const HouseSizeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, updateHouseSize, isLoading, setEditMode } = useSimulator();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // 編集モードかどうかを判定
  const fromParam = searchParams?.get('from');
  const isEditMode = fromParam === 'summary' || fromParam === 'mypage';
  const isFromMyPage = fromParam === 'mypage';

  // 初期値
  const initialFloors = 1;
  const initialLdkSize = 16;

  // 一意のIDを生成
  const generateId = () => `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // ステート管理
  const [floors, setFloors] = useState<number>(initialFloors);
  
  // 各部屋タイプを配列で管理（LDKも配列に変更）
  const [ldkRooms, setLdkRooms] = useState<Room[]>(() => [{
    id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    size: initialLdkSize,
    preset: "16"
  }]);
  const [japaneseRooms, setJapaneseRooms] = useState<Room[]>([]);
  const [masterBedrooms, setMasterBedrooms] = useState<Room[]>([]);
  const [westernRooms, setWesternRooms] = useState<Room[]>([]);
  const [otherRooms, setOtherRooms] = useState<Room[]>([]);
  
  const [totalFloorArea, setTotalFloorArea] = useState<number | null>(null);
  const [newRoomIds, setNewRoomIds] = useState<Set<string>>(new Set());
  const [deletingRoomIds, setDeletingRoomIds] = useState<Set<string>>(new Set());

  // モーダル管理
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCalculationDone, setIsCalculationDone] = useState(false);
  const [isFloorInfoModalOpen, setIsFloorInfoModalOpen] = useState(false);
  const [isLdkInfoModalOpen, setIsLdkInfoModalOpen] = useState(false);
  const [isJapaneseRoomModalOpen, setIsJapaneseRoomModalOpen] = useState(false);
  const [isMasterBedroomModalOpen, setIsMasterBedroomModalOpen] = useState(false);
  const [isWesternRoomModalOpen, setIsWesternRoomModalOpen] = useState(false);
  const [isOtherRoomModalOpen, setIsOtherRoomModalOpen] = useState(false);

  // 編集モードの設定
  useEffect(() => {
    if (setEditMode) {
      setEditMode(isFromMyPage);
    }
  }, [isFromMyPage, setEditMode]);

  // 初期データの読み込み
  useEffect(() => {
    if (data?.houseSizeData && !isLoading) {
      const houseSizeData = data.houseSizeData;
      setFloors(houseSizeData.floors || initialFloors);
      
      // LDKのデータを設定
      if (houseSizeData.ldkSize) {
        setLdkRooms([{
          id: generateId(),
          size: houseSizeData.ldkSize,
          preset: String(houseSizeData.ldkSize)
        }]);
      }
      
      setTotalFloorArea(houseSizeData.totalFloorArea || null);
      
      if (houseSizeData.totalFloorArea) {
        setIsCalculationDone(true);
      }
    }
    
    // detailedRoomDataの読み込み（マイページからの編集時）
    if (isFromMyPage && data?.detailedRoomData) {
      const detailedData = data.detailedRoomData;
      if (detailedData.ldkRooms) setLdkRooms(detailedData.ldkRooms);
      if (detailedData.japaneseRooms) setJapaneseRooms(detailedData.japaneseRooms);
      if (detailedData.masterBedrooms) setMasterBedrooms(detailedData.masterBedrooms);
      if (detailedData.westernRooms) setWesternRooms(detailedData.westernRooms);
      if (detailedData.otherRooms) setOtherRooms(detailedData.otherRooms);
    } else {
      // ローカルストレージから詳細データを読み込む（通常フロー）
      const savedDetailedData = localStorage.getItem('detailedRoomData');
      if (savedDetailedData) {
        try {
          const parsed = JSON.parse(savedDetailedData);
          if (parsed.ldkRooms) setLdkRooms(parsed.ldkRooms);
          if (parsed.japaneseRooms) setJapaneseRooms(parsed.japaneseRooms);
          if (parsed.masterBedrooms) setMasterBedrooms(parsed.masterBedrooms);
          if (parsed.westernRooms) setWesternRooms(parsed.westernRooms);
          if (parsed.otherRooms) setOtherRooms(parsed.otherRooms);
        } catch (e) {
          console.error('Failed to parse saved room data:', e);
        }
      }
    }
  }, [data, isLoading, isFromMyPage]);

  // 入力値が変更されたら計算済みフラグをリセット
  const resetCalculation = () => {
    setIsCalculationDone(false);
    setTotalFloorArea(null);
  };

  // 階数の変更
  const handleFloorsChange = (value: number) => {
    setFloors(value);
    resetCalculation();
  };

  // 部屋の追加
  const addRoom = (roomType: 'ldk' | 'japanese' | 'master' | 'western' | 'other') => {
    const newRoom: Room = {
      id: generateId(),
      size: 0,
      preset: ""
    };

    // 新しい部屋のIDを記録
    setNewRoomIds(prev => new Set([...prev, newRoom.id]));
    
    // トースト通知
    const roomTypeNames = {
      ldk: 'LDK',
      japanese: '和室',
      master: '主寝室',
      western: '洋室',
      other: 'その他の部屋'
    };
    showToast("success", `${roomTypeNames[roomType]}を追加しました`);

    // アニメーション用に少し遅延を入れる
    setTimeout(() => {
      switch (roomType) {
        case 'ldk':
          newRoom.size = 16;
          newRoom.preset = "16";
          setLdkRooms([...ldkRooms, newRoom]);
          break;
        case 'japanese':
          newRoom.size = 6;
          newRoom.preset = "6";
          setJapaneseRooms([...japaneseRooms, newRoom]);
          break;
        case 'master':
          newRoom.size = 8;
          newRoom.preset = "8";
          setMasterBedrooms([...masterBedrooms, newRoom]);
          break;
        case 'western':
          newRoom.size = 5;
          newRoom.preset = "5";
          setWesternRooms([...westernRooms, newRoom]);
          break;
        case 'other':
          newRoom.size = 4.5;
          newRoom.preset = "4.5";
          setOtherRooms([...otherRooms, newRoom]);
          break;
      }
    }, 50);

    // 3秒後にnewフラグを削除
    setTimeout(() => {
      setNewRoomIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(newRoom.id);
        return newSet;
      });
    }, 3000);

    resetCalculation();
  };

  // 部屋の削除
  const removeRoom = (roomType: 'ldk' | 'japanese' | 'master' | 'western' | 'other', roomId: string) => {
    // 削除アニメーション開始
    setDeletingRoomIds(prev => new Set([...prev, roomId]));
    
    // アニメーション後に実際に削除
    setTimeout(() => {
      switch (roomType) {
        case 'ldk':
          // 最低1つのLDKは必要
          if (ldkRooms.length > 1) {
            setLdkRooms(ldkRooms.filter(room => room.id !== roomId));
          } else {
            showToast("warning", "LDKは最低1つ必要です");
            setDeletingRoomIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(roomId);
              return newSet;
            });
            return;
          }
          break;
        case 'japanese':
          setJapaneseRooms(japaneseRooms.filter(room => room.id !== roomId));
          break;
        case 'master':
          setMasterBedrooms(masterBedrooms.filter(room => room.id !== roomId));
          break;
        case 'western':
          setWesternRooms(westernRooms.filter(room => room.id !== roomId));
          break;
        case 'other':
          setOtherRooms(otherRooms.filter(room => room.id !== roomId));
          break;
      }
      
      setDeletingRoomIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
      
      resetCalculation();
    }, 300);
  };

  // 部屋のプリセット変更
  const updateRoomPreset = (roomId: string, preset: string, rooms: Room[], setRooms: React.Dispatch<React.SetStateAction<Room[]>>) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          preset: preset,
          size: preset !== "custom" ? parseFloat(preset) : room.size
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    resetCalculation();
  };

  // 部屋のサイズ変更
  const updateRoomSize = (roomId: string, size: number, rooms: Room[], setRooms: React.Dispatch<React.SetStateAction<Room[]>>) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          size: size,
          preset: "custom"
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    resetCalculation();
  };

  // 間取りタイプを計算する関数
  const calculateLayoutType = () => {
    // LDKの数（通常は1、2世帯住宅なら2以上）
    const ldkCount = ldkRooms.length;
    
    // 居室の数（和室、洋室、主寝室の合計）
    const roomCount = japaneseRooms.length + westernRooms.length + masterBedrooms.length;
    
    // その他の部屋は間取り表記には含めない
    
    if (ldkCount === 0) {
      // LDKがない場合（通常はありえないが念のため）
      return roomCount > 0 ? `${roomCount}R` : "";
    } else if (ldkCount === 1) {
      // 通常の住宅
      return `${roomCount}LDK`;
    } else if (ldkCount === 2) {
      // 2世帯住宅
      return `${roomCount}LDK×2世帯`;
    } else if (ldkCount > 2) {
      // 3世帯以上
      return `${roomCount}LDK×${ldkCount}世帯`;
    }
    
    return "";
  };

  // 坪数計算（改善版）
  const calculateTotalFloorArea = () => {
    // 各部屋の面積を計算（畳単位）
    const ldkArea = ldkRooms.reduce((sum, room) => sum + room.size, 0);
    const japaneseArea = japaneseRooms.reduce((sum, room) => sum + room.size, 0);
    const masterArea = masterBedrooms.reduce((sum, room) => sum + room.size, 0);
    const westernArea = westernRooms.reduce((sum, room) => sum + room.size, 0);
    const otherArea = otherRooms.reduce((sum, room) => sum + room.size, 0);

    // 部屋の合計面積（畳）
    const roomAreaTatami = ldkArea + japaneseArea + masterArea + westernArea + otherArea;

    // 階数に応じた廊下係数
    let corridorCoefficient = 1.10; // 平屋
    if (floors === 2) corridorCoefficient = 1.13;
    if (floors === 3) corridorCoefficient = 1.15;

    // 収納係数（固定）
    const storageCoefficient = 1.16;

    // 階段スペース（畳）
    let stairSpaceTatami = 0;
    if (floors === 2) stairSpaceTatami = 4; // 2坪相当
    if (floors === 3) stairSpaceTatami = 8; // 4坪相当

    // 水回りスペース（畳）- 浴室、トイレ、洗面所など
    // 2世帯住宅の場合は水回りが増えるので調整
    const waterAreaTatami = ldkRooms.length > 1 ? 12 : 8; // 2世帯なら6坪、通常は4坪

    // 総面積計算（畳）
    const totalAreaTatami = (roomAreaTatami + stairSpaceTatami + waterAreaTatami) * corridorCoefficient * storageCoefficient;

    // 畳から坪への変換（1坪 = 2畳）
    const totalAreaTsubo = Math.round(totalAreaTatami / 2);

    setTotalFloorArea(totalAreaTsubo);
    setIsCalculationDone(true);
    
    if (isEditMode) {
      showToast("success", "家の大きさ情報を更新しました");
    } else {
      showToast("success", "坪数を計算しました");
    }
    return totalAreaTsubo;
  };

  // データ保存と次へ
  const handleNext = async () => {
    if (!isCalculationDone || !totalFloorArea) {
      showToast("warning", "まず坪数を計算してください");
      return;
    }

    // 簡潔なデータ形式で保存（最初のLDKのサイズのみ保存）
    const houseSizeData: HouseSizeData = {
      totalFloorArea,
      floors,
      ldkSize: ldkRooms[0]?.size || 16, // 最初のLDKのサイズ
    };

    // 詳細な部屋情報も含めて保存
    const detailedRoomData = {
      ldkRooms,
      japaneseRooms,
      masterBedrooms,
      westernRooms,
      otherRooms,
    };

    // マイページからの編集の場合は、detailedRoomDataも含めて保存
    if (isFromMyPage) {
      await updateHouseSize({
        ...houseSizeData,
        detailedRoomData, // SimulatorContextで処理される
      } as any);
    } else {
      await updateHouseSize(houseSizeData);
      // 通常フローではローカルストレージに保存
      localStorage.setItem('detailedRoomData', JSON.stringify(detailedRoomData));
    }

    if (isFromMyPage) {
      // マイページからの編集の場合はマイページに戻る
      router.push("/my-page");
    } else if (isEditMode) {
      // サマリーからの編集の場合はサマリーページに戻る
      router.push("/start-home-building/summary");
    } else {
      // 通常モードの場合は次のページへ
      router.push("/start-home-building/building-location");
    }
  };

  // 戻るボタンの処理
  const handleBack = () => {
    if (isFromMyPage) {
      router.push("/my-page");
    } else if (isEditMode) {
      router.push("/start-home-building/summary");
    } else {
      router.push("/start-home-building/total-budget");
    }
  };

  // 結果を保存（ログインページへ）
  const handleSaveResults = () => {
    router.push("/login?from=simulator");
  };

  // 部屋の描画コンポーネント
  const RoomItem = ({ 
    room, 
    roomType, 
    presets, 
    roomIndex,
    onPresetChange,
    onSizeChange,
    onRemove,
    isNew,
    isDeleting
  }: {
    room: Room;
    roomType: 'ldk' | 'japanese' | 'master' | 'western' | 'other';
    presets: PresetItem[];
    roomIndex: number;
    onPresetChange: (preset: string) => void;
    onSizeChange: (size: number) => void;
    onRemove: () => void;
    isNew?: boolean;
    isDeleting?: boolean;
  }) => {
    const roomTypeName = {
      ldk: 'LDK',
      japanese: '和室',
      master: '主寝室',
      western: '洋室',
      other: 'その他'
    }[roomType];

    return (
      <div id={`room-${room.id}`} className={`${styles.roomItem} ${isNew ? styles.roomItemNew : ''} ${isDeleting ? styles.roomItemDeleting : ''}`}>
        <h4 className={styles.roomItemTitle}>{roomTypeName}{roomIndex + 1}</h4>
        <div className={styles.presetOptions}>
          {presets.map((preset, index) => (
            <div key={`${roomType}_${room.id}_preset_${index}`} className={styles.presetWrapper}>
              <input
                type="radio"
                id={`${roomType}_${room.id}_preset_${preset.value}`}
                name={`${roomType}_${room.id}_preset`}
                value={String(preset.value)}
                checked={room.preset === String(preset.value)}
                onChange={(e) => {
                  const currentScrollY = window.scrollY;
                  onPresetChange(e.target.value);
                  // スクロール位置を維持
                  window.requestAnimationFrame(() => {
                    window.scrollTo(0, currentScrollY);
                  });
                }}
                className={styles.presetRadio}
              />
              <label 
                htmlFor={`${roomType}_${room.id}_preset_${preset.value}`}
                className={`${styles.presetLabel} ${room.preset === String(preset.value) ? styles.presetLabelChecked : ''}`}
                onMouseDown={() => {
                  // マウスダウン時にスクロール位置を記録
                  const currentScrollY = window.scrollY;
                  setTimeout(() => {
                    window.scrollTo(0, currentScrollY);
                  }, 0);
                }}
              >
                <span className={`${styles.presetText} ${preset.recommended ? styles.recommended : ''}`}>
                  {preset.label}
                  {preset.recommended && <span className={styles.recommendedBadge}>標準</span>}
                </span>
                {preset.description && <span className={styles.presetDescription}>{preset.description}</span>}
              </label>
            </div>
          ))}
        </div>
        <div className={styles.roomControls}>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={room.size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className={styles.input}
              min="2"
              max="20"
              step="0.5"
              disabled={room.preset !== "custom"}
            />
            <span className={styles.unit}>畳</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className={styles.removeButton}
          >
            削除
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          {isEditMode ? "家の大きさを編集" : "家の大きさを設定"}
        </h1>
        <p className={styles.subtitle}>
          {isEditMode 
            ? "家の大きさ情報を修正してください" 
            : "希望する部屋数と広さを入力してください"
          }
        </p>
      </header>

      {/* 進捗バー */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: isEditMode ? "100%" : "40%" }}
        ></div>
      </div>

      {/* サンプルボタン */}
      <div className={styles.sampleButtonContainer}>
        <button
          type="button"
          onClick={() => setIsSampleModalOpen(true)}
          className={styles.sampleButton}
        >
          間取りの例を見る
        </button>
      </div>

      {/* フォーム */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          {/* 階数 */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              階数
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsFloorInfoModalOpen(true)}
              >
                ?
              </button>
            </h3>
            <div className={styles.floorOptions}>
              <div className={styles.floorOptionWrapper}>
                <input
                  type="radio"
                  id="floor_1"
                  name="floors"
                  value="1"
                  checked={floors === 1}
                  onChange={() => handleFloorsChange(1)}
                  className={styles.floorRadio}
                />
                <label 
                  htmlFor="floor_1"
                  className={`${styles.floorLabel} ${floors === 1 ? styles.floorLabelChecked : ''}`}
                >
                  <span className={styles.floorText}>平屋</span>
                  <span className={styles.floorDescription}>階段なしでバリアフリー</span>
                </label>
              </div>
              <div className={styles.floorOptionWrapper}>
                <input
                  type="radio"
                  id="floor_2"
                  name="floors"
                  value="2"
                  checked={floors === 2}
                  onChange={() => handleFloorsChange(2)}
                  className={styles.floorRadio}
                />
                <label 
                  htmlFor="floor_2"
                  className={`${styles.floorLabel} ${floors === 2 ? styles.floorLabelChecked : ''}`}
                >
                  <span className={styles.floorText}>2階建て</span>
                  <span className={styles.floorDescription}>最も一般的な選択</span>
                </label>
              </div>
              <div className={styles.floorOptionWrapper}>
                <input
                  type="radio"
                  id="floor_3"
                  name="floors"
                  value="3"
                  checked={floors === 3}
                  onChange={() => handleFloorsChange(3)}
                  className={styles.floorRadio}
                />
                <label 
                  htmlFor="floor_3"
                  className={`${styles.floorLabel} ${floors === 3 ? styles.floorLabelChecked : ''}`}
                >
                  <span className={styles.floorText}>3階建て</span>
                  <span className={styles.floorDescription}>狭小地でも広々空間</span>
                </label>
              </div>
            </div>
          </div>

          {/* LDK */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              LDK
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsLdkInfoModalOpen(true)}
              >
                ?
              </button>
            </h3>
            {ldkRooms.map((room, index) => (
              <RoomItem
                key={room.id}
                room={room}
                roomType="ldk"
                presets={ROOM_PRESETS.ldk}
                roomIndex={index}
                onPresetChange={(preset) => updateRoomPreset(room.id, preset, ldkRooms, setLdkRooms)}
                onSizeChange={(size) => updateRoomSize(room.id, size, ldkRooms, setLdkRooms)}
                onRemove={() => removeRoom('ldk', room.id)}
                isNew={newRoomIds.has(room.id)}
                isDeleting={deletingRoomIds.has(room.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addRoom('ldk')}
              className={styles.addRoomButton}
            >
              ＋ LDKを追加（2世帯住宅など）
            </button>
          </div>

          {/* 和室 */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              和室
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsJapaneseRoomModalOpen(true)}
              >
                ?
              </button>
            </h3>
            {japaneseRooms.map((room, index) => (
              <RoomItem
                key={room.id}
                room={room}
                roomType="japanese"
                presets={ROOM_PRESETS.japaneseRoom}
                roomIndex={index}
                onPresetChange={(preset) => updateRoomPreset(room.id, preset, japaneseRooms, setJapaneseRooms)}
                onSizeChange={(size) => updateRoomSize(room.id, size, japaneseRooms, setJapaneseRooms)}
                onRemove={() => removeRoom('japanese', room.id)}
                isNew={newRoomIds.has(room.id)}
                isDeleting={deletingRoomIds.has(room.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addRoom('japanese')}
              className={styles.addRoomButton}
            >
              ＋ 和室を追加
            </button>
          </div>

          {/* 主寝室 */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              主寝室
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsMasterBedroomModalOpen(true)}
              >
                ?
              </button>
            </h3>
            {masterBedrooms.map((room, index) => (
              <RoomItem
                key={room.id}
                room={room}
                roomType="master"
                presets={ROOM_PRESETS.masterBedroom}
                roomIndex={index}
                onPresetChange={(preset) => updateRoomPreset(room.id, preset, masterBedrooms, setMasterBedrooms)}
                onSizeChange={(size) => updateRoomSize(room.id, size, masterBedrooms, setMasterBedrooms)}
                onRemove={() => removeRoom('master', room.id)}
                isNew={newRoomIds.has(room.id)}
                isDeleting={deletingRoomIds.has(room.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addRoom('master')}
              className={styles.addRoomButton}
            >
              ＋ 主寝室を追加
            </button>
          </div>

          {/* 洋室 */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              洋室
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsWesternRoomModalOpen(true)}
              >
                ?
              </button>
            </h3>
            {westernRooms.map((room, index) => (
              <RoomItem
                key={room.id}
                room={room}
                roomType="western"
                presets={ROOM_PRESETS.westernRoom}
                roomIndex={index}
                onPresetChange={(preset) => updateRoomPreset(room.id, preset, westernRooms, setWesternRooms)}
                onSizeChange={(size) => updateRoomSize(room.id, size, westernRooms, setWesternRooms)}
                onRemove={() => removeRoom('western', room.id)}
                isNew={newRoomIds.has(room.id)}
                isDeleting={deletingRoomIds.has(room.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addRoom('western')}
              className={styles.addRoomButton}
            >
              ＋ 洋室を追加
            </button>
          </div>

          {/* その他の部屋 */}
          <div className={styles.roomTypeSection}>
            <h3 className={styles.roomTypeTitle}>
              その他の部屋
              <button
                type="button"
                className={styles.infoButton}
                onClick={() => setIsOtherRoomModalOpen(true)}
              >
                ?
              </button>
            </h3>
            {otherRooms.map((room, index) => (
              <RoomItem
                key={room.id}
                room={room}
                roomType="other"
                presets={ROOM_PRESETS.otherRoom}
                roomIndex={index}
                onPresetChange={(preset) => updateRoomPreset(room.id, preset, otherRooms, setOtherRooms)}
                onSizeChange={(size) => updateRoomSize(room.id, size, otherRooms, setOtherRooms)}
                onRemove={() => removeRoom('other', room.id)}
                isNew={newRoomIds.has(room.id)}
                isDeleting={deletingRoomIds.has(room.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addRoom('other')}
              className={styles.addRoomButton}
            >
              ＋ その他の部屋を追加
            </button>
          </div>

          {/* 計算ボタン */}
          <button
            type="button"
            onClick={calculateTotalFloorArea}
            className={styles.calculateButton}
          >
            {isEditMode ? "再計算する" : (isCalculationDone && totalFloorArea ? "再計算する" : "坪数を計算")}
          </button>

          {/* 計算結果 */}
          {totalFloorArea && (
            <div className={styles.resultContainer}>
              <h2 className={styles.resultTitle}>計算結果</h2>
              <div className={styles.resultMain}>
                <div className={styles.resultValue}>
                  <span className={styles.resultNumber}>{totalFloorArea}</span>
                  <span className={styles.resultUnit}>坪</span>
                </div>
                <div className={styles.resultLayout}>
                  {calculateLayoutType()}
                </div>
              </div>
              <p className={styles.resultNote}>
                ※廊下・収納・水回り・階段スペースを含む概算値です
              </p>
              <p className={styles.resultDetail}>
                {floors === 1 ? "平屋" : `${floors}階建て`}の場合の延床面積
              </p>
              
              {/* 保存ボタン（未認証時かつ非編集モード時のみ表示） */}
              {!isAuthenticated && !isEditMode && (
                <div className={styles.saveButtonContainer}>
                  <button
                    type="button"
                    onClick={handleSaveResults}
                    className={styles.saveButton}
                  >
                    結果を保存する
                  </button>
                  <p className={styles.saveNote}>
                    ※ ログインすると結果を保存できます
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ナビゲーション */}
          <div className={styles.navigation}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              {isEditMode ? "キャンセル" : "戻る"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!isCalculationDone}
            >
              {isFromMyPage ? "保存してマイページに戻る" : 
               isEditMode ? "保存してサマリーに戻る" : "次へ進む"}
            </button>
          </div>
        </div>
      </main>

      {/* モーダル群 */}
      {/* 間取りサンプル */}
      <Modal
        isOpen={isSampleModalOpen}
        onRequestClose={() => setIsSampleModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>間取りの例</h2>
        <div className={styles.sampleList}>
          <p>■ 25坪の家：3LDK（LDK16畳 + 洋室6畳×2 + 和室4.5畳）</p>
          <p>■ 30坪の家：4LDK（LDK18畳 + 洋室6畳×3 + 和室4.5畳）</p>
          <p>■ 35坪の家：4LDK（LDK20畳 + 主寝室8畳 + 洋室5畳×2 + 和室6畳）</p>
          <p>■ 50坪の2世帯：LDK16畳×2 + 洋室6畳×4 + 和室6畳×2</p>
        </div>
        <button
          onClick={() => setIsSampleModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* 階数情報 */}
      <Modal
        isOpen={isFloorInfoModalOpen}
        onRequestClose={() => setIsFloorInfoModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>階数について</h2>
        <p>
          建物の階数を選択してください。
          平屋は1階のみ、2階建ては1階と2階があります。
          階数により建築費用が変わります。
        </p>
        <ul>
          <li>平屋：階段がない分、生活動線がシンプル</li>
          <li>2階建て：土地を有効活用できる一般的な選択</li>
          <li>3階建て：狭小地でも広い居住空間を確保</li>
        </ul>
        <button
          onClick={() => setIsFloorInfoModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* LDK情報 */}
      <Modal
        isOpen={isLdkInfoModalOpen}
        onRequestClose={() => setIsLdkInfoModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>LDKについて</h2>
        <p>
          リビング・ダイニング・キッチンの広さです。
          家族が集まる中心的な空間で、16〜20畳が一般的です。
        </p>
        <ul>
          <li>14畳：コンパクトな暮らし向け</li>
          <li>16畳：4人家族でも快適な標準サイズ</li>
          <li>18畳：ゆとりのある空間</li>
          <li>20畳：大人数でも余裕の広さ</li>
        </ul>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>
          ※ 2世帯住宅の場合は、LDKを複数追加できます
        </p>
        <button
          onClick={() => setIsLdkInfoModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* 和室情報 */}
      <Modal
        isOpen={isJapaneseRoomModalOpen}
        onRequestClose={() => setIsJapaneseRoomModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>和室について</h2>
        <p>
          畳敷きの部屋です。
          客間や仏間として使用されることが多く、
          4.5畳〜6畳が一般的です。
        </p>
        <button
          onClick={() => setIsJapaneseRoomModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* 主寝室情報 */}
      <Modal
        isOpen={isMasterBedroomModalOpen}
        onRequestClose={() => setIsMasterBedroomModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>主寝室について</h2>
        <p>
          夫婦の寝室です。
          ベッドを2台置くことを考慮して、
          6畳〜8畳が一般的です。
        </p>
        <button
          onClick={() => setIsMasterBedroomModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* 洋室情報 */}
      <Modal
        isOpen={isWesternRoomModalOpen}
        onRequestClose={() => setIsWesternRoomModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>洋室について</h2>
        <p>
          子供部屋や書斎として使用される部屋です。
          4.5畳〜6畳が一般的です。
        </p>
        <button
          onClick={() => setIsWesternRoomModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>

      {/* その他の部屋情報 */}
      <Modal
        isOpen={isOtherRoomModalOpen}
        onRequestClose={() => setIsOtherRoomModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h2>その他の部屋について</h2>
        <p>
          書斎、趣味部屋、納戸など、
          特定の用途がある部屋です。
          用途に応じて広さを設定してください。
        </p>
        <ul>
          <li>3畳：納戸・収納部屋向け</li>
          <li>4.5畳：書斎・趣味部屋向け</li>
          <li>6畳：多目的スペース向け</li>
        </ul>
        <button
          onClick={() => setIsOtherRoomModalOpen(false)}
          className={styles.modalCloseButton}
        >
          閉じる
        </button>
      </Modal>
    </div>
  );
};

export default HouseSizeClient;