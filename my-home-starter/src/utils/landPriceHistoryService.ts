interface PricePoint {
  year: number;
  price: number;
  change: number;
}

interface LandPriceHistory {
  city: string;
  data: PricePoint[];
  additionalInfo?: string[];
}

const mockPriceHistory: Record<string, LandPriceHistory> = {
  '水戸市': {
    city: '水戸市',
    data: [
      { year: 2020, price: 58, change: -2.1 },
      { year: 2021, price: 57, change: -1.7 },
      { year: 2022, price: 59, change: 3.5 },
      { year: 2023, price: 61, change: 3.4 },
      { year: 2024, price: 63, change: 3.3 }
    ],
    additionalInfo: [
      '2026年: 水戸駅北口再開発完了予定',
      '2027年: 国道6号バイパス開通予定'
    ]
  }
};

export async function fetchLandPriceHistory(city: string): Promise<LandPriceHistory | null> {
  return mockPriceHistory[city] || null;
}
