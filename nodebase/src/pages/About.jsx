import React, { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* メインビジュアル */}
      <section className="section-hero washi-bg">
        <div className="container text-center">
          <h1 className="fade-in">About</h1>
          <p className="text-lead fade-in">株式会社ノードベースについて</p>
        </div>
      </section>

      {/* 企業理念 */}
      <section>
        <div className="container">
          <div className="card">
            <h2 className="text-center">私たちの想い</h2>
            <p className="text-lead text-center mb-md">
              「node」— つながる場所。
            </p>
            <p className="text-center">
              ノードベースは、人と人、想いと想い、<br />
              可能性と機会が出会い、つながる場所です。
            </p>
            <p className="text-center mt-sm">
              教育、写真、結婚相談という一見異なる事業を通じて、<br />
              人生の大切な瞬間に寄り添い、<br />
              新しい価値を生み出していきます。
            </p>
          </div>
        </div>
      </section>

      {/* 会社概要 */}
      <section>
        <div className="container">
          <h2 className="text-center mb-md">会社概要</h2>
          <div className="card">
            <dl>
              <dt>会社名</dt>
              <dd>株式会社ノードベース</dd>
              
              <dt>代表取締役</dt>
              <dd>小島信一郎</dd>
              
              <dt>資本金</dt>
              <dd>100万円</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;