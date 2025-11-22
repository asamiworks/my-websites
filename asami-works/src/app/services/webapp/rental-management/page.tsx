"use client";

import { useState } from "react";
import styles from "./RentalManagement.module.css";

// 型定義
interface Owner {
  id: number;
  name: string;
  properties: number;
  totalUnits: number;
  email: string;
  phone: string;
  address: string;
  type: "individual" | "corporate";
}

interface Room {
  roomNumber: string;
  floor: number;
  layout: string;
  area: number;
  rent: number;
  status: "vacant" | "occupied" | "reserved";
  tenant?: string;
  contractEndDate?: string;
}

interface Property {
  id: number;
  name: string;
  ownerId: number;
  ownerName: string;
  address: string;
  type: "apartment" | "mansion" | "house";
  totalUnits: number;
  occupiedUnits: number;
  rooms: Room[];
  buildYear: number;
}

interface Tenant {
  id: number;
  name: string;
  propertyId: number;
  propertyName: string;
  roomNumber: string;
  rent: number;
  contractStartDate: string;
  contractEndDate: string;
  phone: string;
  email: string;
  emergencyContact: string;
  status: "active" | "notice" | "moving";
}

interface Contract {
  id: string;
  tenantId: number;
  tenantName: string;
  propertyName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
  keyMoney: number;
  renewalFee: number;
  status: "active" | "expired" | "renewed";
}

interface Invoice {
  id: string;
  tenantId: number;
  tenantName: string;
  propertyName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: "draft" | "issued" | "paid" | "overdue";
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  amount: number;
}

interface MaintenanceRequest {
  id: number;
  propertyName: string;
  roomNumber: string;
  tenantName: string;
  category: "water" | "electric" | "equipment" | "other";
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "assigned" | "in-progress" | "completed";
  requestDate: string;
  completedDate?: string;
  contractor?: string;
  cost?: number;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  workingHours: {
    start: string;
    end: string;
  }[];
}

