export interface MenuItem {
    id: string
    category: 'beauty' | 'paramedical'
    name: string
    description: string
    features: string[]
    targetCustomers: string[]
    duration?: string
    sessions?: string
  }
  
  export const menuItems: MenuItem[] = [
    // 美容アートメイク
    {
      id: 'eyebrow',
      category: 'beauty',
      name: '眉毛アートメイク',
      description: '自然で美しい眉毛を長期間キープ。毛並み・パウダー・MIX技法から選択可能。',
      features: [
        '2-3回で完成',
        '1-3年持続',
        '自然な仕上がり',
        'メイク時間短縮',
      ],
      targetCustomers: [
        '眉毛が薄い方',
        '左右対称にしたい方',
        'メイクの時間を短縮したい方',
        'スポーツをされる方',
      ],
      duration: '1-3年',
      sessions: '2-3回',
    },
    {
      id: 'lip',
      category: 'beauty',
      name: 'リップアートメイク',
      description: '理想的な唇の色と形を実現。マスクでも落ちない美しいリップカラー。',
      features: [
        'くすみ改善',
        '血色感アップ',
        'マスクでも落ちない',
        '口紅不要',
      ],
      targetCustomers: [
        '唇の血色が悪い方',
        'くすみが気になる方',
        'リップメイクを楽にしたい方',
        '口紅が落ちやすい方',
      ],
      duration: '1-3年',
      sessions: '2-3回',
    },
  
    // パラメディカルアートメイク
    {
      id: 'scar',
      category: 'paramedical',
      name: '傷痕修正',
      description: '傷痕を目立たなくし、自然な肌の見た目を取り戻します。',
      features: [
        '傷痕のカモフラージュ',
        '自然な仕上がり',
        '心理的負担の軽減',
      ],
      targetCustomers: [
        '手術跡が気になる方',
        '事故による傷痕がある方',
        '傷痕を目立たなくしたい方',
      ],
    },
    {
      id: 'vitiligo',
      category: 'paramedical',
      name: '白斑',
      description: '白斑部分に色素を入れ、周囲の肌色と調和させます。',
      features: [
        '色素の補充',
        '見た目の改善',
        'QOL向上',
      ],
      targetCustomers: [
        '白斑でお悩みの方',
        '部分的な色素脱失がある方',
      ],
    },
    {
      id: 'cleft-lip',
      category: 'paramedical',
      name: '口唇口蓋裂',
      description: '口唇口蓋裂術後の傷跡を目立たなくし、自然な唇の形を作ります。',
      features: [
        '傷跡のカバー',
        '唇の形の調整',
        '自信の回復',
      ],
      targetCustomers: [
        '口唇口蓋裂術後の方',
        '唇の形を整えたい方',
      ],
    },
    {
      id: 'stretch-marks',
      category: 'paramedical',
      name: 'ストレッチマーク',
      description: '妊娠線や肉割れを目立たなくし、滑らかな肌の見た目を実現。',
      features: [
        '線の目立ちを軽減',
        '肌色の均一化',
        '自信の回復',
      ],
      targetCustomers: [
        '妊娠線が気になる方',
        '急激な体重変化による肉割れがある方',
        'ストレッチマークを改善したい方',
      ],
    },
  ]
  
  // 眉毛アートメイクの種類
  export const eyebrowTypes = [
    {
      id: 'hair-stroke',
      name: '毛並み',
      description: '毛並みを1本1本手彫りで描く技法',
      features: ['自然でナチュラルな仕上がり'],
      suitable: ['自眉毛が薄い方', '普通肌、乾燥肌の方', 'ナチュラルな仕上がりを希望の方'],
    },
    {
      id: 'powder',
      name: 'パウダー',
      description: '手彫りでドットを描く技法',
      features: ['ふんわりメイクをしたような仕上がり'],
      suitable: ['全体的に毛量がある方', 'どの肌質の方にもおすすめ', '薄くふんわりor濃くしっかりご希望の方'],
    },
    {
      id: 'mix',
      name: 'MIX',
      description: '毛並みとパウダーを合わせた技法',
      features: ['よりナチュラルで立体感のある仕上がり'],
      suitable: ['自眉が全体的にあるが薄い方', '普通肌、乾燥肌、ややオイリー肌の方', 'メイクをしたような仕上がり'],
    },
  ]
  
  // 眉毛のデザインパターン
  export const eyebrowDesigns = [
    {
      id: 'parallel',
      name: '平行眉（ストレート）',
      features: ['若見え効果', '親しみやすい'],
    },
    {
      id: 'semi-arch',
      name: '平行眉（セミアーチ）',
      features: ['程よいカーブ', '柔らかい', '優しい印象', 'ナチュラル'],
    },
    {
      id: 'arch',
      name: 'アーチ眉',
      features: ['知的な印象', '大人っぽい', '落ち着きがある'],
    },
    {
      id: 'upward',
      name: '上がり眉',
      features: ['クールで知的', 'シャープ', '強そうな印象'],
    },
    {
      id: 'upward-straight',
      name: '上がりストレート眉',
      features: ['クール', '知的', '凛とした印象'],
    },
    {
      id: 'handsome',
      name: 'ハンサム眉（海外風）',
      features: ['凛々しい', 'クール', '意思の強さを感じさせる'],
    },
  ]