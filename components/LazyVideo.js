import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Admin.module.css';

export default function LazyVideo({ url }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div ref={videoRef} className={styles.videoPreview}>
      <div className={styles.videoWrapper}>
        {!url ? (
          <div className={styles.videoPlaceholder}>No video URL</div>
        ) : isIntersecting ? (
          <iframe
            src={url.includes('embed') ? `${url}?autoplay=0&mute=1&vq=tiny` : 
                 url.includes('watch?v=') ? `${url.replace('watch?v=', 'embed/')}?autoplay=0&mute=1&vq=tiny` :
                 url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles.videoPlaceholder}>Loading...</div>
        )}
      </div>
    </div>
  );
}
