import Head from 'next/head';
import styles from '../styles/Home.module.css';
import VideoGrid from '../components/VideoGrid';
import DigitalClock from '../components/DigitalClock';
import { useVideos } from '../hooks/useVideos';

export default function TP3TP4Page() {
  const {
    videos,
    error,
    loading
  } = useVideos(['TP3', 'TP4']);

  return (
    <div className={styles.container}>
      <Head>
        <title>TP3 & TP4 Youtube Stream</title>
        <meta name="description" content="Youtube Monitor for TP3 and TP4" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {error && (
        <div className={styles.errorMessage}>
          Error loading videos: {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.sectionsContainer}>
          <VideoGrid 
            videos={videos.TP3 || []} 
            title="TP-3 OTT" 
            section="TP3"
          />
          <VideoGrid 
            videos={videos.TP4 || []} 
            title="TP-4 OTT" 
            section="TP4"
          />
          <DigitalClock adminUrl="/tp3tp4admin" />
        </div>
      )}
    </div>
  );
}
