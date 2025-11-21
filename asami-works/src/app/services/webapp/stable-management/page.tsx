"use client";

import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./StableManagement.module.css";
import RelatedLinks from "@/components/RelatedLinks";

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 型定義
interface Owner {
  id: number;
  name: string;
  horses: number;
  balance: number;
  status: string;
  email?: string;
  phone?: string;
}

interface HorseOwnership {
  ownerId: number;
  ownerName: string;
  share: number; // 所有割合 (0.0 ~ 1.0)
  isPrimary: boolean; // 主所有者かどうか
}

interface Horse {
  id: number;
  name: string;
  owner: string; // 主所有者の名前（表示用）
  ownership: HorseOwnership[]; // 共同所有情報
  status: string;
  dailyRate: number;
  birthDate?: string;
  breed?: string;
  color?: string;
}

interface Invoice {
  id: string;
  owner: string;
  amount: number;
  status: "draft" | "issued" | "paid"; // ステータスを明確に
  dueDate: string;
  issueDate?: string;
  paidDate?: string;
  items?: InvoiceItem[]; // 請求明細
}

interface InvoiceItem {
  id: number;
  horseName: string;
  itemType: "stable" | "medical" | "facility";
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  shareAmount?: number; // 按分後の金額
}

interface HealthRecord {
  id: number;
  horseName: string;
  date: string;
  weight: number;
  morningTemperature: number;
  afternoonTemperature: number;
  preTrainingHeartRate: number;
  postTrainingHeartRate: number;
  recoveryTimeMinutes: number;
  lacticAcid?: number;
  bap?: number;
  dRoms?: number;
  notes: string;
}

interface MedicalRecord {
  id: number;
  horseName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  cost: number;
  veterinarian: string;
}