interface ViewingReservation {
  id: number;
  propertyId: number;
  propertyName: string;
  roomNumber: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  staffId: number;
  staffName: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

interface CompanyInfo {
  name: string;
  staff: Staff[];
  contractors: {
    id: number;
    name: string;
    specialty: string;
    phone: string;
  }[];
}

// サンプルデータ
const initialOwners: Owner[] = [
  { id: 1, name: "山田不動産株式会社", properties: 3, totalUnits: 45, email: "yamada-fudosan@example.com", phone: "03-1234-5678", address: "東京都港区六本木1-1-1", type: "corporate" },
  { id: 2, name: "佐藤 太郎", properties: 2, totalUnits: 18, email: "sato@example.com", phone: "090-1234-5678", address: "東京都渋谷区代々木2-2-2", type: "individual" },
  { id: 3, name: "鈴木商事グループ", properties: 2, totalUnits: 30, email: "suzuki-group@example.com", phone: "03-2345-6789", address: "東京都新宿区西新宿3-3-3", type: "corporate" },
  { id: 4, name: "田中 花子", properties: 1, totalUnits: 8, email: "tanaka@example.com", phone: "090-2345-6789", address: "東京都世田谷区三軒茶屋4-4-4", type: "individual" },
  { id: 5, name: "高橋産業", properties: 1, totalUnits: 12, email: "takahashi@example.com", phone: "03-3456-7890", address: "東京都品川区大崎5-5-5", type: "corporate" },
];

const initialProperties: Property[] = [
  {
    id: 1,
    name: "サンシャインマンション",
    ownerId: 1,
    ownerName: "山田不動産株式会社",
    address: "東京都港区六本木2-10-5",
    type: "mansion",
    totalUnits: 20,
    occupiedUnits: 18,
    buildYear: 2018,
    rooms: [
      { roomNumber: "101", floor: 1, layout: "1K", area: 25, rent: 85000, status: "occupied", tenant: "伊藤 健一", contractEndDate: "2026-03-31" },
      { roomNumber: "102", floor: 1, layout: "1K", area: 25, rent: 85000, status: "occupied", tenant: "渡辺 美咲", contractEndDate: "2025-12-31" },
      { roomNumber: "103", floor: 1, layout: "1K", area: 25, rent: 85000, status: "vacant" },
      { roomNumber: "201", floor: 2, layout: "1LDK", area: 40, rent: 120000, status: "occupied", tenant: "中村 雅人", contractEndDate: "2026-06-30" },
      { roomNumber: "202", floor: 2, layout: "1LDK", area: 40, rent: 120000, status: "vacant" },
    ]
  },
  {
    id: 2,
    name: "グリーンハイツ",
    ownerId: 2,
    ownerName: "佐藤 太郎",
    address: "東京都渋谷区恵比寿3-15-8",
    type: "apartment",
    totalUnits: 10,
    occupiedUnits: 9,
    buildYear: 2015,
    rooms: [
      { roomNumber: "A-101", floor: 1, layout: "2LDK", area: 55, rent: 180000, status: "occupied", tenant: "小林 真理子", contractEndDate: "2026-01-31" },
      { roomNumber: "A-102", floor: 1, layout: "2LDK", area: 55, rent: 180000, status: "occupied", tenant: "加藤 慎太郎", contractEndDate: "2025-11-30" },
      { roomNumber: "B-201", floor: 2, layout: "1K", area: 28, rent: 95000, status: "occupied", tenant: "吉田 優子", contractEndDate: "2026-02-28" },
    ]
  },
  {
    id: 3,
    name: "パークサイドレジデンス",
    ownerId: 1,
    ownerName: "山田不動産株式会社",
    address: "東京都目黒区中目黒1-5-12",
    type: "mansion",
    totalUnits: 15,
    occupiedUnits: 13,
    buildYear: 2020,
    rooms: [
      { roomNumber: "301", floor: 3, layout: "2LDK", area: 60, rent: 200000, status: "occupied", tenant: "松本 大輔", contractEndDate: "2026-05-31" },
      { roomNumber: "302", floor: 3, layout: "2LDK", area: 60, rent: 200000, status: "reserved" },
      { roomNumber: "401", floor: 4, layout: "3LDK", area: 75, rent: 280000, status: "occupied", tenant: "井上 奈々", contractEndDate: "2026-08-31" },
    ]
  },
  {
    id: 4,
    name: "リバーサイドアパート",
    ownerId: 3,
    ownerName: "鈴木商事グループ",
    address: "東京都江東区豊洲4-8-20",
    type: "apartment",
    totalUnits: 18,
    occupiedUnits: 16,
    buildYear: 2017,
    rooms: [
      { roomNumber: "101", floor: 1, layout: "1DK", area: 32, rent: 105000, status: "occupied", tenant: "木村 拓也", contractEndDate: "2026-04-30" },
      { roomNumber: "102", floor: 1, layout: "1DK", area: 32, rent: 105000, status: "vacant" },
      { roomNumber: "201", floor: 2, layout: "1LDK", area: 45, rent: 140000, status: "occupied", tenant: "斎藤 麻衣", contractEndDate: "2025-12-31" },
    ]
  },
  {
    id: 5,
    name: "オーシャンビューマンション",
    ownerId: 3,
    ownerName: "鈴木商事グループ",
    address: "東京都港区台場2-3-15",
    type: "mansion",
    totalUnits: 12,
    occupiedUnits: 11,
    buildYear: 2019,
    rooms: [
      { roomNumber: "501", floor: 5, layout: "2LDK", area: 65, rent: 220000, status: "occupied", tenant: "清水 健太", contractEndDate: "2026-07-31" },
      { roomNumber: "502", floor: 5, layout: "2LDK", area: 65, rent: 220000, status: "occupied", tenant: "森 由美子", contractEndDate: "2026-09-30" },
    ]
  },
];

const initialTenants: Tenant[] = [
  { id: 1, name: "伊藤 健一", propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "101", rent: 85000, contractStartDate: "2024-04-01", contractEndDate: "2026-03-31", phone: "090-1111-2222", email: "ito@example.com", emergencyContact: "伊藤父 090-3333-4444", status: "active" },
  { id: 2, name: "渡辺 美咲", propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "102", rent: 85000, contractStartDate: "2024-01-01", contractEndDate: "2025-12-31", phone: "090-2222-3333", email: "watanabe@example.com", emergencyContact: "渡辺母 090-4444-5555", status: "active" },
  { id: 3, name: "中村 雅人", propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "201", rent: 120000, contractStartDate: "2024-07-01", contractEndDate: "2026-06-30", phone: "090-3333-4444", email: "nakamura@example.com", emergencyContact: "中村妻 090-5555-6666", status: "active" },
  { id: 4, name: "小林 真理子", propertyId: 2, propertyName: "グリーンハイツ", roomNumber: "A-101", rent: 180000, contractStartDate: "2024-02-01", contractEndDate: "2026-01-31", phone: "090-4444-5555", email: "kobayashi@example.com", emergencyContact: "小林夫 090-6666-7777", status: "active" },
  { id: 5, name: "加藤 慎太郎", propertyId: 2, propertyName: "グリーンハイツ", roomNumber: "A-102", rent: 180000, contractStartDate: "2023-12-01", contractEndDate: "2025-11-30", phone: "090-5555-6666", email: "kato@example.com", emergencyContact: "加藤姉 090-7777-8888", status: "notice" },
  { id: 6, name: "吉田 優子", propertyId: 2, propertyName: "グリーンハイツ", roomNumber: "B-201", rent: 95000, contractStartDate: "2024-03-01", contractEndDate: "2026-02-28", phone: "090-6666-7777", email: "yoshida@example.com", emergencyContact: "吉田父 090-8888-9999", status: "active" },
  { id: 7, name: "松本 大輔", propertyId: 3, propertyName: "パークサイドレジデンス", roomNumber: "301", rent: 200000, contractStartDate: "2024-06-01", contractEndDate: "2026-05-31", phone: "090-7777-8888", email: "matsumoto@example.com", emergencyContact: "松本妻 090-9999-0000", status: "active" },
  { id: 8, name: "井上 奈々", propertyId: 3, propertyName: "パークサイドレジデンス", roomNumber: "401", rent: 280000, contractStartDate: "2024-09-01", contractEndDate: "2026-08-31", phone: "090-8888-9999", email: "inoue@example.com", emergencyContact: "井上夫 090-0000-1111", status: "active" },
  { id: 9, name: "木村 拓也", propertyId: 4, propertyName: "リバーサイドアパート", roomNumber: "101", rent: 105000, contractStartDate: "2024-05-01", contractEndDate: "2026-04-30", phone: "090-9999-0000", email: "kimura@example.com", emergencyContact: "木村母 090-1111-2222", status: "active" },
  { id: 10, name: "斎藤 麻衣", propertyId: 4, propertyName: "リバーサイドアパート", roomNumber: "201", rent: 140000, contractStartDate: "2024-01-01", contractEndDate: "2025-12-31", phone: "090-0000-1111", email: "saito@example.com", emergencyContact: "斎藤父 090-2222-3333", status: "active" },
  { id: 11, name: "清水 健太", propertyId: 5, propertyName: "オーシャンビューマンション", roomNumber: "501", rent: 220000, contractStartDate: "2024-08-01", contractEndDate: "2026-07-31", phone: "090-1010-2020", email: "shimizu@example.com", emergencyContact: "清水妻 090-3030-4040", status: "active" },
  { id: 12, name: "森 由美子", propertyId: 5, propertyName: "オーシャンビューマンション", roomNumber: "502", rent: 220000, contractStartDate: "2024-10-01", contractEndDate: "2026-09-30", phone: "090-2020-3030", email: "mori@example.com", emergencyContact: "森夫 090-4040-5050", status: "active" },
];

const initialInvoices: Invoice[] = [
  {
    id: "2511-001",
    tenantId: 1,
    tenantName: "伊藤 健一",
    propertyName: "サンシャインマンション",
    roomNumber: "101",
    amount: 85000,
    dueDate: "2025-11-27",
    issueDate: "2025-11-01",
    status: "paid",
    items: [
      { description: "家賃（11月分）", amount: 85000 }
    ]
  },
  {
    id: "2511-002",
    tenantId: 2,
    tenantName: "渡辺 美咲",
    propertyName: "サンシャインマンション",
    roomNumber: "102",
    amount: 85000,
    dueDate: "2025-11-27",
    issueDate: "2025-11-01",
    status: "issued",
    items: [
      { description: "家賃（11月分）", amount: 85000 }
    ]
  },
  {
    id: "2511-003",
    tenantId: 3,
    tenantName: "中村 雅人",
    propertyName: "サンシャインマンション",
    roomNumber: "201",
    amount: 120000,
    dueDate: "2025-11-27",
    issueDate: "2025-11-01",
    status: "paid",
    items: [
      { description: "家賃（11月分）", amount: 120000 }
    ]
  },
  {
    id: "2511-004",
    tenantId: 4,
    tenantName: "小林 真理子",
    propertyName: "グリーンハイツ",
    roomNumber: "A-101",
    amount: 180000,
    dueDate: "2025-11-27",
    issueDate: "2025-11-01",
    status: "paid",
    items: [
      { description: "家賃（11月分）", amount: 180000 }
    ]
  },
  {
    id: "2511-005",
    tenantId: 5,
    tenantName: "加藤 慎太郎",
    propertyName: "グリーンハイツ",
    roomNumber: "A-102",
    amount: 180000,
    dueDate: "2025-11-27",
    issueDate: "2025-11-01",
    status: "overdue",
    items: [
      { description: "家賃（11月分）", amount: 180000 }
    ]
  },
];

const initialMaintenanceRequests: MaintenanceRequest[] = [
  { id: 1, propertyName: "サンシャインマンション", roomNumber: "101", tenantName: "伊藤 健一", category: "water", description: "キッチン水栓から水漏れ", priority: "high", status: "assigned", requestDate: "2025-11-20", contractor: "水道工事サービス" },
  { id: 2, propertyName: "グリーンハイツ", roomNumber: "A-101", tenantName: "小林 真理子", category: "electric", description: "リビング照明器具の不点灯", priority: "medium", status: "in-progress", requestDate: "2025-11-19", contractor: "電気工事センター" },
  { id: 3, propertyName: "パークサイドレジデンス", roomNumber: "301", tenantName: "松本 大輔", category: "equipment", description: "エアコンの冷暖房が効かない", priority: "high", status: "pending", requestDate: "2025-11-21" },
  { id: 4, propertyName: "リバーサイドアパート", roomNumber: "201", tenantName: "斎藤 麻衣", category: "other", description: "玄関ドアの鍵が固い", priority: "low", status: "pending", requestDate: "2025-11-18" },
  { id: 5, propertyName: "サンシャインマンション", roomNumber: "102", tenantName: "渡辺 美咲", category: "water", description: "トイレの水が流れにくい", priority: "medium", status: "completed", requestDate: "2025-11-15", completedDate: "2025-11-17", contractor: "水道工事サービス", cost: 15000 },
  { id: 6, propertyName: "オーシャンビューマンション", roomNumber: "501", tenantName: "清水 健太", category: "equipment", description: "換気扇の異音", priority: "low", status: "assigned", requestDate: "2025-11-20", contractor: "設備メンテナンス" },
];

const companyInfo: CompanyInfo = {
  name: "アサミ不動産管理",
  staff: [
    { id: 1, name: "田中 太郎", role: "営業担当", workingHours: [{ start: "09:00", end: "18:00" }] },
    { id: 2, name: "佐藤 花子", role: "営業担当", workingHours: [{ start: "10:00", end: "19:00" }] },
    { id: 3, name: "鈴木 一郎", role: "管理担当", workingHours: [{ start: "09:00", end: "18:00" }] },
    { id: 4, name: "高橋 美咲", role: "営業担当", workingHours: [{ start: "09:00", end: "18:00" }] },
    { id: 5, name: "渡辺 健二", role: "管理担当", workingHours: [{ start: "10:00", end: "19:00" }] },
  ],
  contractors: [
    { id: 1, name: "水道工事サービス", specialty: "水回り", phone: "03-1111-2222" },
    { id: 2, name: "電気工事センター", specialty: "電気設備", phone: "03-2222-3333" },
    { id: 3, name: "設備メンテナンス", specialty: "空調・設備", phone: "03-3333-4444" },
    { id: 4, name: "リフォーム工房", specialty: "内装・外装", phone: "03-4444-5555" },
  ]
};

const initialViewingReservations: ViewingReservation[] = [
  { id: 1, propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "103", customerName: "山本 太郎", customerPhone: "090-1234-5678", date: "2025-11-23", time: "10:00", staffId: 1, staffName: "田中 太郎", status: "scheduled", notes: "初回来店" },
  { id: 2, propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "202", customerName: "佐々木 美穂", customerPhone: "090-2345-6789", date: "2025-11-23", time: "14:00", staffId: 2, staffName: "佐藤 花子", status: "scheduled", notes: "3月入居希望" },
  { id: 3, propertyId: 2, propertyName: "グリーンハイツ", roomNumber: "A-101", customerName: "林 健太", customerPhone: "090-3456-7890", date: "2025-11-24", time: "11:00", staffId: 4, staffName: "高橋 美咲", status: "scheduled", notes: "ペット可希望" },
  { id: 4, propertyId: 3, propertyName: "パークサイドレジデンス", roomNumber: "302", customerName: "大野 奈々", customerPhone: "090-4567-8901", date: "2025-11-24", time: "15:00", staffId: 1, staffName: "田中 太郎", status: "scheduled", notes: "2月入居予定" },
  { id: 5, propertyId: 4, propertyName: "リバーサイドアパート", roomNumber: "102", customerName: "石井 雅人", customerPhone: "090-5678-9012", date: "2025-11-25", time: "10:30", staffId: 2, staffName: "佐藤 花子", status: "scheduled", notes: "駅近希望" },
  { id: 6, propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "103", customerName: "藤田 麻衣", customerPhone: "090-6789-0123", date: "2025-11-25", time: "13:00", staffId: 4, staffName: "高橋 美咲", status: "scheduled", notes: "" },
  { id: 7, propertyId: 3, propertyName: "パークサイドレジデンス", roomNumber: "302", customerName: "岡本 拓也", customerPhone: "090-7890-1234", date: "2025-11-26", time: "11:00", staffId: 1, staffName: "田中 太郎", status: "scheduled", notes: "即入居可" },
  { id: 8, propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "103", customerName: "内田 優子", customerPhone: "090-8901-2345", date: "2025-11-26", time: "16:00", staffId: 2, staffName: "佐藤 花子", status: "scheduled", notes: "家具付き希望" },
  { id: 9, propertyId: 4, propertyName: "リバーサイドアパート", roomNumber: "102", customerName: "村上 健", customerPhone: "090-9012-3456", date: "2025-11-27", time: "10:00", staffId: 4, staffName: "高橋 美咲", status: "scheduled", notes: "" },
  { id: 10, propertyId: 1, propertyName: "サンシャインマンション", roomNumber: "202", customerName: "中川 真理", customerPhone: "090-0123-4567", date: "2025-11-27", time: "14:30", staffId: 1, staffName: "田中 太郎", status: "scheduled", notes: "2人入居" },
];

export default function RentalManagementDemo() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "masters" | "contracts" | "finance" | "maintenance" | "viewings" | "reports">("dashboard");
  const [masterTab, setMasterTab] = useState<"owners" | "properties" | "tenants" | "company">("owners");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "detail">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("week");
  const [selectedDate, setSelectedDate] = useState(new Date("2025-11-23"));

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);
  const [isReportsOpen, setIsReportsOpen] = useState(true);

  // Data states
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(initialMaintenanceRequests);
  const [viewingReservations, setViewingReservations] = useState<ViewingReservation[]>(initialViewingReservations);

  // Search & Filter states
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerTypeFilter, setOwnerTypeFilter] = useState<"all" | "individual" | "corporate">("all");
  const [ownerSort, setOwnerSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "id", order: "asc" });

  const [propertySearch, setPropertySearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<"all" | "apartment" | "mansion" | "house">("all");
  const [propertySort, setPropertySort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "id", order: "asc" });

  const [tenantSearch, setTenantSearch] = useState("");
  const [tenantStatusFilter, setTenantStatusFilter] = useState<"all" | "active" | "notice" | "moving">("all");
  const [tenantSort, setTenantSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "id", order: "asc" });

  const [contractSearch, setContractSearch] = useState("");
  const [contractSort, setContractSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "name", order: "asc" });

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<"all" | "draft" | "issued" | "paid" | "overdue">("all");
  const [invoiceSort, setInvoiceSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "id", order: "asc" });

  const [maintenanceSearch, setMaintenanceSearch] = useState("");
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<"all" | "pending" | "assigned" | "in-progress" | "completed">("all");
  const [maintenancePriorityFilter, setMaintenancePriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [maintenanceSort, setMaintenanceSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "id", order: "asc" });

  const [viewingSearch, setViewingSearch] = useState("");
  const [viewingStatusFilter, setViewingStatusFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [viewingSort, setViewingSort] = useState<{ key: string; order: "asc" | "desc" }>({ key: "date", order: "asc" });

  // Calculations
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : "0";
  const monthlyRevenue = tenants.reduce((sum, t) => sum + t.rent, 0);
  const overdueInvoices = invoices.filter(i => i.status === "overdue").length;
  const pendingMaintenance = maintenanceRequests.filter(m => m.status === "pending").length;
  const expiringContracts = tenants.filter(t => {
    const endDate = new Date(t.contractEndDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return endDate <= threeMonthsFromNow;
  }).length;

  // Modal handlers
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

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Calendar helper functions
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(date.setDate(diff));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(new Date(selectedDate));

  // Sort handler
  const handleSort = (
    currentSort: { key: string; order: "asc" | "desc" },
    setSort: React.Dispatch<React.SetStateAction<{ key: string; order: "asc" | "desc" }>>,
    key: string
  ) => {
    if (currentSort.key === key) {
      setSort({ key, order: currentSort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, order: "asc" });
    }
  };

  // Generic sort function
  const sortData = <T,>(data: T[], sortConfig: { key: string; order: "asc" | "desc" }): T[] => {
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.order === "asc" ? comparison : -comparison;
    });
  };

  // Filtered and sorted data
  const filteredOwners = sortData(
    owners
      .filter(o => ownerTypeFilter === "all" || o.type === ownerTypeFilter)
      .filter(o =>
        o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        o.phone.includes(ownerSearch)
      ),
    ownerSort
  );

  const filteredProperties = sortData(
    properties
      .filter(p => propertyTypeFilter === "all" || p.type === propertyTypeFilter)
      .filter(p =>
        p.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.address.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(propertySearch.toLowerCase())
      ),
    propertySort
  );

  const filteredTenants = sortData(
    tenants
      .filter(t => tenantStatusFilter === "all" || t.status === tenantStatusFilter)
      .filter(t =>
        t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        t.propertyName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        t.roomNumber.toLowerCase().includes(tenantSearch.toLowerCase())
      ),
    tenantSort
  );

  const filteredContracts = sortData(
    tenants.filter(t =>
      t.name.toLowerCase().includes(contractSearch.toLowerCase()) ||
      t.propertyName.toLowerCase().includes(contractSearch.toLowerCase()) ||
      t.roomNumber.toLowerCase().includes(contractSearch.toLowerCase())
    ),
    contractSort
  );

  const filteredInvoices = sortData(
    invoices
      .filter(i => invoiceStatusFilter === "all" || i.status === invoiceStatusFilter)
      .filter(i =>
        i.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        i.tenantName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        i.propertyName.toLowerCase().includes(invoiceSearch.toLowerCase())
      ),
    invoiceSort
  );

  const filteredMaintenance = sortData(
    maintenanceRequests
      .filter(m => maintenanceStatusFilter === "all" || m.status === maintenanceStatusFilter)
      .filter(m => maintenancePriorityFilter === "all" || m.priority === maintenancePriorityFilter)
      .filter(m =>
        m.propertyName.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
        m.tenantName.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
        m.description.toLowerCase().includes(maintenanceSearch.toLowerCase())
      ),
    maintenanceSort
  );

  const filteredViewings = sortData(
    viewingReservations
      .filter(v => viewingStatusFilter === "all" || v.status === viewingStatusFilter)
      .filter(v =>
        v.propertyName.toLowerCase().includes(viewingSearch.toLowerCase()) ||
        v.customerName.toLowerCase().includes(viewingSearch.toLowerCase()) ||
        v.staffName.toLowerCase().includes(viewingSearch.toLowerCase())
      ),
    viewingSort
  );

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroCompact}>
        <div className={styles.heroCompactContent}>
          <h1 className={styles.heroCompactTitle}>
            賃貸管理システム サンプル <span className={styles.heroCompactSubtitle}>インタラクティブデモ</span>
          </h1>
          <div className={styles.heroCompactDescription}>
            <h2 className={styles.overviewLabel}>システム概要</h2>
            <p className={styles.overviewText}>
              このデモは、賃貸不動産の包括的な管理システムです。
              オーナーマスタ、物件マスタ、入居者マスタ、会社情報マスタを基軸に、
              契約管理、家賃収納、メンテナンス対応、内覧予約など、賃貸管理に必要な全ての機能を統合しています。
            </p>
          </div>
        </div>
      </section>

      {/* Demo Application */}
      <div className={styles.demoAppContainer}>
        {/* App Header */}
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
              <span className={styles.logoIcon}>🏢</span>
              <span className={styles.logoText}>賃貸管理システム サンプル</span>
            </div>
          </div>
          <div className={styles.appHeaderRight}>
            <span className={styles.userName}>管理者</span>
            <button className={styles.logoutButton}>ログアウト</button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
          <nav className={styles.sidebarNav}>
            {/* Dashboard */}
            <button
              className={`${styles.sidebarLink} ${activeTab === "dashboard" ? styles.sidebarLinkActive : ""}`}
              onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }}
            >
              ダッシュボード
            </button>

            {/* Master Management Group */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsMasterOpen(!isMasterOpen)}
              >
                <span>マスタ管理</span>
                <span className={`${styles.arrow} ${isMasterOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isMasterOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "masters" && masterTab === "owners" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("masters"); setMasterTab("owners"); setIsMobileMenuOpen(false); }}
                  >
                    オーナーマスタ
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "masters" && masterTab === "properties" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("masters"); setMasterTab("properties"); setIsMobileMenuOpen(false); }}
                  >
                    物件マスタ
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "masters" && masterTab === "tenants" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("masters"); setMasterTab("tenants"); setIsMobileMenuOpen(false); }}
                  >
                    入居者マスタ
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "masters" && masterTab === "company" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("masters"); setMasterTab("company"); setIsMobileMenuOpen(false); }}
                  >
                    会社情報マスタ
                  </button>
                </div>
              )}
            </div>

            {/* Business Operations Group */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsBusinessOpen(!isBusinessOpen)}
              >
                <span>業務管理</span>
                <span className={`${styles.arrow} ${isBusinessOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isBusinessOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "contracts" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("contracts"); setIsMobileMenuOpen(false); }}
                  >
                    契約・入退去
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "finance" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("finance"); setIsMobileMenuOpen(false); }}
                  >
                    家賃・請求
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "maintenance" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("maintenance"); setIsMobileMenuOpen(false); }}
                  >
                    メンテナンス
                  </button>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "viewings" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("viewings"); setIsMobileMenuOpen(false); }}
                  >
                    内覧予約
                  </button>
                </div>
              )}
            </div>

            {/* Reports Group */}
            <div className={styles.sidebarGroup}>
              <button
                className={styles.sidebarGroupHeader}
                onClick={() => setIsReportsOpen(!isReportsOpen)}
              >
                <span>レポート</span>
                <span className={`${styles.arrow} ${isReportsOpen ? styles.arrowOpen : ''}`}>▼</span>
              </button>
              {isReportsOpen && (
                <div className={styles.sidebarGroupContent}>
                  <button
                    className={`${styles.sidebarSubLink} ${activeTab === "reports" ? styles.sidebarSubLinkActive : ""}`}
                    onClick={() => { setActiveTab("reports"); setIsMobileMenuOpen(false); }}
                  >
                    各種レポート
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Scrollable Content Area */}
        <div className={styles.appContent}>
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <section className={styles.dashboardSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>ダッシュボード</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>🏢</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>管理物件数</p>
                      <p className={styles.statValue}>{properties.length}件</p>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>入居率</p>
                      <p className={styles.statValue}>{occupancyRate}%</p>
                      <p className={styles.statSubtext}>{occupiedUnits}/{totalUnits}室</p>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>月間家賃収入</p>
                      <p className={styles.statValue}>¥{monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>⚠️</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>要注意</p>
                      <p className={styles.statValue}>{overdueInvoices}件</p>
                      <p className={styles.statSubtext}>未入金</p>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>🔧</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>メンテナンス依頼</p>
                      <p className={styles.statValue}>{pendingMaintenance}件</p>
                      <p className={styles.statSubtext}>未対応</p>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📝</div>
                    <div className={styles.statContent}>
                      <p className={styles.statLabel}>契約更新対象</p>
                      <p className={styles.statValue}>{expiringContracts}件</p>
                      <p className={styles.statSubtext}>3ヶ月以内</p>
                    </div>
                  </div>
                </div>

                {/* Quick Info Sections */}
                <div className={styles.quickInfoGrid}>
                  <div className={styles.quickInfoCard}>
                    <h3 className={styles.quickInfoTitle}>空室情報</h3>
                    <div className={styles.quickInfoList}>
                      {properties.slice(0, 3).map(property => {
                        const vacant = property.rooms.filter(r => r.status === "vacant");
                        if (vacant.length === 0) return null;
                        return (
                          <div key={property.id} className={styles.quickInfoItem}>
                            <span className={styles.quickInfoLabel}>{property.name}</span>
                            <span className={styles.quickInfoValue}>{vacant.length}室空室</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.quickInfoCard}>
                    <h3 className={styles.quickInfoTitle}>今週の内覧予約</h3>
                    <div className={styles.quickInfoList}>
                      {viewingReservations.filter(v => v.status === "scheduled").slice(0, 5).map(viewing => (
                        <div key={viewing.id} className={styles.quickInfoItem}>
                          <span className={styles.quickInfoLabel}>{viewing.date} {viewing.time}</span>
                          <span className={styles.quickInfoValue}>{viewing.propertyName} {viewing.roomNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.quickInfoCard}>
                    <h3 className={styles.quickInfoTitle}>未対応メンテナンス</h3>
                    <div className={styles.quickInfoList}>
                      {maintenanceRequests.filter(m => m.status === "pending").map(req => (
                        <div key={req.id} className={styles.quickInfoItem}>
                          <span className={styles.quickInfoLabel}>{req.propertyName} {req.roomNumber}</span>
                          <span className={`${styles.quickInfoValue} ${styles[`priority-${req.priority}`]}`}>
                            {req.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Master Management */}
          {activeTab === "masters" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>マスタ管理</h2>

                {/* Master Tab Navigation */}
                <div className={styles.tabNav}>
                  <button
                    className={`${styles.tabButton} ${masterTab === "owners" ? styles.active : ""}`}
                    onClick={() => setMasterTab("owners")}
                  >
                    オーナーマスタ
                  </button>
                  <button
                    className={`${styles.tabButton} ${masterTab === "properties" ? styles.active : ""}`}
                    onClick={() => setMasterTab("properties")}
                  >
                    物件マスタ
                  </button>
                  <button
                    className={`${styles.tabButton} ${masterTab === "tenants" ? styles.active : ""}`}
                    onClick={() => setMasterTab("tenants")}
                  >
                    入居者マスタ
                  </button>
                  <button
                    className={`${styles.tabButton} ${masterTab === "company" ? styles.active : ""}`}
                    onClick={() => setMasterTab("company")}
                  >
                    会社情報マスタ
                  </button>
                </div>

                {/* Owner Master */}
                {masterTab === "owners" && (
                  <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                      <h3>オーナー一覧（{filteredOwners.length}件）</h3>
                      <button className={styles.addButton} onClick={openAddModal}>
                        + 新規登録
                      </button>
                    </div>

                    {/* Search & Filter */}
                    <div className={styles.searchFilterBar}>
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="オーナー名、メール、電話番号で検索..."
                        value={ownerSearch}
                        onChange={(e) => setOwnerSearch(e.target.value)}
                      />
                      <select
                        className={styles.filterSelect}
                        value={ownerTypeFilter}
                        onChange={(e) => setOwnerTypeFilter(e.target.value as any)}
                      >
                        <option value="all">すべての種別</option>
                        <option value="individual">個人</option>
                        <option value="corporate">法人</option>
                      </select>
                    </div>

                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th className={styles.sortableHeader} onClick={() => handleSort(ownerSort, setOwnerSort, "id")}>
                            ID {ownerSort.key === "id" && (ownerSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(ownerSort, setOwnerSort, "name")}>
                            オーナー名 {ownerSort.key === "name" && (ownerSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(ownerSort, setOwnerSort, "type")}>
                            種別 {ownerSort.key === "type" && (ownerSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(ownerSort, setOwnerSort, "properties")}>
                            管理物件数 {ownerSort.key === "properties" && (ownerSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(ownerSort, setOwnerSort, "totalUnits")}>
                            総戸数 {ownerSort.key === "totalUnits" && (ownerSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th>連絡先</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOwners.map((owner) => (
                          <tr key={owner.id}>
                            <td>{owner.id}</td>
                            <td>{owner.name}</td>
                            <td>
                              <span className={`${styles.badge} ${styles[owner.type]}`}>
                                {owner.type === "corporate" ? "法人" : "個人"}
                              </span>
                            </td>
                            <td>{owner.properties}件</td>
                            <td>{owner.totalUnits}戸</td>
                            <td>{owner.phone}</td>
                            <td>
                              <button className={styles.actionButton} onClick={() => openDetailModal(owner)}>詳細</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Property Master */}
                {masterTab === "properties" && (
                  <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                      <h3>物件一覧（{filteredProperties.length}件）</h3>
                      <button className={styles.addButton} onClick={openAddModal}>
                        + 新規登録
                      </button>
                    </div>

                    {/* Search & Filter */}
                    <div className={styles.searchFilterBar}>
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="物件名、住所、オーナー名で検索..."
                        value={propertySearch}
                        onChange={(e) => setPropertySearch(e.target.value)}
                      />
                      <select
                        className={styles.filterSelect}
                        value={propertyTypeFilter}
                        onChange={(e) => setPropertyTypeFilter(e.target.value as any)}
                      >
                        <option value="all">すべての種別</option>
                        <option value="apartment">アパート</option>
                        <option value="mansion">マンション</option>
                        <option value="house">一戸建て</option>
                      </select>
                    </div>

                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th className={styles.sortableHeader} onClick={() => handleSort(propertySort, setPropertySort, "id")}>
                            ID {propertySort.key === "id" && (propertySort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(propertySort, setPropertySort, "name")}>
                            物件名 {propertySort.key === "name" && (propertySort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(propertySort, setPropertySort, "ownerName")}>
                            オーナー {propertySort.key === "ownerName" && (propertySort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(propertySort, setPropertySort, "type")}>
                            種別 {propertySort.key === "type" && (propertySort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th>所在地</th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(propertySort, setPropertySort, "totalUnits")}>
                            総戸数 {propertySort.key === "totalUnits" && (propertySort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th>入居率</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProperties.map((property) => {
                          const rate = property.totalUnits > 0
                            ? ((property.occupiedUnits / property.totalUnits) * 100).toFixed(0)
                            : "0";
                          return (
                            <tr key={property.id}>
                              <td>{property.id}</td>
                              <td>{property.name}</td>
                              <td>{property.ownerName}</td>
                              <td>
                                <span className={`${styles.badge} ${styles[property.type]}`}>
                                  {property.type === "mansion" ? "マンション" : property.type === "apartment" ? "アパート" : "一戸建て"}
                                </span>
                              </td>
                              <td>{property.address}</td>
                              <td>{property.totalUnits}戸</td>
                              <td>
                                <span className={`${styles.occupancyBadge} ${rate >= "90" ? styles.high : rate >= "70" ? styles.medium : styles.low}`}>
                                  {rate}%
                                </span>
                              </td>
                              <td>
                                <button className={styles.actionButton} onClick={() => openDetailModal(property)}>詳細</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tenant Master */}
                {masterTab === "tenants" && (
                  <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                      <h3>入居者一覧（{filteredTenants.length}件）</h3>
                      <button className={styles.addButton} onClick={openAddModal}>
                        + 新規登録
                      </button>
                    </div>

                    {/* Search & Filter */}
                    <div className={styles.searchFilterBar}>
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="入居者名、物件名、部屋番号で検索..."
                        value={tenantSearch}
                        onChange={(e) => setTenantSearch(e.target.value)}
                      />
                      <select
                        className={styles.filterSelect}
                        value={tenantStatusFilter}
                        onChange={(e) => setTenantStatusFilter(e.target.value as any)}
                      >
                        <option value="all">すべて</option>
                        <option value="active">入居中</option>
                        <option value="notice">退去予告</option>
                        <option value="moving">退去手続中</option>
                      </select>
                    </div>

                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "id")}>
                            ID {tenantSort.key === "id" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "name")}>
                            入居者名 {tenantSort.key === "name" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "propertyName")}>
                            物件名 {tenantSort.key === "propertyName" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "roomNumber")}>
                            部屋番号 {tenantSort.key === "roomNumber" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "rent")}>
                            家賃 {tenantSort.key === "rent" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th className={styles.sortableHeader} onClick={() => handleSort(tenantSort, setTenantSort, "contractEndDate")}>
                            契約終了日 {tenantSort.key === "contractEndDate" && (tenantSort.order === "asc" ? "▲" : "▼")}
                          </th>
                          <th>ステータス</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants.map((tenant) => (
                          <tr key={tenant.id}>
                            <td>{tenant.id}</td>
                            <td>{tenant.name}</td>
                            <td>{tenant.propertyName}</td>
                            <td>{tenant.roomNumber}</td>
                            <td>¥{tenant.rent.toLocaleString()}</td>
                            <td>{tenant.contractEndDate}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[tenant.status]}`}>
                                {tenant.status === "active" ? "入居中" : tenant.status === "notice" ? "退去予告" : "退去手続中"}
                              </span>
                            </td>
                            <td>
                              <button className={styles.actionButton} onClick={() => openDetailModal(tenant)}>詳細</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Company Info Master */}
                {masterTab === "company" && (
                  <div className={styles.companyInfoContainer}>
                    <h3>{companyInfo.name}</h3>

                    <div className={styles.companySection}>
                      <h4>スタッフ情報</h4>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>氏名</th>
                            <th>役職</th>
                            <th>勤務時間</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companyInfo.staff.map((staff) => (
                            <tr key={staff.id}>
                              <td>{staff.id}</td>
                              <td>{staff.name}</td>
                              <td>{staff.role}</td>
                              <td>
                                {staff.workingHours.map((wh, i) => (
                                  <span key={i}>{wh.start} - {wh.end}</span>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className={styles.companySection}>
                      <h4>協力業者情報</h4>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>業者名</th>
                            <th>専門分野</th>
                            <th>連絡先</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companyInfo.contractors.map((contractor) => (
                            <tr key={contractor.id}>
                              <td>{contractor.id}</td>
                              <td>{contractor.name}</td>
                              <td>{contractor.specialty}</td>
                              <td>{contractor.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contracts & Tenancy */}
          {activeTab === "contracts" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>契約・入退去管理</h2>

                <div className={styles.tableContainer}>
                  <div className={styles.tableHeader}>
                    <h3>契約一覧（{filteredContracts.length}件）</h3>
                    <button className={styles.addButton} onClick={openAddModal}>
                      + 新規契約
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className={styles.searchFilterBar}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="入居者名、物件名、部屋番号で検索..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                    />
                  </div>

                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "name")}>
                          入居者 {contractSort.key === "name" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "propertyName")}>
                          物件 {contractSort.key === "propertyName" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "roomNumber")}>
                          部屋 {contractSort.key === "roomNumber" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "contractStartDate")}>
                          契約開始日 {contractSort.key === "contractStartDate" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "contractEndDate")}>
                          契約終了日 {contractSort.key === "contractEndDate" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(contractSort, setContractSort, "rent")}>
                          家賃 {contractSort.key === "rent" && (contractSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>更新判定</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((tenant) => {
                        const endDate = new Date(tenant.contractEndDate);
                        const threeMonthsFromNow = new Date();
                        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                        const needsRenewal = endDate <= threeMonthsFromNow;

                        return (
                          <tr key={tenant.id}>
                            <td>{tenant.name}</td>
                            <td>{tenant.propertyName}</td>
                            <td>{tenant.roomNumber}</td>
                            <td>{tenant.contractStartDate}</td>
                            <td>{tenant.contractEndDate}</td>
                            <td>¥{tenant.rent.toLocaleString()}</td>
                            <td>
                              {needsRenewal && (
                                <span className={`${styles.badge} ${styles.warning}`}>
                                  要更新対応
                                </span>
                              )}
                            </td>
                            <td>
                              <button className={styles.actionButton} onClick={() => openDetailModal(tenant)}>詳細</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Finance & Invoicing */}
          {activeTab === "finance" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>家賃・請求管理</h2>

                <div className={styles.tableContainer}>
                  <div className={styles.tableHeader}>
                    <h3>請求一覧（{filteredInvoices.length}件）</h3>
                  </div>

                  {/* Search & Filter */}
                  <div className={styles.searchFilterBar}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="請求番号、入居者名、物件名で検索..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                    />
                    <select
                      className={styles.filterSelect}
                      value={invoiceStatusFilter}
                      onChange={(e) => setInvoiceStatusFilter(e.target.value as any)}
                    >
                      <option value="all">すべて</option>
                      <option value="draft">下書き</option>
                      <option value="issued">請求済</option>
                      <option value="paid">入金済</option>
                      <option value="overdue">未入金</option>
                    </select>
                  </div>

                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th className={styles.sortableHeader} onClick={() => handleSort(invoiceSort, setInvoiceSort, "id")}>
                          請求番号 {invoiceSort.key === "id" && (invoiceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(invoiceSort, setInvoiceSort, "tenantName")}>
                          入居者 {invoiceSort.key === "tenantName" && (invoiceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(invoiceSort, setInvoiceSort, "propertyName")}>
                          物件 {invoiceSort.key === "propertyName" && (invoiceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>部屋</th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(invoiceSort, setInvoiceSort, "issueDate")}>
                          発行日 {invoiceSort.key === "issueDate" && (invoiceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>ステータス</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>{invoice.id}</td>
                          <td>{invoice.tenantName}</td>
                          <td>{invoice.propertyName}</td>
                          <td>{invoice.roomNumber}</td>
                          <td>{invoice.issueDate}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                              {invoice.status === "paid" ? "入金済" :
                               invoice.status === "issued" ? "請求済" :
                               invoice.status === "overdue" ? "未入金" : "下書き"}
                            </span>
                          </td>
                          <td>
                            <button className={styles.actionButton} onClick={() => openDetailModal(invoice)}>詳細</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Arrears Summary */}
                <div className={styles.summaryCard}>
                  <h3>収納状況サマリー</h3>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>今月請求額</span>
                      <span className={styles.summaryValue}>¥{invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>入金済</span>
                      <span className={styles.summaryValue}>
                        ¥{invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>未入金</span>
                      <span className={`${styles.summaryValue} ${styles.alert}`}>
                        ¥{invoices.filter(i => i.status === "overdue" || i.status === "issued").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Maintenance Requests */}
          {activeTab === "maintenance" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>メンテナンス管理</h2>

                <div className={styles.tableContainer}>
                  <div className={styles.tableHeader}>
                    <h3>メンテナンス依頼一覧（{filteredMaintenance.length}件）</h3>
                    <button className={styles.addButton} onClick={openAddModal}>
                      + 新規依頼
                    </button>
                  </div>

                  {/* Search & Filters */}
                  <div className={styles.searchFilterBar}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="物件名、入居者名、内容で検索..."
                      value={maintenanceSearch}
                      onChange={(e) => setMaintenanceSearch(e.target.value)}
                    />
                    <select
                      className={styles.filterSelect}
                      value={maintenanceStatusFilter}
                      onChange={(e) => setMaintenanceStatusFilter(e.target.value as any)}
                    >
                      <option value="all">すべて</option>
                      <option value="pending">未対応</option>
                      <option value="assigned">手配済</option>
                      <option value="in-progress">対応中</option>
                      <option value="completed">完了</option>
                    </select>
                    <select
                      className={styles.filterSelect}
                      value={maintenancePriorityFilter}
                      onChange={(e) => setMaintenancePriorityFilter(e.target.value as any)}
                    >
                      <option value="all">すべて</option>
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>

                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "id")}>
                          ID {maintenanceSort.key === "id" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "propertyName")}>
                          物件 {maintenanceSort.key === "propertyName" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>部屋</th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "tenantName")}>
                          依頼者 {maintenanceSort.key === "tenantName" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "category")}>
                          カテゴリ {maintenanceSort.key === "category" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>内容</th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "priority")}>
                          優先度 {maintenanceSort.key === "priority" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(maintenanceSort, setMaintenanceSort, "status")}>
                          ステータス {maintenanceSort.key === "status" && (maintenanceSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>業者</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaintenance.map((request) => (
                        <tr key={request.id}>
                          <td>{request.id}</td>
                          <td>{request.propertyName}</td>
                          <td>{request.roomNumber}</td>
                          <td>{request.tenantName}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[request.category]}`}>
                              {request.category === "water" ? "水回り" :
                               request.category === "electric" ? "電気" :
                               request.category === "equipment" ? "設備" : "その他"}
                            </span>
                          </td>
                          <td>{request.description}</td>
                          <td>
                            <span className={`${styles.priorityBadge} ${styles[request.priority]}`}>
                              {request.priority === "high" ? "高" :
                               request.priority === "medium" ? "中" : "低"}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                              {request.status === "pending" ? "未対応" :
                               request.status === "assigned" ? "手配済" :
                               request.status === "in-progress" ? "対応中" : "完了"}
                            </span>
                          </td>
                          <td>{request.contractor || "-"}</td>
                          <td>
                            <button className={styles.actionButton} onClick={() => openDetailModal(request)}>詳細</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Viewing Reservations */}
          {activeTab === "viewings" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>内覧予約管理</h2>

                {/* Calendar View Toggle */}
                <div className={styles.calendarControls}>
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.viewButton} ${calendarView === "month" ? styles.active : ""}`}
                      onClick={() => setCalendarView("month")}
                    >
                      月表示
                    </button>
                    <button
                      className={`${styles.viewButton} ${calendarView === "week" ? styles.active : ""}`}
                      onClick={() => setCalendarView("week")}
                    >
                      週表示
                    </button>
                    <button
                      className={`${styles.viewButton} ${calendarView === "day" ? styles.active : ""}`}
                      onClick={() => setCalendarView("day")}
                    >
                      日表示
                    </button>
                  </div>
                  <button className={styles.addButton} onClick={openAddModal}>
                    + 新規予約
                  </button>
                </div>

                {/* Week View Calendar */}
                {calendarView === "week" && (
                  <div className={styles.calendarWeek}>
                    <div className={styles.calendarHeader}>
                      {weekDates.map((date, index) => {
                        const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
                        return (
                          <div key={index} className={styles.calendarDay}>
                            <div className={styles.dayLabel}>
                              {dayNames[date.getDay()]}
                            </div>
                            <div className={styles.dayDate}>
                              {date.getMonth() + 1}/{date.getDate()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.calendarBody}>
                      {/* Staff rows */}
                      {companyInfo.staff.filter(s => s.role === "営業担当").map((staff) => (
                        <div key={staff.id} className={styles.calendarRow}>
                          <div className={styles.staffLabel}>{staff.name}</div>
                          {weekDates.map((date, dayIndex) => {
                            const dateStr = formatDate(date);
                            const reservations = viewingReservations.filter(
                              v => v.staffId === staff.id && v.date === dateStr && v.status === "scheduled"
                            );

                            return (
                              <div key={dayIndex} className={styles.calendarCell}>
                                {reservations.map((reservation) => (
                                  <div
                                    key={reservation.id}
                                    className={styles.reservationBlock}
                                    onClick={() => openDetailModal(reservation)}
                                  >
                                    <div className={styles.reservationTime}>{reservation.time}</div>
                                    <div className={styles.reservationProperty}>{reservation.propertyName}</div>
                                    <div className={styles.reservationCustomer}>{reservation.customerName}</div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* List View */}
                <div className={styles.tableContainer}>
                  <h3>予約一覧（{filteredViewings.length}件）</h3>

                  {/* Search & Filter */}
                  <div className={styles.searchFilterBar}>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="物件名、お客様名、担当者名で検索..."
                      value={viewingSearch}
                      onChange={(e) => setViewingSearch(e.target.value)}
                    />
                    <select
                      className={styles.filterSelect}
                      value={viewingStatusFilter}
                      onChange={(e) => setViewingStatusFilter(e.target.value as any)}
                    >
                      <option value="all">すべて</option>
                      <option value="scheduled">予約済</option>
                      <option value="completed">完了</option>
                      <option value="cancelled">キャンセル</option>
                    </select>
                  </div>

                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th className={styles.sortableHeader} onClick={() => handleSort(viewingSort, setViewingSort, "date")}>
                          予約日時 {viewingSort.key === "date" && (viewingSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(viewingSort, setViewingSort, "propertyName")}>
                          物件 {viewingSort.key === "propertyName" && (viewingSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>部屋</th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(viewingSort, setViewingSort, "customerName")}>
                          お客様 {viewingSort.key === "customerName" && (viewingSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>連絡先</th>
                        <th className={styles.sortableHeader} onClick={() => handleSort(viewingSort, setViewingSort, "staffName")}>
                          担当者 {viewingSort.key === "staffName" && (viewingSort.order === "asc" ? "▲" : "▼")}
                        </th>
                        <th>ステータス</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredViewings.map((viewing) => (
                        <tr key={viewing.id}>
                          <td>{viewing.date} {viewing.time}</td>
                          <td>{viewing.propertyName}</td>
                          <td>{viewing.roomNumber}</td>
                          <td>{viewing.customerName}</td>
                          <td>{viewing.customerPhone}</td>
                          <td>{viewing.staffName}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[viewing.status]}`}>
                              {viewing.status === "scheduled" ? "予約済" :
                               viewing.status === "completed" ? "完了" : "キャンセル"}
                            </span>
                          </td>
                          <td>
                            <button className={styles.actionButton} onClick={() => openDetailModal(viewing)}>詳細</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <section className={styles.dataSection}>
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>各種レポート</h2>

                <div className={styles.reportGrid}>
                  <div className={styles.reportCard}>
                    <h3>収益レポート</h3>
                    <div className={styles.reportContent}>
                      <div className={styles.reportItem}>
                        <span>今月の家賃収入</span>
                        <span className={styles.reportValue}>¥{monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>入金率</span>
                        <span className={styles.reportValue}>
                          {invoices.length > 0
                            ? ((invoices.filter(i => i.status === "paid").length / invoices.length) * 100).toFixed(1)
                            : "0"}%
                        </span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>未収金</span>
                        <span className={`${styles.reportValue} ${styles.alert}`}>
                          ¥{invoices.filter(i => i.status === "overdue" || i.status === "issued")
                            .reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reportCard}>
                    <h3>入居率推移</h3>
                    <div className={styles.reportContent}>
                      <div className={styles.reportItem}>
                        <span>現在の入居率</span>
                        <span className={styles.reportValue}>{occupancyRate}%</span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>入居戸数</span>
                        <span className={styles.reportValue}>{occupiedUnits}戸</span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>空室戸数</span>
                        <span className={styles.reportValue}>{vacantUnits}戸</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reportCard}>
                    <h3>物件別状況</h3>
                    <div className={styles.reportList}>
                      {properties.map(property => {
                        const rate = property.totalUnits > 0
                          ? ((property.occupiedUnits / property.totalUnits) * 100).toFixed(0)
                          : "0";
                        return (
                          <div key={property.id} className={styles.reportListItem}>
                            <span>{property.name}</span>
                            <span className={`${styles.occupancyBadge} ${rate >= "90" ? styles.high : rate >= "70" ? styles.medium : styles.low}`}>
                              {rate}% ({property.occupiedUnits}/{property.totalUnits})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.reportCard}>
                    <h3>メンテナンス状況</h3>
                    <div className={styles.reportContent}>
                      <div className={styles.reportItem}>
                        <span>未対応</span>
                        <span className={`${styles.reportValue} ${styles.alert}`}>
                          {maintenanceRequests.filter(m => m.status === "pending").length}件
                        </span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>対応中</span>
                        <span className={styles.reportValue}>
                          {maintenanceRequests.filter(m => m.status === "assigned" || m.status === "in-progress").length}件
                        </span>
                      </div>
                      <div className={styles.reportItem}>
                        <span>完了</span>
                        <span className={styles.reportValue}>
                          {maintenanceRequests.filter(m => m.status === "completed").length}件
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Client Pain Points Section */}
      <section className={styles.painPointsSection}>
        <div className={styles.painPointsContent}>
          <h2 className={styles.painPointsTitle}>賃貸管理の課題を解決</h2>
          <div className={styles.painPointsGrid}>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>📄</div>
              <h3>紙・Excel管理からの脱却</h3>
              <p>物件情報、入居者情報、契約情報を一元管理。いつでもどこでもアクセス可能。</p>
            </div>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>💰</div>
              <h3>家賃収納の効率化</h3>
              <p>自動請求書発行、入金管理、滞納アラートで収納業務を効率化。</p>
            </div>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>📝</div>
              <h3>契約更新リマインド</h3>
              <p>契約終了日を自動監視。更新対象を漏れなく把握し、適切なタイミングで対応。</p>
            </div>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>📅</div>
              <h3>内覧予約管理</h3>
              <p>スタッフの勤務時間を可視化。カレンダーで予約状況を一目で確認、ダブルブッキングを防止。</p>
            </div>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>🌐</div>
              <h3>ホームページ連携</h3>
              <p>空室情報を自動でホームページに公開。手動更新の手間を削減。</p>
            </div>
            <div className={styles.painPointCard}>
              <div className={styles.painPointIcon}>📊</div>
              <h3>オーナーへの報告自動化</h3>
              <p>収支レポート、入居率推移を自動生成。オーナーへの定期報告を効率化。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modalType === "add" ? "新規登録" : modalType === "edit" ? "編集" : "詳細"}
              </h3>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              {selectedItem ? (
                <div className={styles.detailContent}>
                  {/* Owner details */}
                  {selectedItem.type && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>オーナー名</span>
                        <span className={styles.detailValue}>{selectedItem.name}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>種別</span>
                        <span className={styles.detailValue}>{selectedItem.type === "corporate" ? "法人" : "個人"}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>管理物件数</span>
                        <span className={styles.detailValue}>{selectedItem.properties}件</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>総戸数</span>
                        <span className={styles.detailValue}>{selectedItem.totalUnits}戸</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>メールアドレス</span>
                        <span className={styles.detailValue}>{selectedItem.email}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>電話番号</span>
                        <span className={styles.detailValue}>{selectedItem.phone}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>住所</span>
                        <span className={styles.detailValue}>{selectedItem.address}</span>
                      </div>
                    </>
                  )}

                  {/* Property details */}
                  {selectedItem.rooms && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>物件名</span>
                        <span className={styles.detailValue}>{selectedItem.name}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>オーナー</span>
                        <span className={styles.detailValue}>{selectedItem.ownerName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>所在地</span>
                        <span className={styles.detailValue}>{selectedItem.address}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>築年</span>
                        <span className={styles.detailValue}>{selectedItem.buildYear}年</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>総戸数</span>
                        <span className={styles.detailValue}>{selectedItem.totalUnits}戸</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>入居戸数</span>
                        <span className={styles.detailValue}>{selectedItem.occupiedUnits}戸</span>
                      </div>
                      <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>部屋一覧</h4>
                      {selectedItem.rooms.map((room: Room, idx: number) => (
                        <div key={idx} className={styles.roomItem}>
                          <strong>{room.roomNumber}</strong> - {room.layout} ({room.area}㎡) - ¥{room.rent.toLocaleString()}/月
                          {room.status === "occupied" && room.tenant ? ` - ${room.tenant}様` : ` - ${room.status === "vacant" ? "空室" : "予約済"}`}
                        </div>
                      ))}
                    </>
                  )}

                  {/* Tenant details */}
                  {selectedItem.contractStartDate && !selectedItem.items && !selectedItem.category && !selectedItem.customerPhone && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>入居者名</span>
                        <span className={styles.detailValue}>{selectedItem.name}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>物件</span>
                        <span className={styles.detailValue}>{selectedItem.propertyName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>部屋番号</span>
                        <span className={styles.detailValue}>{selectedItem.roomNumber}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>家賃</span>
                        <span className={styles.detailValue}>¥{selectedItem.rent.toLocaleString()}/月</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>契約期間</span>
                        <span className={styles.detailValue}>{selectedItem.contractStartDate} 〜 {selectedItem.contractEndDate}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>電話番号</span>
                        <span className={styles.detailValue}>{selectedItem.phone}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>メールアドレス</span>
                        <span className={styles.detailValue}>{selectedItem.email}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>緊急連絡先</span>
                        <span className={styles.detailValue}>{selectedItem.emergencyContact}</span>
                      </div>
                    </>
                  )}

                  {/* Invoice details */}
                  {selectedItem.items && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>請求番号</span>
                        <span className={styles.detailValue}>{selectedItem.id}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>入居者</span>
                        <span className={styles.detailValue}>{selectedItem.tenantName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>物件</span>
                        <span className={styles.detailValue}>{selectedItem.propertyName} {selectedItem.roomNumber}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>発行日</span>
                        <span className={styles.detailValue}>{selectedItem.issueDate}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>支払期限</span>
                        <span className={styles.detailValue}>{selectedItem.dueDate}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>請求額</span>
                        <span className={styles.detailValue}>¥{selectedItem.amount.toLocaleString()}</span>
                      </div>
                      <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>明細</h4>
                      {selectedItem.items.map((item: InvoiceItem, idx: number) => (
                        <div key={idx} className={styles.detailRow}>
                          <span className={styles.detailLabel}>{item.description}</span>
                          <span className={styles.detailValue}>¥{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Maintenance details */}
                  {selectedItem.category && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>依頼ID</span>
                        <span className={styles.detailValue}>{selectedItem.id}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>物件</span>
                        <span className={styles.detailValue}>{selectedItem.propertyName} {selectedItem.roomNumber}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>依頼者</span>
                        <span className={styles.detailValue}>{selectedItem.tenantName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>カテゴリ</span>
                        <span className={styles.detailValue}>
                          {selectedItem.category === "water" ? "水回り" :
                           selectedItem.category === "electric" ? "電気" :
                           selectedItem.category === "equipment" ? "設備" : "その他"}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>内容</span>
                        <span className={styles.detailValue}>{selectedItem.description}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>優先度</span>
                        <span className={styles.detailValue}>
                          {selectedItem.priority === "high" ? "高" :
                           selectedItem.priority === "medium" ? "中" : "低"}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>依頼日</span>
                        <span className={styles.detailValue}>{selectedItem.requestDate}</span>
                      </div>
                      {selectedItem.contractor && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>担当業者</span>
                          <span className={styles.detailValue}>{selectedItem.contractor}</span>
                        </div>
                      )}
                      {selectedItem.completedDate && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>完了日</span>
                          <span className={styles.detailValue}>{selectedItem.completedDate}</span>
                        </div>
                      )}
                      {selectedItem.cost && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>費用</span>
                          <span className={styles.detailValue}>¥{selectedItem.cost.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Viewing Reservation details */}
                  {selectedItem.customerPhone && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>予約ID</span>
                        <span className={styles.detailValue}>{selectedItem.id}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>予約日時</span>
                        <span className={styles.detailValue}>{selectedItem.date} {selectedItem.time}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>物件</span>
                        <span className={styles.detailValue}>{selectedItem.propertyName} {selectedItem.roomNumber}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>お客様名</span>
                        <span className={styles.detailValue}>{selectedItem.customerName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>連絡先</span>
                        <span className={styles.detailValue}>{selectedItem.customerPhone}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>担当者</span>
                        <span className={styles.detailValue}>{selectedItem.staffName}</span>
                      </div>
                      {selectedItem.notes && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>備考</span>
                          <span className={styles.detailValue}>{selectedItem.notes}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p>新規登録フォーム（デモ用）</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeModal}>閉じる</button>
              {modalType !== "detail" && (
                <button className={styles.saveButton} onClick={closeModal}>保存</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
