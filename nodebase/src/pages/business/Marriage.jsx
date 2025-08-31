import React from 'react';
import { Link } from 'react-router-dom';

function Counseling() {
  return (
    <div className="page-counseling">
      <section className="section section-hero">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Marriage Consulting</h1>
            <p className="page-subtitle">結婚相談所</p>
          </div>
          
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-wrapper" style={{textAlign: 'center', padding: '4rem 0'}}>
            <div className="preparation-message">
              <h2 style={{color: 'var(--color-ocean-soft)', marginBottom: '1rem'}}>
                準備中
              </h2>
              <p style={{color: 'var(--color-text-light)', fontSize: '1.1rem'}}>
                このページは現在準備中です。<br />
                もうしばらくお待ちください。
              </p>
              
              <div style={{marginTop: '3rem'}}>
                <Link to="/business" className="btn btn-outline">
                  事業一覧に戻る
                </Link>
              </div>
            </div>

            
          </div>
        </div>
      </section>
    </div>
  );
}

export default Counseling;