// 動的ルールベース提案システム
// 会話履歴を解析して次の質問を提案

export interface SuggestionRule {
  id: string;
  name: string;
  subject: string;
  trigger: {
    keywords: string[];
    requiredCount: number;
    contextWindow: number;
  };
  suggestions: string[];
  priority: number;
}

export const SUGGESTION_RULES: SuggestionRule[] = [
  // 🔢 算数・数学のルール
  {
    id: 'math-fraction-basics',
    name: '分数の基本から応用へ',
    subject: 'math',
    trigger: {
      keywords: ['分数', '分母', '分子'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '分数の足し算を練習したい',
      '分数を小数に変換するには？',
      '分数の割り算の意味を知りたい'
    ],
    priority: 10
  },
  {
    id: 'math-fraction-advanced',
    name: '分数計算から図形へ',
    subject: 'math',
    trigger: {
      keywords: ['分数', '計算', 'できた', 'わかった'],
      requiredCount: 2,
      contextWindow: 5
    },
    suggestions: [
      '分数を使った文章題にチャレンジ',
      '図形の面積を分数で表すには？',
      '比と分数の関係を知りたい'
    ],
    priority: 8
  },
  {
    id: 'math-shape-basics',
    name: '図形の基礎',
    subject: 'math',
    trigger: {
      keywords: ['三角形', '四角形', '図形'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '三角形の面積の求め方を教えて',
      '合同な図形とは何？',
      '角度の計算方法を知りたい'
    ],
    priority: 10
  },
  {
    id: 'math-shape-area',
    name: '面積から体積へ',
    subject: 'math',
    trigger: {
      keywords: ['面積', '求め方', 'わかった'],
      requiredCount: 2,
      contextWindow: 5
    },
    suggestions: [
      '立体の体積を求めたい',
      '円の面積と円周の関係は？',
      '複雑な図形の面積の求め方'
    ],
    priority: 9
  },

  // 📖 国語のルール
  {
    id: 'japanese-reading-to-writing',
    name: '読解から作文への流れ',
    subject: 'japanese',
    trigger: {
      keywords: ['物語', '読解', '登場人物', '気持ち'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '読書感想文の書き方を教えて',
      '登場人物の気持ちを文章で表現したい',
      '物語の続きを考えて書きたい'
    ],
    priority: 10
  },
  {
    id: 'japanese-writing-improvement',
    name: '作文の上達',
    subject: 'japanese',
    trigger: {
      keywords: ['作文', '書いた', '感想文'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '作文をもっと上手に書くコツは？',
      '表現力を豊かにする方法',
      '文章の構成を学びたい'
    ],
    priority: 9
  },

  // 🌍 英語のルール
  {
    id: 'english-grammar-to-conversation',
    name: '文法から会話練習へ',
    subject: 'english',
    trigger: {
      keywords: ['be動詞', '一般動詞', '文法', 'わかった'],
      requiredCount: 2,
      contextWindow: 5
    },
    suggestions: [
      '簡単な英会話を練習したい',
      '自己紹介を英語で言いたい',
      '日常会話で使える表現を知りたい'
    ],
    priority: 9
  },
  {
    id: 'english-vocabulary-expansion',
    name: '語彙力の向上',
    subject: 'english',
    trigger: {
      keywords: ['単語', '覚える', 'vocabulary'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '効率的な単語の覚え方は？',
      'よく使う英単語を教えて',
      '単語帳の使い方を知りたい'
    ],
    priority: 8
  },

  // 🔬 理科のルール
  {
    id: 'science-observation-to-experiment',
    name: '観察から実験へ',
    subject: 'science',
    trigger: {
      keywords: ['観察', '見る', '調べる'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      '家でできる簡単な実験を教えて',
      '観察した結果をどうまとめる？',
      '実験の仮説の立て方を知りたい'
    ],
    priority: 10
  },
  {
    id: 'science-phenomenon-explanation',
    name: '現象の理解',
    subject: 'science',
    trigger: {
      keywords: ['なぜ', 'どうして', '理由'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      'この現象が起こる仕組みを知りたい',
      '科学的に説明するとどうなる？',
      '日常生活との関係を教えて'
    ],
    priority: 9
  },

  // 🗺️ 社会のルール
  {
    id: 'social-history-to-modern',
    name: '歴史から現代への流れ',
    subject: 'social',
    trigger: {
      keywords: ['歴史', '出来事', '年表'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      'この歴史が現代にどう影響している？',
      '他の国ではどうだった？',
      '時代背景をもっと知りたい'
    ],
    priority: 9
  },
  {
    id: 'social-geography-to-culture',
    name: '地理から文化理解へ',
    subject: 'social',
    trigger: {
      keywords: ['地理', '国', '場所'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      'その場所の文化について知りたい',
      '気候が人々の暮らしにどう影響する？',
      '日本との違いを比較したい'
    ],
    priority: 8
  },

  // 💻 プログラミングのルール
  {
    id: 'programming-basics-to-project',
    name: '基礎から作品作りへ',
    subject: 'programming',
    trigger: {
      keywords: ['変数', '関数', 'if文', 'わかった'],
      requiredCount: 2,
      contextWindow: 5
    },
    suggestions: [
      '簡単なゲームを作ってみたい',
      '自分のアイデアをプログラムにしたい',
      'もっと複雑なことをしてみたい'
    ],
    priority: 9
  },
  {
    id: 'programming-debugging',
    name: 'デバッグスキル',
    subject: 'programming',
    trigger: {
      keywords: ['エラー', 'うまくいかない', 'バグ'],
      requiredCount: 1,
      contextWindow: 5
    },
    suggestions: [
      'エラーの見つけ方を教えて',
      'デバッグのコツは？',
      'よくある間違いと解決方法'
    ],
    priority: 10
  },

  // 💭 悩み相談のルール
  {
    id: 'counseling-empathy-to-action',
    name: '悩みから行動へ',
    subject: 'counseling',
    trigger: {
      keywords: ['つらい', '悲しい', '困ってる'],
      requiredCount: 1,
      contextWindow: 3
    },
    suggestions: [
      'どうしたら気持ちが楽になる？',
      '明日からできることを考えたい',
      '誰かに相談する方法を知りたい'
    ],
    priority: 15  // 悩み相談は最優先
  },
  {
    id: 'counseling-positive-thinking',
    name: '前向き思考',
    subject: 'counseling',
    trigger: {
      keywords: ['できない', '無理', 'ダメ'],
      requiredCount: 1,
      contextWindow: 3
    },
    suggestions: [
      '自分の良いところを見つけたい',
      '小さな成功体験を積むには？',
      '前向きに考える方法を教えて'
    ],
    priority: 12
  },
  {
    id: 'counseling-friendship',
    name: '友達関係の改善',
    subject: 'counseling',
    trigger: {
      keywords: ['友達', 'けんか', '仲直り', '友情'],
      requiredCount: 1,
      contextWindow: 3
    },
    suggestions: [
      '友達と仲直りする方法は？',
      '良い友達関係を築くコツ',
      '友達作りのヒントを教えて'
    ],
    priority: 13
  },

  // 学習状況に応じたメタルール
  {
    id: 'meta-understanding-check',
    name: '理解度確認',
    subject: 'general',
    trigger: {
      keywords: ['わかった', 'できた', '理解した'],
      requiredCount: 1,
      contextWindow: 3
    },
    suggestions: [
      'この知識を使った問題に挑戦したい',
      '関連する内容も学んでみたい',
      '実際に使ってみる場面はある？'
    ],
    priority: 5
  },
  {
    id: 'meta-difficulty-support',
    name: '難しさのサポート',
    subject: 'general',
    trigger: {
      keywords: ['難しい', 'わからない', '困った'],
      requiredCount: 1,
      contextWindow: 3
    },
    suggestions: [
      'もう少し簡単な方法で説明して',
      '例を使って教えて',
      '段階的に教えて'
    ],
    priority: 7
  }
];