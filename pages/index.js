import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import VideoGrid from '../components/VideoGrid';
import EditModal from '../components/EditModal';
import DigitalClock from '../components/DigitalClock';
import { useVideos } from '../hooks/useVideos';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditingVideo, setCurrentEditingVideo] = useState(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isNewVideo, setIsNewVideo] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    videos,
    error,
    loading,
    updateVideo,
    addVideo,
    deleteVideo
  } = useVideos(['TP5', 'TP6']);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (video, index, section) => {
    setCurrentEditingVideo(video);
    setCurrentEditingIndex(index);
    setCurrentSection(section);
    setIsNewVideo(false);
    setModalOpen(true);
  };

  const handleAdd = (section) => {
    setCurrentEditingVideo({ title: '', url: '' });
    setCurrentSection(section);
    setIsNewVideo(true);
    setModalOpen(true);
  };

  const handleModalSave = async (newTitle, newUrl) => {
    try {
      let result;
      if (isNewVideo) {
        result = await addVideo(currentSection, { title: newTitle, url: newUrl });
      } else {
        result = await updateVideo(currentSection, currentEditingIndex, newUrl, newTitle);
      }

      if (result.success) {
        showSuccessMessage(isNewVideo ? 'Video added successfully!' : 'Video updated successfully!');
      } else {
        throw new Error(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showSuccessMessage(`Error: ${error.message}`);
    }

    setModalOpen(false);
    resetModalState();
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    resetModalState();
  };

  const handleDelete = async () => {
    try {
      const result = await deleteVideo(currentSection, currentEditingIndex);
      if (result.success) {
        showSuccessMessage('Video deleted successfully!');
      } else {
        throw new Error(result.error || 'Delete operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showSuccessMessage(`Error: ${error.message}`);
    }

    setModalOpen(false);
    resetModalState();
  };

  const resetModalState = () => {
    setCurrentEditingVideo(null);
    setCurrentEditingIndex(null);
    setCurrentSection(null);
    setIsNewVideo(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TP5 & TP6 Youtube Stream</title>
        <meta name="description" content="Youtube Monitor for TP5 and TP6" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {error && (
        <div className={styles.errorMessage}>
          Error loading videos: {error}
        </div>
      )}

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.sectionsContainer}>
          <VideoGrid 
            videos={videos.TP5 || []} 
            title="TP-5 OTT" 
            section="TP5"
            onUpdate={(video, index) => handleEdit(video, index, 'TP5')}
            onAdd={(section) => handleAdd(section)}
            onDelete={handleDelete}
          />
          <VideoGrid 
            videos={videos.TP6 || []} 
            title="TP-6 OTT" 
            section="TP6"
            onUpdate={(video, index) => handleEdit(video, index, 'TP6')}
            onAdd={(section) => handleAdd(section)}
            onDelete={handleDelete}
          />
          {/* <DigitalClock /> */}
        </div>
      )}

      <EditModal
        visible={modalOpen}
        video={currentEditingVideo}
        onSave={handleModalSave}
        onCancel={handleModalCancel}
        onDelete={handleDelete}
        isNew={isNewVideo}
      />
    </div>
  );
}