interface FacilityUsage {
  id: number;
  horseName: string;
  date: string;
  facilityType: "training" | "shoeing" | "transport" | "other";
  facilityName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

// stable-managementの最新データを参考にした詳細なダミーデータ
const initialOwners: Owner[] = [
  { id: 1, name: "山田 太郎", horses: 3, balance: 150000, status: "通常", email: "yamada@example.com", phone: "090-1234-5678" },
  { id: 2, name: "佐藤 花子", horses: 2, balance: -50000, status: "未入金", email: "sato@example.com", phone: "090-2345-6789" },
  { id: 3, name: "鈴木 一郎", horses: 2, balance: 200000, status: "通常", email: "suzuki@example.com", phone: "090-3456-7890" },
  { id: 4, name: "田中商事株式会社", horses: 2, balance: 120000, status: "通常", email: "tanaka-corp@example.com", phone: "06-1234-5678" },
  { id: 5, name: "高橋 健二", horses: 1, balance: 80000, status: "通常", email: "takahashi@example.com", phone: "090-5678-9012" },
  { id: 6, name: "渡辺 美咲", horses: 1, balance: 95000, status: "通常", email: "watanabe@example.com", phone: "090-6789-0123" },
  { id: 7, name: "伊藤 慎太郎", horses: 1, balance: 110000, status: "通常", email: "ito@example.com", phone: "090-7890-1234" },
  { id: 8, name: "中村 雅子", horses: 1, balance: 88000, status: "通常", email: "nakamura@example.com", phone: "090-8901-2345" },
  { id: 9, name: "小林産業グループ", horses: 1, balance: 250000, status: "通常", email: "kobayashi-g@example.com", phone: "03-1234-5678" },
];

const initialHorses: Horse[] = [
  {
    id: 1,
    name: "サクラコマチ",
    owner: "山田 太郎",
    ownership: [{ ownerId: 1, ownerName: "山田 太郎", share: 1.0, isPrimary: true }],
    status: "入厩中",
    dailyRate: 13200,
    birthDate: "2021-03-15",
    breed: "サラブレッド",
    color: "鹿毛"
  },
  {
    id: 2,
    name: "ハヤテノゴトク",
    owner: "佐藤 花子",
    ownership: [{ ownerId: 2, ownerName: "佐藤 花子", share: 1.0, isPrimary: true }],
    status: "放牧中",
    dailyRate: 6600,
    birthDate: "2020-02-20",
    breed: "サラブレッド",
    color: "栗毛"
  },
  {
    id: 3,
    name: "ミラクルスター",
    owner: "鈴木 一郎",
    ownership: [{ ownerId: 3, ownerName: "鈴木 一郎", share: 1.0, isPrimary: true }],
    status: "入厩中",
    dailyRate: 13200,
    birthDate: "2019-04-10",
    breed: "サラブレッド",
    color: "芦毛"
  },
  {
    id: 4,
    name: "ゴールデンドリーム",
    owner: "山田 太郎",
    ownership: [{ ownerId: 1, ownerName: "山田 太郎", share: 1.0, isPrimary: true }],
    status: "入厩中",
    dailyRate: 13200,
    birthDate: "2021-05-05",
    breed: "サラブレッド",
    color: "黒鹿毛"
  },
  {
    id: 5,
    name: "ダイヤモンドキング", // 共同所有馬 - stable-managementを参考
    owner: "田中商事株式会社",
    ownership: [
      { ownerId: 4, ownerName: "田中商事株式会社", share: 0.50, isPrimary: true },
      { ownerId: 9, ownerName: "小林産業グループ", share: 0.25, isPrimary: false },
      { ownerId: 1, ownerName: "山田 太郎", share: 0.25, isPrimary: false }
    ],
    status: "調整中",
    dailyRate: 13200,
    birthDate: "2020-03-15",
    breed: "サラブレッド",
    color: "鹿毛"
  },
  {
    id: 6,
    name: "ロイヤルサンダー",
    owner: "鈴木 一郎",
    ownership: [{ ownerId: 3, ownerName: "鈴木 一郎", share: 1.0, isPrimary: true }],
    status: "入厩中",
    dailyRate: 13200,
    birthDate: "2020-03-12",
    breed: "サラブレッド",
    color: "青鹿毛"
  },
  {
    id: 7,
    name: "レインボーフラッシュ", // 共同所有馬
    owner: "田中商事株式会社",
    ownership: [
      { ownerId: 4, ownerName: "田中商事株式会社", share: 0.40, isPrimary: true },
      { ownerId: 5, ownerName: "高橋 健二", share: 0.30, isPrimary: false },
      { ownerId: 6, ownerName: "渡辺 美咲", share: 0.30, isPrimary: false }
    ],
    status: "入厩中",
    dailyRate: 13200,
    birthDate: "2021-01-20",
    breed: "サラブレッド",
    color: "栗毛"
  },
];

const initialInvoices: Invoice[] = [
  {
    id: "2511-001",
    owner: "山田 太郎",
    amount: 450000,
    status: "paid",
    dueDate: "2025-11-30",
    issueDate: "2025-11-01",
    paidDate: "2025-11-28",
    items: [
      { id: 1, horseName: "サクラコマチ", itemType: "stable", description: "入厩料（11月分）", quantity: 30, unitPrice: 13200, amount: 396000 },
      { id: 2, horseName: "ゴールデンドリーム", itemType: "stable", description: "入厩料（11月分）", quantity: 30, unitPrice: 13200, amount: 396000 },
      { id: 3, horseName: "ダイヤモンドキング", itemType: "stable", description: "入厩料（11月分・按分25%）", quantity: 30, unitPrice: 13200, amount: 396000, shareAmount: 99000 },
    ]
  },
  {
    id: "2511-002",
    owner: "佐藤 花子",
    amount: 280000,
    status: "issued",
    dueDate: "2025-11-30",
    issueDate: "2025-11-01",
    items: [
      { id: 1, horseName: "ハヤテノゴトク", itemType: "stable", description: "放牧料（11月分）", quantity: 30, unitPrice: 6600, amount: 198000 },
      { id: 2, horseName: "ハヤテノゴトク", itemType: "medical", description: "定期健康診断", quantity: 1, unitPrice: 5500, amount: 5500 },
    ]
  },
  {
    id: "2511-003",
    owner: "鈴木 一郎",
    amount: 650000,
    status: "paid",
    dueDate: "2025-11-30",
    issueDate: "2025-11-01",
    paidDate: "2025-11-25",
  },
  {
    id: "2511-004",
    owner: "田中商事株式会社",
    amount: 395000,
    status: "draft",
    dueDate: "2025-11-30",
    items: [
      { id: 1, horseName: "ダイヤモンドキング", itemType: "stable", description: "入厩料（11月分・按分50%）", quantity: 30, unitPrice: 13200, amount: 396000, shareAmount: 198000 },
      { id: 2, horseName: "レインボーフラッシュ", itemType: "stable", description: "入厩料（11月分・按分40%）", quantity: 30, unitPrice: 13200, amount: 396000, shareAmount: 158400 },
    ]
  },
];

// 施設利用記録データ
const initialFacilityUsages: FacilityUsage[] = [
  { id: 1, horseName: "サクラコマチ", date: "2025-11-18", facilityType: "training", facilityName: "坂路調教", quantity: 1, unitPrice: 3300, totalAmount: 3300 },
  { id: 2, horseName: "ミラクルスター", date: "2025-11-17", facilityType: "training", facilityName: "ウォータートレッドミル", quantity: 1, unitPrice: 4400, totalAmount: 4400 },
  { id: 3, horseName: "ゴールデンドリーム", date: "2025-11-16", facilityType: "shoeing", facilityName: "全肢装蹄", quantity: 1, unitPrice: 15400, totalAmount: 15400 },
  { id: 4, horseName: "ロイヤルサンダー", date: "2025-11-15", facilityType: "training", facilityName: "トラックコース調教", quantity: 1, unitPrice: 2200, totalAmount: 2200 },
  { id: 5, horseName: "ダイヤモンドキング", date: "2025-11-14", facilityType: "transport", facilityName: "競馬場輸送（往復）", quantity: 1, unitPrice: 33000, totalAmount: 33000 },
  { id: 6, horseName: "レインボーフラッシュ", date: "2025-11-13", facilityType: "other", facilityName: "馬体マッサージ", quantity: 1, unitPrice: 5500, totalAmount: 5500 },
];

const initialHealthRecords: HealthRecord[] = [
  // サクラコマチの記録（過去3ヶ月）
  { id: 1, horseName: "サクラコマチ", date: "2025-11-20", weight: 504.5, morningTemperature: 37.8, afternoonTemperature: 38.0, preTrainingHeartRate: 42, postTrainingHeartRate: 165, recoveryTimeMinutes: 12, lacticAcid: 5.2, bap: 2450.0, dRoms: 310.0, notes: "調子良好、回復も早い" },
  { id: 2, horseName: "サクラコマチ", date: "2025-11-18", weight: 502.5, morningTemperature: 37.7, afternoonTemperature: 38.1, preTrainingHeartRate: 44, postTrainingHeartRate: 170, recoveryTimeMinutes: 14, lacticAcid: 5.8, bap: 2420.0, dRoms: 320.0, notes: "通常トレーニング" },
  { id: 3, horseName: "サクラコマチ", date: "2025-11-15", weight: 500.8, morningTemperature: 37.9, afternoonTemperature: 38.2, preTrainingHeartRate: 43, postTrainingHeartRate: 168, recoveryTimeMinutes: 13, lacticAcid: 5.5, bap: 2410.0, dRoms: 315.0, notes: "良好な状態" },
  { id: 4, horseName: "サクラコマチ", date: "2025-11-12", weight: 498.2, morningTemperature: 38.0, afternoonTemperature: 38.3, preTrainingHeartRate: 45, postTrainingHeartRate: 175, recoveryTimeMinutes: 15, lacticAcid: 6.2, bap: 2380.0, dRoms: 330.0, notes: "やや疲労気味" },
  { id: 5, horseName: "サクラコマチ", date: "2025-11-08", weight: 496.5, morningTemperature: 37.8, afternoonTemperature: 38.1, preTrainingHeartRate: 44, postTrainingHeartRate: 172, recoveryTimeMinutes: 14, lacticAcid: 5.9, bap: 2400.0, dRoms: 325.0, notes: "減量中" },
  { id: 6, horseName: "サクラコマチ", date: "2025-11-05", weight: 495.0, morningTemperature: 37.7, afternoonTemperature: 38.0, preTrainingHeartRate: 43, postTrainingHeartRate: 169, recoveryTimeMinutes: 13, lacticAcid: 5.4, bap: 2430.0, dRoms: 318.0, notes: "順調" },
  { id: 7, horseName: "サクラコマチ", date: "2025-10-28", weight: 493.8, morningTemperature: 37.9, afternoonTemperature: 38.2, preTrainingHeartRate: 45, postTrainingHeartRate: 173, recoveryTimeMinutes: 15, lacticAcid: 6.0, bap: 2390.0, dRoms: 328.0, notes: "負荷を上げた" },
  { id: 8, horseName: "サクラコマチ", date: "2025-10-22", weight: 492.5, morningTemperature: 37.8, afternoonTemperature: 38.1, preTrainingHeartRate: 44, postTrainingHeartRate: 171, recoveryTimeMinutes: 14, lacticAcid: 5.7, bap: 2405.0, dRoms: 322.0, notes: "通常" },
  { id: 9, horseName: "サクラコマチ", date: "2025-09-15", weight: 490.0, morningTemperature: 37.7, afternoonTemperature: 38.0, preTrainingHeartRate: 43, postTrainingHeartRate: 168, recoveryTimeMinutes: 13, lacticAcid: 5.3, bap: 2425.0, dRoms: 316.0, notes: "夏の調整終了" },

  // ミラクルスターの記録
  { id: 10, horseName: "ミラクルスター", date: "2025-11-19", weight: 523.0, morningTemperature: 37.6, afternoonTemperature: 37.9, preTrainingHeartRate: 40, postTrainingHeartRate: 158, recoveryTimeMinutes: 11, lacticAcid: 4.8, bap: 2480.0, dRoms: 295.0, notes: "理想的な体重、好調" },
  { id: 11, horseName: "ミラクルスター", date: "2025-11-17", weight: 521.4, morningTemperature: 37.7, afternoonTemperature: 38.0, preTrainingHeartRate: 41, postTrainingHeartRate: 162, recoveryTimeMinutes: 12, lacticAcid: 5.0, bap: 2470.0, dRoms: 300.0, notes: "理想的な体重" },
  { id: 12, horseName: "ミラクルスター", date: "2025-11-14", weight: 520.8, morningTemperature: 37.8, afternoonTemperature: 38.1, preTrainingHeartRate: 42, postTrainingHeartRate: 165, recoveryTimeMinutes: 13, lacticAcid: 5.3, bap: 2455.0, dRoms: 305.0, notes: "安定している" },
  { id: 13, horseName: "ミラクルスター", date: "2025-11-10", weight: 519.5, morningTemperature: 37.9, afternoonTemperature: 38.2, preTrainingHeartRate: 43, postTrainingHeartRate: 168, recoveryTimeMinutes: 14, lacticAcid: 5.6, bap: 2440.0, dRoms: 312.0, notes: "通常" },
  { id: 14, horseName: "ミラクルスター", date: "2025-10-20", weight: 518.0, morningTemperature: 37.7, afternoonTemperature: 38.0, preTrainingHeartRate: 41, postTrainingHeartRate: 163, recoveryTimeMinutes: 12, lacticAcid: 5.1, bap: 2465.0, dRoms: 302.0, notes: "好調維持" },

  // ハヤテノゴトクの記録
  { id: 15, horseName: "ハヤテノゴトク", date: "2025-11-16", weight: 468.3, morningTemperature: 37.6, afternoonTemperature: 37.8, preTrainingHeartRate: 38, postTrainingHeartRate: 150, recoveryTimeMinutes: 10, lacticAcid: 4.2, bap: 2500.0, dRoms: 285.0, notes: "軽めの調整、順調" },
  { id: 16, horseName: "ハヤテノゴトク", date: "2025-11-13", weight: 467.8, morningTemperature: 37.7, afternoonTemperature: 37.9, preTrainingHeartRate: 39, postTrainingHeartRate: 152, recoveryTimeMinutes: 11, lacticAcid: 4.5, bap: 2490.0, dRoms: 290.0, notes: "放牧中" },
  { id: 17, horseName: "ハヤテノゴトク", date: "2025-10-18", weight: 466.5, morningTemperature: 37.8, afternoonTemperature: 38.0, preTrainingHeartRate: 40, postTrainingHeartRate: 155, recoveryTimeMinutes: 12, lacticAcid: 4.7, bap: 2485.0, dRoms: 292.0, notes: "通常" },

  // ゴールデンドリームの記録
  { id: 18, horseName: "ゴールデンドリーム", date: "2025-11-18", weight: 515.0, morningTemperature: 37.9, afternoonTemperature: 38.1, preTrainingHeartRate: 44, postTrainingHeartRate: 172, recoveryTimeMinutes: 15, lacticAcid: 6.1, bap: 2400.0, dRoms: 325.0, notes: "強めの調教" },
  { id: 19, horseName: "ゴールデンドリーム", date: "2025-11-15", weight: 513.5, morningTemperature: 37.8, afternoonTemperature: 38.0, preTrainingHeartRate: 43, postTrainingHeartRate: 169, recoveryTimeMinutes: 14, lacticAcid: 5.8, bap: 2415.0, dRoms: 320.0, notes: "調整中" },
  { id: 20, horseName: "ゴールデンドリーム", date: "2025-11-11", weight: 512.0, morningTemperature: 37.7, afternoonTemperature: 37.9, preTrainingHeartRate: 42, postTrainingHeartRate: 166, recoveryTimeMinutes: 13, lacticAcid: 5.5, bap: 2425.0, dRoms: 315.0, notes: "良好" },
];

const initialMedicalRecords: MedicalRecord[] = [
  { id: 1, horseName: "サクラコマチ", date: "2025-11-10", diagnosis: "定期健康診断", treatment: "ビタミン注射", cost: 8800, veterinarian: "田中 獣医" },
  { id: 2, horseName: "ハヤテノゴトク", date: "2025-11-12", diagnosis: "跛行検査", treatment: "消炎鎮痛剤注射", cost: 12100, veterinarian: "佐藤 獣医" },
  { id: 3, horseName: "ミラクルスター", date: "2025-11-14", diagnosis: "呼吸器検査", treatment: "抗生物質投与", cost: 17600, veterinarian: "田中 獣医" },
];

export default function StableManagementDemo() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "owners" | "horses" | "invoices" | "health" | "training" | "medical" | "facility">("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "detail" | "pdf">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [healthPeriod, setHealthPeriod] = useState<"1month" | "3months" | "6months" | "1year" | "all">("3months");
  const [selectedHorse, setSelectedHorse] = useState<string>("all");
  const [trainingInputMode, setTrainingInputMode] = useState<"by-horse" | "by-item">("by-horse");
  const [selectedTrainingHorse, setSelectedTrainingHorse] = useState<string>("");
  const [selectedTrainingItem, setSelectedTrainingItem] = useState<string>("1");

  // ナビゲーション用の状態
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isRecordsOpen, setIsRecordsOpen] = useState(true);
  const [isManagementOpen, setIsManagementOpen] = useState(true);

