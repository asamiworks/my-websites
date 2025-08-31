// PRページの設定
export const prPageConfig = {
  // ヘッダー/フッターを表示しないPRページのパス
  hideLayoutPaths: [
    '/pr/test-campaign',
    // 今後追加するPRページのパスをここに記載
  ],
  
  // Google Analyticsなどのトラッキング設定
  tracking: {
    enabled: true,
    campaign: 'pr-test',
  },
};
