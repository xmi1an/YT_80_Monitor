import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Home.module.css';
import { getEmbedUrl } from './utils/youtube';

const VideoGrid = memo(({ 
  videos = [], 
  title, 
  section,
  onUpdate,
  onAdd,
  onDelete 
}) => {
  const isEditable = !!onUpdate && !!onAdd && !!onDelete;

  const handleEdit = (video, index) => {
    if (isEditable && onUpdate) {
      onUpdate(video, index);
    }
  };

  const handleAddNew = () => {
    if (isEditable && onAdd) {
      onAdd(section);
    }
  };

  return (
    <div className={styles.section}>
      <div 
        className={styles.sectionHeader}
        onClick={isEditable ? handleAddNew : undefined}
        style={isEditable ? { cursor: 'pointer' } : undefined}
        title={isEditable ? "Click to add new video" : undefined}
      >
        <h2>{title}</h2>
      </div>
      <div className={styles.videoGrid}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoContainer}>
            <div 
              className={styles.videoTitle}
              onClick={isEditable ? () => handleEdit(video, index) : undefined}
              style={isEditable ? { cursor: 'pointer' } : undefined}
              title={isEditable ? "Click to edit" : undefined}
            >
              {video.title}
            </div>
            <div className={styles.videoFrame}>
              {video.url ? (
                <iframe
                  src={getEmbedUrl(video.url)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className={styles.noVideo}>No video available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

VideoGrid.displayName = 'VideoGrid';

VideoGrid.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  title: PropTypes.string.isRequired,
  section: PropTypes.string,
  onUpdate: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

export default VideoGrid;
