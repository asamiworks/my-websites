// src/components/sections/InstagramFeed.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./InstagramFeed.module.css";
import { api } from "@/lib/api";  // APIクライアントをインポート

interface InstagramPost {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type: string;
  timestamp: string;
}

interface InstagramFeedResponse {
  data: InstagramPost[];
  count: number;
  message?: string;
  timestamp: string;
  error?: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        // api.instagram()を使用
        const data: InstagramFeedResponse = await api.instagram.getPhotos();
        
        if (data.error) {
          console.error('Instagram API Error:', data.error);
          setError('Instagram フィードの読み込みに失敗しました');
        } else {
          setPosts(data.data || []);
        }
      } catch (error) {
        console.error('Instagram posts fetch error:', error);
        setError('Instagram フィードの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) {
    return (
      <section className={styles.instagramSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>最新情報</h2>
          <div className={styles.feedGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeletonItem}>
                <div className={styles.skeletonShimmer} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    console.log('Instagram feed not displayed:', error || 'No posts available');
    return null;
  }

  return (
    <section className={styles.instagramSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          最新情報<span className={styles.subtitle}>from Instagram</span>
        </h2>
        
        <div className={styles.feedGrid}>
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.postItem}
              aria-label={`Instagram投稿: ${post.caption?.substring(0, 50) || ''}...`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={post.media_url || post.thumbnail_url}
                  alt={post.caption || "Instagram post"}
                  className={styles.postImage}
                  loading="lazy"
                  width="300"
                  height="300"
                />
                <div className={styles.overlay}>
                  <svg className={styles.instagramIcon} viewBox="0 0 24 24" fill="white" width="32" height="32">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                  <span className={styles.viewPost}>投稿を見る</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className={styles.followCta}>
        <a  
            href="https://www.instagram.com/asamiworks_web/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.followButton}
          >
            <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
            @asamiworks_web をフォロー
          </a>
          <p className={styles.followText}>
            最新の制作事例やWeb制作のヒントを配信中
          </p>
        </div>
      </div>
    </section>
  );
}