  // State管理
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [horses, setHorses] = useState<Horse[]>(initialHorses);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [facilityUsages, setFacilityUsages] = useState<FacilityUsage[]>(initialFacilityUsages);

  // 期間フィルタリング関数
  const filterHealthRecordsByPeriod = (records: HealthRecord[]) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (healthPeriod) {
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return records;
    }

    return records.filter(r => new Date(r.date) >= cutoffDate);
  };

  // フィルター
  const filteredOwners = owners;
  const filteredHorses = horses;
  const filteredInvoices = invoices;
  const baseHealthRecords = healthRecords.filter(h => selectedHorse === "all" || h.horseName === selectedHorse);
  const filteredHealthRecords = filterHealthRecordsByPeriod(baseHealthRecords);
  const filteredMedicalRecords = medicalRecords;
  const filteredFacilityUsages = facilityUsages;

  // グラフ用データ準備
  const sortedHealthRecords = [...filteredHealthRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 馬ごとにデータをグループ化
  const horseColors = [
    { border: "#1a73e8", bg: "rgba(26, 115, 232, 0.1)" },
    { border: "#34a853", bg: "rgba(52, 168, 83, 0.1)" },
    { border: "#fbbc04", bg: "rgba(251, 188, 4, 0.1)" },
    { border: "#ea4335", bg: "rgba(234, 67, 53, 0.1)" },
    { border: "#9334e6", bg: "rgba(147, 52, 230, 0.1)" },
    { border: "#00bcd4", bg: "rgba(0, 188, 212, 0.1)" },
  ];

  const groupedByHorse = sortedHealthRecords.reduce((acc, record) => {
    if (!acc[record.horseName]) {
      acc[record.horseName] = [];
    }
    acc[record.horseName].push(record);
    return acc;
  }, {} as Record<string, typeof sortedHealthRecords>);

  const allDates = Array.from(new Set(sortedHealthRecords.map(r => r.date))).sort();
  const chartLabels = allDates;

  // 各馬のデータセットを作成
  const createDatasets = (valueExtractor: (record: HealthRecord) => number) => {
    return Object.entries(groupedByHorse).map(([horseName, records], index) => {
      const colorIndex = index % horseColors.length;
      const dataMap = new Map(records.map(r => [r.date, valueExtractor(r)]));
      const data = allDates.map(date => dataMap.get(date) ?? null);

      return {
        label: horseName,
        data,
        borderColor: horseColors[colorIndex].border,
        backgroundColor: horseColors[colorIndex].bg,
        tension: 0.4,
        spanGaps: true,
      };
    });
  };

  const chartWeightDatasets = createDatasets(r => r.weight);
  const chartMorningTempDatasets = createDatasets(r => r.morningTemperature);
  const chartAfternoonTempDatasets = createDatasets(r => r.afternoonTemperature);
  const chartPreHeartRateDatasets = createDatasets(r => r.preTrainingHeartRate);
  const chartPostHeartRateDatasets = createDatasets(r => r.postTrainingHeartRate);
  const chartRecoveryTimeDatasets = createDatasets(r => r.recoveryTimeMinutes);
  const chartLacticAcidDatasets = createDatasets(r => r.lacticAcid || 0);
  const chartBapDatasets = createDatasets(r => r.bap || 0);
  const chartDRomsDatasets = createDatasets(r => r.dRoms || 0);

  // 馬のリスト（健康記録から）
  const uniqueHorses = Array.from(new Set(healthRecords.map(r => r.horseName)));

  // モーダル開閉
  const openAddModal = () => {
    setModalType("add");
    setSelectedItem(null);
    setShowModal(true);
  };

  const openDetailModal = (item: any) => {
    setModalType("detail");
    setSelectedItem(item);
    setShowModal(true);
  };

  const openPdfModal = (invoice: Invoice) => {
    setModalType("pdf");
    setSelectedItem(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // データ追加（デモ用）
  const handleAddOwner = () => {
    const newOwner: Owner = {
      id: owners.length + 1,
      name: "新規 馬主",
      horses: 0,
      balance: 0,
      status: "通常",
      email: "new@example.com",
      phone: "090-0000-0000"
    };
    setOwners([...owners, newOwner]);
    closeModal();
  };

  const handleAddHorse = () => {
    const newHorse: Horse = {
      id: horses.length + 1,
      name: "新規 競走馬",
      owner: "山田 太郎",
      ownership: [{ ownerId: 1, ownerName: "山田 太郎", share: 1.0, isPrimary: true }],
      status: "入厩中",
      dailyRate: 13200,
      birthDate: "2023-01-01",
      breed: "サラブレッド",
      color: "鹿毛"
    };
    setHorses([...horses, newHorse]);
    closeModal();
  };

  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      {/* Heroセクション - コンパクト版 */}
      <section className={styles.heroCompact}>
        <div className={styles.heroCompactContent}>
          <h1 className={styles.heroCompactTitle}>
            厩舎管理システム サンプル <span className={styles.heroCompactSubtitle}>インタラクティブデモ</span>
          </h1>
          <div className={styles.heroCompactDescription}>
            <h2 className={styles.overviewLabel}>システム概要</h2>
            <p className={styles.overviewText}>
              このデモは、LIO Racing Cloud 厩舎管理システムを参考に作成されています。
              競走馬の管理、馬主情報、健康記録、診療記録、請求書発行など、複雑なビジネスロジックを持つ本格的なシステムです。
            </p>
          </div>
        </div>
      </section>

      {/* デモアプリケーション画面 */}
      <div className={styles.demoAppContainer}>
        {/* アプリヘッダー（固定） */}
        <div className={styles.appHeader}>
          <div className={styles.appHeaderLeft}>
            <button
              className={styles.hamburgerButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="メニュー"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div
              className={styles.appLogo}
              onClick={() => {
                setActiveTab("dashboard");
                const appContent = document.querySelector(`.${styles.appContent}`);
                appContent?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.logoIcon}>🏇</span>
              <span className={styles.logoText}>厩舎管理システム サンプル</span>
            </div>
          </div>
          <div className={styles.appHeaderRight}>
            <span className={styles.userName}>山田太郎</span>
            <button className={styles.logoutButton}>ログアウト</button>
          </div>
        </div>

        {/* サイドバーナビゲーション */}
        <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
          <nav className={styles.sidebarNav}>
            {/* 登録グループ */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
              >
                <span>登録</span>
                <span className={`${styles.arrow} ${isRegistrationOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isRegistrationOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "owners" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("owners"); setIsMobileMenuOpen(false); }}
                  >
                    馬主管理
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "horses" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("horses"); setIsMobileMenuOpen(false); }}
                  >
                    競走馬管理
                  </button>
                </div>
              )}
            </div>

            {/* 記録グループ */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsRecordsOpen(!isRecordsOpen)}
              >
                <span>記録</span>
                <span className={`${styles.arrow} ${isRecordsOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isRecordsOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "health" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("health"); setIsMobileMenuOpen(false); }}
                  >
                    健康記録
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "training" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("training"); setIsMobileMenuOpen(false); }}
                  >
                    トレーニング記録
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "medical" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("medical"); setIsMobileMenuOpen(false); }}
                  >
                    診療記録
                  </button>
                </div>
              )}
            </div>

            {/* 管理グループ */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsManagementOpen(!isManagementOpen)}
              >
                <span>管理</span>
                <span className={`${styles.arrow} ${isManagementOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isManagementOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "invoices" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("invoices"); setIsMobileMenuOpen(false); }}
                  >
                    請求書管理
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "facility" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("facility"); setIsMobileMenuOpen(false); }}
                  >
                    施設利用
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* モバイルメニューオーバーレイ */}
        {isMobileMenuOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* スクロール可能なコンテンツエリア */}
        <div className={styles.appContent}>
          {/* ダッシュボード */}
          {activeTab === "dashboard" && (
          <section id="dashboard" className={styles.dashboardSection}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>ダッシュボード</h2>
              <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>登録馬主数</p>
                <p className={styles.statValue}>{owners.length}名</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🐴</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>在厩頭数</p>
                <p className={styles.statValue}>
                  {horses.filter(h => h.status === "入厩中").length}頭
                </p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📄</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>今月の請求書</p>
                <p className={styles.statValue}>{invoices.length}件</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚠️</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>未入金</p>
                <p className={styles.statValue}>
                  {invoices.filter(i => i.status === "issued").length}件
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          )}

      {/* データ管理セクション */}
      {activeTab !== "dashboard" && (
      <section className={styles.dataSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>データ管理</h2>

          {/* タブナビゲーション */}
          <div className={styles.tabNav}>
            <button
              className={`${styles.tabButton} ${activeTab === "owners" ? styles.active : ""}`}
              onClick={() => setActiveTab("owners")}
            >
              馬主管理
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "horses" ? styles.active : ""}`}
              onClick={() => setActiveTab("horses")}
            >
              競走馬管理
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "health" ? styles.active : ""}`}
              onClick={() => setActiveTab("health")}
            >
              健康記録
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "training" ? styles.active : ""}`}
              onClick={() => setActiveTab("training")}
            >
              トレーニング記録
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "medical" ? styles.active : ""}`}
              onClick={() => setActiveTab("medical")}
            >
              診療記録
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "invoices" ? styles.active : ""}`}
              onClick={() => setActiveTab("invoices")}
            >
              請求書管理
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "facility" ? styles.active : ""}`}
              onClick={() => setActiveTab("facility")}
            >
              施設利用
            </button>
          </div>

          {/* 馬主管理タブ */}
          {activeTab === "owners" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>馬主一覧（{filteredOwners.length}件）</h3>
                <button className={styles.addButton} onClick={openAddModal}>
                  + 新規登録
                </button>
              </div>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>氏名</th>
                    <th>所有馬数</th>
                    <th>残高</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((owner) => (
                    <tr key={owner.id}>
                      <td>{owner.id}</td>
                      <td>{owner.name}</td>
                      <td>{owner.horses}頭</td>
                      <td className={owner.balance < 0 ? styles.negative : ""}>
                        ¥{owner.balance.toLocaleString()}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[owner.status === "未入金" ? "warning" : "success"]}`}>
                          {owner.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionButton} onClick={() => openDetailModal(owner)}>詳細</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 競走馬管理タブ */}
          {activeTab === "horses" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>競走馬一覧（{filteredHorses.length}件）</h3>
                <button className={styles.addButton} onClick={openAddModal}>
                  + 新規登録
                </button>
              </div>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>馬名</th>
                    <th>馬主</th>
                    <th>所有形態</th>
                    <th>状態</th>
                    <th>日額料金</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHorses.map((horse) => {
                    const isSharedOwnership = horse.ownership.length > 1;
                    return (
                      <tr key={horse.id}>
                        <td>{horse.id}</td>
                        <td>
                          <div>
                            {horse.name}
                            {isSharedOwnership && (
                              <span className={styles.sharedBadge}>共同所有</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {isSharedOwnership ? (
                            <div className={styles.ownershipList}>
                              {horse.ownership.map((own, idx) => (
                                <div key={idx} className={styles.ownershipItem}>
                                  {own.ownerName}
                                  <span className={styles.sharePercent}>
                                    {(own.share * 100).toFixed(0)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            horse.owner
                          )}
                        </td>
                        <td>
                          {isSharedOwnership ? (
                            <span className={`${styles.statusBadge} ${styles.shared}`}>
                              {horse.ownership.length}名共同
                            </span>
                          ) : (
                            <span className={`${styles.statusBadge} ${styles.single}`}>
                              単独所有
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[horse.status === "入厩中" ? "info" : "secondary"]}`}>
                            {horse.status}
                          </span>
                        </td>
                        <td>¥{horse.dailyRate.toLocaleString()}</td>
                        <td>
                          <button className={styles.actionButton} onClick={() => openDetailModal(horse)}>詳細</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 健康記録タブ */}
          {activeTab === "health" && (
            <>
              {/* 期間選択・馬選択 */}
              <div className={styles.periodSelection}>
                <div className={styles.periodControls}>
                  <div className={styles.controlGroup}>
                    <label htmlFor="horseSelect">対象馬：</label>
                    <select
                      id="horseSelect"
                      className={styles.formSelect}
                      value={selectedHorse}
                      onChange={(e) => setSelectedHorse(e.target.value)}
                    >
                      <option value="all">全頭</option>
                      {uniqueHorses.map((horse) => (
                        <option key={horse} value={horse}>
                          {horse}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.controlGroup}>
                    <label htmlFor="periodSelect">表示期間：</label>
                    <select
                      id="periodSelect"
                      className={styles.formSelect}
                      value={healthPeriod}
                      onChange={(e) => setHealthPeriod(e.target.value as typeof healthPeriod)}
                    >
                      <option value="1month">過去1ヶ月</option>
                      <option value="3months">過去3ヶ月</option>
                      <option value="6months">過去6ヶ月</option>
                      <option value="1year">過去1年</option>
                      <option value="all">全期間</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* グラフセクション */}
              <div className={styles.chartsSection}>
                <h3>健康データ推移</h3>
                <div className={styles.chartsGrid}>
                  {/* 体重グラフ */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>体重推移</h4>
                      <span className={styles.chartUnit}>kg</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: chartWeightDatasets,
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: selectedHorse === "all", position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            y: { beginAtZero: false },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* 体温グラフ（朝・午後） */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>体温推移</h4>
                      <span className={styles.chartUnit}>℃</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: selectedHorse === "all"
                            ? chartMorningTempDatasets.map(ds => ({ ...ds, label: `${ds.label}（朝）` }))
                            : [
                                ...chartMorningTempDatasets.map(ds => ({ ...ds, label: "朝体温", borderColor: "#ff9800", backgroundColor: "rgba(255, 152, 0, 0.1)" })),
                                ...chartAfternoonTempDatasets.map(ds => ({ ...ds, label: "午後体温", borderColor: "#d32f2f", backgroundColor: "rgba(211, 47, 47, 0.1)" }))
                              ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: true, position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            y: { beginAtZero: false, min: 36, max: 40 },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* 心拍数グラフ（トレーニング前後） */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>心拍数推移</h4>
                      <span className={styles.chartUnit}>拍/分</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: selectedHorse === "all"
                            ? chartPreHeartRateDatasets.map(ds => ({ ...ds, label: `${ds.label}（トレ前）` }))
                            : [
                                ...chartPreHeartRateDatasets.map(ds => ({ ...ds, label: "トレーニング前", borderColor: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)" })),
                                ...chartPostHeartRateDatasets.map(ds => ({ ...ds, label: "トレーニング後", borderColor: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" }))
                              ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: true, position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            y: { beginAtZero: false },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* 回復時間グラフ */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>心拍回復時間</h4>
                      <span className={styles.chartUnit}>分</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: chartRecoveryTimeDatasets,
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: selectedHorse === "all", position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            y: { beginAtZero: false },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* 乳酸値グラフ */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>乳酸値推移</h4>
                      <span className={styles.chartUnit}>mmol/L</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: chartLacticAcidDatasets,
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: selectedHorse === "all", position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: {
                            y: { beginAtZero: false },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* 酸化ストレス指標グラフ */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h4>酸化ストレス指標</h4>
                      <span className={styles.chartUnit}>U.CARR</span>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={{
                          labels: chartLabels,
                          datasets: selectedHorse === "all"
                            ? chartBapDatasets.map(ds => ({ ...ds, label: `${ds.label}（BAP）` }))
                            : [
                                ...chartBapDatasets.map(ds => ({ ...ds, label: "BAP (抗酸化力)", borderColor: "#06b6d4", backgroundColor: "rgba(6, 182, 212, 0.1)", yAxisID: "y" })),
                                ...chartDRomsDatasets.map(ds => ({ ...ds, label: "d-ROMs (酸化度)", borderColor: "#ec4899", backgroundColor: "rgba(236, 72, 153, 0.1)", yAxisID: "y1" }))
                              ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: true, position: "top" },
                            tooltip: { mode: "index", intersect: false },
                          },
                          scales: selectedHorse === "all"
                            ? {
                                y: { beginAtZero: false },
                              }
                            : {
                                y: {
                                  type: "linear",
                                  display: true,
                                  position: "left",
                                  title: { display: true, text: "BAP" },
                                },
                                y1: {
                                  type: "linear",
                                  display: true,
                                  position: "right",
                                  title: { display: true, text: "d-ROMs" },
                                  grid: { drawOnChartArea: false },
                                },
                              },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* データテーブル */}
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <h3>健康記録一覧（{filteredHealthRecords.length}件）</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>馬名</th>
                        <th>日付</th>
                        <th>体重<br/>(kg)</th>
                        <th>朝体温<br/>(℃)</th>
                        <th>午後体温<br/>(℃)</th>
                        <th>トレ前心拍<br/>(/分)</th>
                        <th>トレ後心拍<br/>(/分)</th>
                        <th>回復時間<br/>(分)</th>
                        <th>乳酸値<br/>(mmol/L)</th>
                        <th>BAP<br/>(U.CARR)</th>
                        <th>d-ROMs<br/>(U.CARR)</th>
                        <th>備考</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHealthRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.horseName}</td>
                          <td>{record.date}</td>
                          <td>{record.weight}</td>
                          <td>{record.morningTemperature}</td>
                          <td>{record.afternoonTemperature}</td>
                          <td>{record.preTrainingHeartRate}</td>
                          <td>{record.postTrainingHeartRate}</td>
                          <td>{record.recoveryTimeMinutes}</td>
                          <td>{record.lacticAcid || "-"}</td>
                          <td>{record.bap || "-"}</td>
                          <td>{record.dRoms || "-"}</td>
                          <td className={styles.notesCell}>{record.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* トレーニング記録タブ */}
          {activeTab === "training" && (
            <>
              {/* ヘッダー説明 */}
              <div className={styles.tabDescription}>
                <h3>トレーニング記録入力</h3>
                <p>
                  トレーニング実施後、以下の項目を入力して記録を登録します。登録されたデータは健康記録タブのグラフに反映されます。
                </p>
              </div>

              {/* 入力モード・対象選択 */}
              <div className={styles.periodSelection}>
                <div className={styles.periodControls}>
                  <div className={styles.controlGroup}>
                    <label>入力モード：</label>
                    <div className={styles.modeToggle}>
                      <button
                        className={`${styles.modeButton} ${trainingInputMode === "by-horse" ? styles.active : ""}`}
                        onClick={() => setTrainingInputMode("by-horse")}
                      >
                        馬別入力
                      </button>
                      <button
                        className={`${styles.modeButton} ${trainingInputMode === "by-item" ? styles.active : ""}`}
                        onClick={() => setTrainingInputMode("by-item")}
                      >
                        項目別入力
                      </button>
                    </div>
                  </div>

                  {trainingInputMode === "by-horse" && (
                    <div className={styles.controlGroup}>
                      <label htmlFor="trainingHorseSelect">対象馬：</label>
                      <select
                        id="trainingHorseSelect"
                        className={styles.formSelect}
                        value={selectedTrainingHorse}
                        onChange={(e) => setSelectedTrainingHorse(e.target.value)}
                      >
                        <option value="">-- 馬を選択してください --</option>
                        {horses.filter(h => h.status === "入厩中").map((horse) => (
                          <option key={horse.id} value={horse.name}>
                            {horse.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {trainingInputMode === "by-item" && (
                    <div className={styles.controlGroup}>
                      <label htmlFor="trainingItemSelect">入力項目：</label>
                      <select
                        id="trainingItemSelect"
                        className={styles.formSelect}
                        value={selectedTrainingItem}
                        onChange={(e) => setSelectedTrainingItem(e.target.value)}
                      >
                        <option value="1">1. 乳酸値測定</option>
                        <option value="2">2. 体温測定</option>
                        <option value="3">3. 体重測定</option>
                        <option value="4">4. 心拍数測定</option>
                        <option value="5">5. 酸化ストレス指標</option>
                        <option value="6">6. メモ</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* 入力フォームセクション */}
              <div className={styles.formSection}>
                {/* 馬別入力フォーム */}
                {trainingInputMode === "by-horse" && selectedTrainingHorse && (
                  <div className={styles.formGrid}>
                {/* 1. 乳酸値測定 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>1</span>
                    <h4>乳酸値測定</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>トレーニング後乳酸値</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="5.2" step="0.1" disabled />
                        <span className={styles.unitLabel}>mmol/L</span>
                      </div>
                    </div>
                    <p className={styles.formHint}>
                      トレーニング直後の血中乳酸値を記録します。正常範囲は4〜7 mmol/Lです。
                    </p>
                  </div>
                </div>

                {/* 2. 体温測定 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>2</span>
                    <h4>体温測定</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>朝の体温</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="37.8" step="0.1" disabled />
                        <span className={styles.unitLabel}>℃</span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>午後の体温</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="38.0" step="0.1" disabled />
                        <span className={styles.unitLabel}>℃</span>
                      </div>
                    </div>
                    <p className={styles.formHint}>
                      朝と午後の体温を測定し、体調変化を把握します。正常範囲は37.5〜38.5℃です。
                    </p>
                  </div>
                </div>

                {/* 3. 体重測定 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>3</span>
                    <h4>体重測定</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>体重</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="504.5" step="0.1" disabled />
                        <span className={styles.unitLabel}>kg</span>
                      </div>
                    </div>
                    <p className={styles.formHint}>
                      毎日同じ時間に測定し、体重の増減を管理します。急激な変動は体調不良のサインです。
                    </p>
                  </div>
                </div>

                {/* 4. 心拍数測定 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>4</span>
                    <h4>心拍数測定</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>トレーニング前心拍数</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="42" disabled />
                        <span className={styles.unitLabel}>拍/分</span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>トレーニング後心拍数</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="165" disabled />
                        <span className={styles.unitLabel}>拍/分</span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>回復時間</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="12" disabled />
                        <span className={styles.unitLabel}>分</span>
                      </div>
                    </div>
                    <p className={styles.formHint}>
                      トレーニング前後の心拍数と、安静時心拍に戻るまでの時間を記録します。回復時間が短いほど体力が向上しています。
                    </p>
                  </div>
                </div>

                {/* 5. 酸化ストレス指標 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>5</span>
                    <h4>酸化ストレス指標</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>BAP（抗酸化力）</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="2450.0" step="0.1" disabled />
                        <span className={styles.unitLabel}>μmol/L</span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>d-ROMs（酸化度）</label>
                      <div className={styles.inputWithUnit}>
                        <input type="number" placeholder="310.0" step="0.1" disabled />
                        <span className={styles.unitLabel}>U.CARR</span>
                      </div>
                    </div>
                    <p className={styles.formHint}>
                      酸化ストレスの指標。BAPが高く、d-ROMsが低いほど良好な状態です。
                      トレーニング負荷の適切性を判断する重要な指標です。
                    </p>
                  </div>
                </div>

                {/* 6. メモ */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <span className={styles.formCardNumber}>6</span>
                    <h4>メモ</h4>
                  </div>
                  <div className={styles.formCardBody}>
                    <div className={styles.formGroup}>
                      <label>トレーニング内容・特記事項</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="調子良好、回復も早い。坂路調教5F強め。"
                        rows={4}
                        disabled
                      />
                    </div>
                    <p className={styles.formHint}>
                      トレーニング内容、馬の様子、気になる点などを自由に記録します。
                    </p>
                  </div>
                </div>
                </div>
              )}

              {/* 項目別入力フォーム */}
              {trainingInputMode === "by-item" && (
                <div className={styles.itemInputSection}>
                  {/* 項目1: 乳酸値測定 */}
                  {selectedTrainingItem === "1" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>1</span>
                        乳酸値測定（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputRow}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <div className={styles.inputWithUnit}>
                            <input type="number" placeholder="5.2" step="0.1" disabled />
                            <span className={styles.unitLabel}>mmol/L</span>
                          </div>
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        トレーニング直後の血中乳酸値を記録します。正常範囲は4〜7 mmol/Lです。
                      </p>
                    </div>
                  )}

                  {/* 項目2: 体温測定 */}
                  {selectedTrainingItem === "2" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>2</span>
                        体温測定（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputGroup}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <div className={styles.tempInputs}>
                            <div className={styles.tempField}>
                              <label>朝体温</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="37.8" step="0.1" disabled />
                                <span className={styles.unitLabel}>℃</span>
                              </div>
                            </div>
                            <div className={styles.tempField}>
                              <label>午後体温</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="38.0" step="0.1" disabled />
                                <span className={styles.unitLabel}>℃</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        朝と午後の体温を測定し、体調変化を把握します。正常範囲は37.5〜38.5℃です。
                      </p>
                    </div>
                  )}

                  {/* 項目3: 体重測定 */}
                  {selectedTrainingItem === "3" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>3</span>
                        体重測定（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputRow}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <div className={styles.inputWithUnit}>
                            <input type="number" placeholder="504.5" step="0.1" disabled />
                            <span className={styles.unitLabel}>kg</span>
                          </div>
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        毎日同じ時間に測定し、体重の増減を管理します。急激な変動は体調不良のサインです。
                      </p>
                    </div>
                  )}

                  {/* 項目4: 心拍数測定 */}
                  {selectedTrainingItem === "4" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>4</span>
                        心拍数測定（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputGroup}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <div className={styles.heartRateInputs}>
                            <div className={styles.heartRateField}>
                              <label>トレ前</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="42" disabled />
                                <span className={styles.unitLabel}>拍/分</span>
                              </div>
                            </div>
                            <div className={styles.heartRateField}>
                              <label>トレ後</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="165" disabled />
                                <span className={styles.unitLabel}>拍/分</span>
                              </div>
                            </div>
                            <div className={styles.heartRateField}>
                              <label>回復時間</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="12" disabled />
                                <span className={styles.unitLabel}>分</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        トレーニング前後の心拍数と、安静時心拍に戻るまでの時間を記録します。
                      </p>
                    </div>
                  )}

                  {/* 項目5: 酸化ストレス指標 */}
                  {selectedTrainingItem === "5" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>5</span>
                        酸化ストレス指標（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputGroup}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <div className={styles.stressInputs}>
                            <div className={styles.stressField}>
                              <label>BAP</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="2450.0" step="0.1" disabled />
                                <span className={styles.unitLabel}>μmol/L</span>
                              </div>
                            </div>
                            <div className={styles.stressField}>
                              <label>d-ROMs</label>
                              <div className={styles.inputWithUnit}>
                                <input type="number" placeholder="310.0" step="0.1" disabled />
                                <span className={styles.unitLabel}>U.CARR</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        酸化ストレスの指標。BAPが高く、d-ROMsが低いほど良好な状態です。
                      </p>
                    </div>
                  )}

                  {/* 項目6: メモ */}
                  {selectedTrainingItem === "6" && (
                    <div className={styles.allHorsesForm}>
                      <h4 className={styles.itemTitle}>
                        <span className={styles.itemNumber}>6</span>
                        メモ（全頭）
                      </h4>
                      {horses.filter(h => h.status === "入厩中").map((horse) => (
                        <div key={horse.id} className={styles.horseInputGroup}>
                          <span className={styles.horseName}>{horse.name}</span>
                          <textarea
                            className={styles.formTextarea}
                            placeholder="調子良好、回復も早い。"
                            rows={3}
                            disabled
                          />
                        </div>
                      ))}
                      <p className={styles.formHint}>
                        トレーニング内容、馬の様子、気になる点などを自由に記録します。
                      </p>
                    </div>
                  )}
                </div>
              )}

                {/* 馬が未選択の場合のメッセージ */}
                {trainingInputMode === "by-horse" && !selectedTrainingHorse && (
                  <div className={styles.emptyState}>
                    <p>対象馬を選択してください</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 診療記録タブ */}
          {activeTab === "medical" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>診療記録一覧（{filteredMedicalRecords.length}件）</h3>
              </div>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>馬名</th>
                    <th>日付</th>
                    <th>診断</th>
                    <th>処置</th>
                    <th>費用</th>
                    <th>獣医師</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicalRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.horseName}</td>
                      <td>{record.date}</td>
                      <td>{record.diagnosis}</td>
                      <td>{record.treatment}</td>
                      <td>¥{record.cost.toLocaleString()}</td>
                      <td>{record.veterinarian}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 請求書管理タブ */}
          {activeTab === "invoices" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>請求書一覧（{filteredInvoices.length}件）</h3>
                <button className={styles.addButton}>
                  + 一括生成
                </button>
              </div>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>請求ID</th>
                    <th>馬主名</th>
                    <th>請求額</th>
                    <th>支払期日</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const statusClass =
                      invoice.status === "draft" ? "secondary" :
                      invoice.status === "issued" ? "warning" :
                      invoice.status === "paid" ? "success" : "secondary";
                    const statusLabel =
                      invoice.status === "draft" ? "下書き" :
                      invoice.status === "issued" ? "発行済み" :
                      invoice.status === "paid" ? "支払済み" : invoice.status;

                    return (
                      <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>{invoice.owner}</td>
                        <td>¥{invoice.amount.toLocaleString()}</td>
                        <td>{invoice.dueDate}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionButton} onClick={() => openDetailModal(invoice)}>詳細</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 施設利用タブ */}
          {activeTab === "facility" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>施設利用記録一覧（{filteredFacilityUsages.length}件）</h3>
              </div>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>馬名</th>
                    <th>利用日</th>
                    <th>種別</th>
                    <th>施設名</th>
                    <th>数量</th>
                    <th>単価</th>
                    <th>合計金額</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFacilityUsages.map((facility) => {
                    const facilityTypeLabels: Record<string, string> = {
                      training: "調教",
                      shoeing: "装蹄",
                      transport: "輸送",
                      other: "その他",
                    };
                    return (
                      <tr key={facility.id}>
                        <td>{facility.horseName}</td>
                        <td>{facility.date}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles.info}`}>
                            {facilityTypeLabels[facility.facilityType]}
                          </span>
                        </td>
                        <td>{facility.facilityName}</td>
                        <td>{facility.quantity}</td>
                        <td>¥{facility.unitPrice.toLocaleString()}</td>
                        <td>¥{facility.totalAmount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      )}

        </div> {/* appContent end */}

      {/* モーダル */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {modalType === "add" && (
              <>
                <h3>新規登録</h3>
                <p className={styles.modalText}>
                  {activeTab === "owners" && "新しい馬主を登録しますか？"}
                  {activeTab === "horses" && "新しい競走馬を登録しますか？"}
                </p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.confirmButton}
                    onClick={activeTab === "owners" ? handleAddOwner : handleAddHorse}
                  >
                    登録する
                  </button>
                  <button className={styles.cancelButton} onClick={closeModal}>
                    キャンセル
                  </button>
                </div>
              </>
            )}
            {modalType === "detail" && selectedItem && (
              <>
                <h3>詳細情報</h3>
                <div className={styles.detailContent}>
                  {activeTab === "owners" && (
                    <>
                      <p><strong>氏名:</strong> {selectedItem.name}</p>
                      <p><strong>メール:</strong> {selectedItem.email}</p>
                      <p><strong>電話:</strong> {selectedItem.phone}</p>
                      <p><strong>所有馬数:</strong> {selectedItem.horses}頭</p>
                      <p><strong>残高:</strong> ¥{selectedItem.balance.toLocaleString()}</p>
                    </>
                  )}
                  {activeTab === "horses" && (
                    <>
                      <p><strong>馬名:</strong> {selectedItem.name}</p>

                      {/* 所有者情報 */}
                      <div className={styles.ownershipSection}>
                        <p className={styles.ownershipTitle}><strong>所有者情報</strong></p>
                        {selectedItem.ownership?.map((owner, index) => (
                          <div key={index} className={styles.ownerItem}>
                            <p>
                              {owner.ownerName}
                              {owner.isPrimary && <span className={styles.primaryBadge}>（主取引先）</span>}
                              : {(owner.share * 100).toFixed(1)}%
                            </p>
                          </div>
                        ))}
                      </div>

                      <p><strong>生年月日:</strong> {selectedItem.birthDate}</p>
                      <p><strong>品種:</strong> {selectedItem.breed}</p>
                      <p><strong>毛色:</strong> {selectedItem.color}</p>
                      <p><strong>ステータス:</strong> {selectedItem.status}</p>
                      <p><strong>1日あたり預託料:</strong> ¥{selectedItem.dailyRate.toLocaleString()}</p>
                    </>
                  )}
                </div>
                <div className={styles.modalButtons}>
                  <button className={styles.cancelButton} onClick={closeModal}>
                    閉じる
                  </button>
                </div>
              </>
            )}
            {modalType === "invoice" && selectedItem && (
              <>
                <h3>請求書プレビュー</h3>
                <div className={styles.invoicePreview}>
                  <div className={styles.invoiceHeader}>
                    <h4>請求書</h4>
                    <p>No. {selectedItem.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className={styles.invoiceBody}>
                    <div className={styles.invoiceRow}>
                      <span className={styles.invoiceLabel}>発行日:</span>
                      <span>{selectedItem.issueDate}</span>
                    </div>
                    <div className={styles.invoiceRow}>
                      <span className={styles.invoiceLabel}>支払期限:</span>
                      <span>{selectedItem.dueDate}</span>
                    </div>
                    <div className={styles.invoiceRow}>
                      <span className={styles.invoiceLabel}>請求先:</span>
                      <span>{selectedItem.owner}</span>
                    </div>
                    <div className={styles.invoiceSummary}>
                      <div className={styles.invoiceRow}>
                        <span className={styles.invoiceLabel}>預託料:</span>
                        <span>¥{selectedItem.boardingFee.toLocaleString()}</span>
                      </div>
                      <div className={styles.invoiceRow}>
                        <span className={styles.invoiceLabel}>診療費:</span>
                        <span>¥{selectedItem.medicalFee.toLocaleString()}</span>
                      </div>
                      <div className={styles.invoiceRow}>
                        <span className={styles.invoiceLabel}>その他:</span>
                        <span>¥{selectedItem.otherFee.toLocaleString()}</span>
                      </div>
                      <div className={`${styles.invoiceRow} ${styles.total}`}>
                        <span className={styles.invoiceLabel}>合計金額:</span>
                        <span>¥{selectedItem.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={styles.invoiceRow}>
                      <span className={styles.invoiceLabel}>ステータス:</span>
                      <span className={selectedItem.status === "未払い" ? styles.statusUnpaid : styles.statusPaid}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalButtons}>
                  <button className={styles.confirmButton} onClick={() => alert("PDFダウンロード機能はデモでは実装されていません")}>
                    PDFダウンロード
                  </button>
                  <button className={styles.cancelButton} onClick={closeModal}>
                    閉じる
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      </div> {/* demoAppContainer end */}

      {/* クライアントの課題解決ポイント */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>このシステムで解決できる課題</h2>
          <p className={styles.sectionDescription}>
            厩舎経営者様が抱える課題を、オーダーメイドのWEBアプリで解決します
          </p>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>📋 紙・Excelの管理からの脱却</h3>
              <p>「複数のExcelファイルで管理していて、データの整合性が取れない」<br/>→ 一元管理システムで情報を統合し、常に最新のデータを参照できます。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>💰 請求業務の効率化</h3>
              <p>「毎月の馬主への請求書作成に何時間もかかる」<br/>→ 診療費・施設利用料などを自動集計し、ワンクリックで請求書を生成できます。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📊 健康管理の見える化</h3>
              <p>「競走馬の健康状態の推移を把握しづらい」<br/>→ 体重・体温などの記録をグラフ化し、異変を早期発見できます。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🌐 どこからでもアクセス</h3>
              <p>「外出先でもデータを確認したい」<br/>→ クラウド型システムで、スマホ・タブレットからもアクセス可能です。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🔒 セキュリティとバックアップ</h3>
              <p>「大切なデータを安全に管理したい」<br/>→ 暗号化通信・定期バックアップで、データを確実に保護します。</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🚀 将来的な機能拡張</h3>
              <p>「今後、新しい機能を追加したい」<br/>→ 柔軟な設計で、ビジネスの成長に合わせて機能を追加できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 技術スタックセクション */}
      <section className={styles.techSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>技術スタック</h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <h4>Backend</h4>
              <p>Node.js, Express.js</p>
            </div>
            <div className={styles.techItem}>
              <h4>Database</h4>
              <p>SQLite3, PostgreSQL対応</p>
            </div>
            <div className={styles.techItem}>
              <h4>PDF生成</h4>
              <p>Puppeteer</p>
            </div>
            <div className={styles.techItem}>
              <h4>Excel出力</h4>
              <p>ExcelJS</p>
            </div>
            <div className={styles.techItem}>
              <h4>Security</h4>
              <p>Helmet, Rate-limit</p>
            </div>
            <div className={styles.techItem}>
              <h4>Frontend</h4>
              <p>EJS, Chart.js</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>このようなシステムを開発します</h2>
          <p className={styles.ctaDescription}>
            複雑なビジネスロジックを持つ業務システムの開発実績があります。<br />
            貴社の業務に最適なシステムをご提案いたします。
          </p>
          <a href="/form" className={styles.ctaButton}>
            無料相談を予約する
          </a>
        </div>
      </section>

      <RelatedLinks />
    </div>
  );
}
