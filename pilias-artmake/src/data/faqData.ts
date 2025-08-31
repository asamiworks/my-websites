export interface FAQItem {
    id: string
    category: 'general' | 'treatment' | 'aftercare' | 'restriction' | 'price'
    question: string
    answer: string
  }
  
  export const faqData: FAQItem[] = [
    // 一般的な質問
    {
      id: 'what-is-artmake',
      category: 'general',
      question: 'アートメイクとタトゥーの違いは何ですか？',
      answer: 'アートメイクは表皮から真皮上層に色素を入れるため、1〜3年で徐々に薄くなります。一方、タトゥーは真皮深層に色素を入れるため永久に残ります。また、アートメイクは医療行為として医師の管理下で行われ、麻酔の使用も可能です。',
    },
    {
      id: 'duration',
      category: 'general',
      question: 'アートメイクの持続期間はどのくらいですか？',
      answer: '個人差はありますが、通常1〜3年程度持続します。肌質、新陳代謝、生活習慣などにより変動します。定期的なリタッチで美しい状態を保つことができます。',
    },
    {
      id: 'sessions',
      category: 'general',
      question: 'アートメイクは何回で完成しますか？',
      answer: '通常2〜3回の施術で完成します。1回目で土台を作り、1〜2ヶ月後の2回目で色や形を調整します。簡単に消せないものなので、1回目は控えめに入れていきます。',
    },
  
    // 施術に関する質問
    {
      id: 'pain',
      category: 'treatment',
      question: '施術中の痛みはありますか？',
      answer: '麻酔クリームを使用するため、痛みは最小限に抑えられます。個人差はありますが、チクチクする程度で、多くの方が許容できる程度です。',
    },
    {
      id: 'treatment-time',
      category: 'treatment',
      question: '施術時間はどのくらいですか？',
      answer: 'カウンセリングを含めて2〜3時間程度です。デザインの相談に十分な時間をかけ、ご納得いただいてから施術を行います。',
    },
    {
      id: 'anesthesia',
      category: 'treatment',
      question: '麻酔は使用しますか？',
      answer: 'はい、表面麻酔（麻酔クリーム）を使用します。施術前に塗布し、十分に効いてから施術を開始するため、痛みを最小限に抑えることができます。',
    },
  
    // アフターケアに関する質問
    {
      id: 'downtime',
      category: 'aftercare',
      question: 'ダウンタイムはどのくらいですか？',
      answer: '眉毛は3〜7日、リップは1週間程度で薄いかさぶたが剥がれます。この期間は施術部位を清潔に保ち、ワセリンでの保護が必要です。',
    },
    {
      id: 'aftercare',
      category: 'aftercare',
      question: '施術後の注意事項はありますか？',
      answer: '施術後24時間は濡らさないでください。1週間は施術部位のメイクやクレンジングを避け、激しい運動、飲酒、サウナ、プールは控えてください。',
    },
    {
      id: 'makeup',
      category: 'aftercare',
      question: '施術後いつからメイクできますか？',
      answer: '施術部位以外は当日から可能です。施術部位は1週間後からメイクできます。かさぶたが完全に剥がれてからが安心です。',
    },
  
    // 施術を受けられない方
    {
      id: 'contraindications',
      category: 'restriction',
      question: '施術を受けられない人はいますか？',
      answer: '妊娠中・授乳中の方、感染症の方、糖尿病の方、ケロイド体質の方、麻酔・金属アレルギーの方、半年以内に施術部位の切開手術をされた方は施術をお受けいただけません。',
    },
    {
      id: 'caution',
      category: 'restriction',
      question: '注意が必要な場合はありますか？',
      answer: 'アトピー体質、お肌が弱い方、血友病、抗凝固薬服用中の方、生理中の方、1ヶ月以内に施術部位周囲の美容施術を受けられた方は事前にご相談ください。',
    },
  
    // 料金に関する質問
    {
      id: 'monitor-price',
      category: 'price',
      question: 'モニター価格はありますか？',
      answer: 'はい、モニター価格をご用意しています。全顔写真のSNS掲載と2回目施術にご協力いただける方が対象です。眉毛・リップともに通常55,000円が44,000円になります。',
    },
    {
      id: 'payment',
      category: 'price',
      question: '支払い方法は何がありますか？',
      answer: '現金、クレジットカード、医療ローン（要審査）がご利用いただけます。詳細は公式LINEでお問い合わせください。',
    },
    {
      id: 'retouch-price',
      category: 'price',
      question: 'リタッチの料金はいくらですか？',
      answer: '3回目以降のリタッチは40,000円、1年以内のリタッチは38,000円です。定期的なメンテナンスで美しい状態を保てます。',
    },
  ]
  
  // カテゴリー別にグループ化
  export const faqByCategory = {
    general: faqData.filter(item => item.category === 'general'),
    treatment: faqData.filter(item => item.category === 'treatment'),
    aftercare: faqData.filter(item => item.category === 'aftercare'),
    restriction: faqData.filter(item => item.category === 'restriction'),
    price: faqData.filter(item => item.category === 'price'),
  }
  
  // カテゴリータイトル
  export const faqCategories = {
    general: '基本的な質問',
    treatment: '施術について',
    aftercare: 'アフターケア',
    restriction: '施術を受けられない方・注意事項',
    price: '料金について',
  }