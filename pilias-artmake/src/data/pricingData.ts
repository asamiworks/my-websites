export interface PriceItem {
    id: string
    category: 'beauty' | 'paramedical' | 'option'
    name: string
    prices: {
      regular?: number
      monitor?: number
      retouch?: number
      retouchWithinYear?: number
      size?: string
    }[]
    note?: string
  }
  
  export const pricingData: PriceItem[] = [
    // 美容アートメイク
    {
      id: 'eyebrow',
      category: 'beauty',
      name: '眉毛アートメイク',
      prices: [
        {
          regular: 55000,
          monitor: 44000,
          retouch: 40000,
          retouchWithinYear: 38000,
        },
      ],
      note: 'リタッチは3回目以降の料金です',
    },
    {
      id: 'lip',
      category: 'beauty',
      name: 'リップアートメイク',
      prices: [
        {
          regular: 55000,
          monitor: 44000,
          retouch: 40000,
          retouchWithinYear: 38000,
        },
      ],
      note: 'リタッチは3回目以降の料金です',
    },
  
    // パラメディカルアートメイク
    {
      id: 'scar',
      category: 'paramedical',
      name: '傷痕',
      prices: [
        { size: '1×1cm', regular: 12000 },
        { size: '2×2cm', regular: 22000 },
        { size: '3×3cm', regular: 30000 },
      ],
    },
    {
      id: 'vitiligo',
      category: 'paramedical',
      name: '白斑',
      prices: [
        { size: '5×5cm', regular: 30000 },
        { size: 'リタッチ（2ヶ月以内）', regular: 14000 },
      ],
    },
    {
      id: 'cleft-lip',
      category: 'paramedical',
      name: '口唇口蓋裂',
      prices: [
        { regular: 30000 },
      ],
    },
    {
      id: 'stretch-marks',
      category: 'paramedical',
      name: 'ストレッチマーク',
      prices: [
        { size: '5×9cm（名刺サイズ）', regular: 15000 },
        { size: '10×15cm（ハガキサイズ）', regular: 33000 },
      ],
    },
  ]
  
  // モニター条件
  export const monitorConditions = [
    '全顔お写真のSNS掲載にご協力いただける方',
    '2回目施術にご来院いただける方',
  ]
  
  // パラメディカルアートメイクの注意事項
  export const paramedicalNote = 'パラメディカルアートメイクは適応条件がございますのでご相談ください。'
  
  // 追加オプション
  export const additionalOptions = [
    {
      name: '麻酔クリーム',
      price: 0,
      note: '基本料金に含まれます',
    },
    {
      name: '抗ウイルス薬（ヘルペス予防）',
      price: 3300,
      note: 'リップ施術で既往がある方推奨',
    },
  ]
  
  // 料金に関する注意事項
  export const pricingNotes = [
    '表示価格は全て税込みです',
    '施術は完全予約制です',
    'カウンセリングは無料です',
    '施術前に医師の診察が必要です',
  ]
  
  // 支払い方法
  export const paymentMethods = [
    '現金',
    'クレジットカード',
  ]
  
  // キャンセルポリシー
  export const cancellationPolicy = {
    title: 'キャンセルポリシー',
    content: [
      '予約日の2日前まで：無料',
      '予約日の前日：施術料金の50%',
      '当日キャンセル・無断キャンセル：施術料金の100%',
    ],
    note: '体調不良や緊急の場合はご相談ください',
  }