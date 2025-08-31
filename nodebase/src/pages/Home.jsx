import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ScrollAnimation from '../components/ScrollAnimation';
import '../styles/pages/Home.css';

// 画像インポート
import heroImage from '../assets/images/hero/hero-04.jpg';
import workImage1 from '../assets/images/gallery/camera-02.jpg';
import workImage2 from '../assets/images/gallery/camera-03.jpg';
import workImage3 from '../assets/images/gallery/camera-04.jpg';

// Business画像インポート（1500×1000pxに統一）
import educationImage from '../assets/images/business/education-main.jpg';
import photographyImage from '../assets/images/business/photography-main.jpg';
import marriageImage from '../assets/images/business/marriage-main.jpg';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section - ロゴのみ表示 */}
      <Hero />

      {/* About Section */}
      <ScrollAnimation>
        <section className="home-about">
          <div className="container">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">
                <span className="title-en">About</span>
                <span className="title-jp">私たちについて</span>
              </h2>
            </div>

            <div className="about-content">
              <div className="about-text">
                <h3 className="about-headline">
                  つながる、ひろがる<br />
                  
                </h3>
                <p className="about-description">
                  node — つながる場所
                </p>
                <p className="about-body">
                  ノードベースは、人と人、想いと機会が<br />
                  自然に交わり、新しい価値が生まれる場所です。<br />
                  教育、写真、結婚相談という異なる事業を通じて<br />
                  人生の大切な瞬間に寄り添います。
                </p>
                <Link to="/about" className="text-link">
                  <span>Learn More</span>
                  <span className="link-arrow">→</span>
                </Link>
              </div>

              <div className="about-visual">
                <div className="visual-image">
                  <img src={heroImage} alt="About" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Business Section */}
      <ScrollAnimation>
        <section className="home-business">
          <div className="container">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">
                <span className="title-en">Business</span>
                <span className="title-jp">事業内容</span>
              </h2>
            </div>

            <div className="business-grid">
              {/* 教育事業 */}
              <div className="business-card">
                <div className="business-image">
                  <div className="business-image-wrapper">
                    <img src={educationImage} alt="教育事業" />
                  </div>
                  <span className="business-label">Education</span>
                </div>
                <div className="business-info">
                  <h3 className="business-title">予備校運営事業</h3>
                  <p className="business-description">
                    フランチャイズ予備校の運営を通じて、<br />
                    生徒一人ひとりの可能性を最大限に引き出し、<br />
                    志望校合格への道をサポートしています。
                  </p>
                  <Link to="/business/education" className="business-link">
                    <span>詳しく見る</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* 写真事業 */}
              <div className="business-card">
                <div className="business-image">
                  <div className="business-image-wrapper">
                    <img src={photographyImage} alt="写真・映像制作事業" />
                  </div>
                  <span className="business-label">Photography</span>
                </div>
                <div className="business-info">
                  <h3 className="business-title">写真・映像制作事業</h3>
                  <p className="business-description">
                    ウェディングから企業PRまで、<br />
                    特別な瞬間を美しく切り取り、<br />
                    心に残る作品として形にします。
                  </p>
                  <Link to="/business/photography" className="business-link">
                    <span>詳しく見る</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* 結婚相談所事業 */}
              <div className="business-card">
                <div className="business-image">
                  <div className="business-image-wrapper">
                    <img src={marriageImage} alt="結婚相談所事業" />
                  </div>
                  <span className="business-label">Marriage</span>
                </div>
                <div className="business-info">
                  <h3 className="business-title">結婚相談所事業</h3>
                  <p className="business-description">
                    IBJ正規加盟店として、<br />
                    お一人おひとりに寄り添いながら、<br />
                    素敵な出会いと幸せな結婚をサポートします。
                  </p>
                  <Link to="/business/marriage" className="business-link">
                    <span>詳しく見る</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Works Section */}
      <ScrollAnimation>
        <section className="home-works">
          <div className="container">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">
                <span className="title-en">Photo</span>
                <span className="title-jp">特別な瞬間</span>
              </h2>
            </div>

            <div className="works-showcase">
              <div className="works-grid">
                <div className="work-item large">
                  <img src={workImage1} alt="作品1" />
                  <div className="work-overlay">
                    <span className="work-category">Landscape</span>
                    <h4 className="work-title">Platform Stories</h4>
                  </div>
                </div>

                <div className="work-item">
                  <img src={workImage2} alt="作品2" />
                  <div className="work-overlay">
                    <span className="work-category">Documentary</span>
                    <h4 className="work-title">Waiting Moments</h4>
                  </div>
                </div>

                <div className="work-item">
                  <img src={workImage3} alt="作品3" />
                  <div className="work-overlay">
                    <span className="work-category">Nature</span>
                    <h4 className="work-title">Green Horizon</h4>
                  </div>
                </div>
              </div>

              <Link to="/business/photography/works" className="view-all-link">
                <span>View All Photos</span>
                <span className="link-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Contact Section */}
      <ScrollAnimation>
        <section className="home-contact">
          <div className="container">
            <div className="contact-content">
              <h2 className="contact-title">
                Contact
              </h2>
              <p className="contact-description">
                お気軽にお問い合わせください
              </p>
              <Link to="/contact" className="contact-button">
                <span>お問い合わせ</span>
                <span className="button-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
};

export default Home;