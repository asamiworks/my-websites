// src/app/services/package/demo/rta/page.tsx
export default function RTAPage() {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#333'
        }}>
          🎬 サイト制作RTA
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          準備中
        </p>
        
        <p style={{
          fontSize: '1rem',
          color: '#999',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Instagram Reelsで公開予定の「サイト制作RTA」で作成したテンプレートを<br />
          こちらでご覧いただけるようになります。
        </p>
        
        <p style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#10b981'
        }}>
          初期費用 33,000円〜（予定） / 月額 6,600円〜（予定/ドメイン・サーバー込み）
        </p>
      </div>
    );
  }