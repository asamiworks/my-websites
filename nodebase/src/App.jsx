import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // ナビゲーションのタイプを判定
    const navigationType = window.performance?.getEntriesByType?.('navigation')?.[0]?.type;
    
    // 通常のリンククリックの場合のみスムーズスクロール
    if (navigationType !== 'back_forward') {
      setIsTransitioning(true);
      
      // 少し遅延を入れてスムーズに
      const scrollTimeout = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setIsTransitioning(false);
      }, 100);
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [location.pathname]);

  return (
    <div className={`app ${isTransitioning ? 'transitioning' : ''}`}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;