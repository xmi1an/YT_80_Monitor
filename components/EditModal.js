import { useState, useEffect } from 'react';
import styles from '../styles/Admin.module.css';

const EditModal = ({ visible, video, onSave, onCancel, onDelete, isNew = false }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (video) {
      setEditedTitle(video.title || '');
      setEditedUrl(video.url || '');
    }
    // Reset delete confirmation when modal opens/closes
    setShowDeleteConfirm(false);
  }, [video]);

  if (!visible) return null;

  const handleSave = () => {
    if (!editedTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    if (!editedUrl.trim()) {
      setError('URL cannot be empty');
      return;
    }

    // Validate title format for new videos
    if (isNew) {
      const titlePattern = /^CH\d+\s*\|\s*[A-Z0-9]+$/;
      if (!titlePattern.test(editedTitle)) {
        setError('Title must be in format "CH123 | ABC45"');
        return;
      }
    }

    // Validate YouTube URL
    const youtubePattern = /^https:\/\/(www\.)?youtube\.com\/(embed\/|watch\?v=)[a-zA-Z0-9_-]+/;
    if (!youtubePattern.test(editedUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    onSave(editedTitle, editedUrl);
    setError('');
  };

  const handleCancel = () => {
    setError('');
    setShowDeleteConfirm(false);
    onCancel();
  };

  const handleOpenUrl = () => {
    if (editedUrl) {
      window.open(editedUrl, '_blank');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {showDeleteConfirm ? (
          <div className={styles.confirmDelete}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this video?</p>
            <div className={styles.confirmButtons}>
              <button 
                onClick={handleCancelDelete}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className={`${styles.btn} ${styles.btnDanger}`}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2>{isNew ? 'Add New Video' : 'Edit Video'}</h2>
              <button onClick={handleCancel} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <div className={styles.inputWrapper}>
                <label>Title (format: CH123 | ABC45)</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className={styles.modalInput}
                  placeholder="Enter Video Title (e.g., CH161 | LA41)"
                />
              </div>
              <div className={styles.inputWrapper}>
                <label>URL (YouTube)</label>
                <div className={styles.urlInputGroup}>
                  <input
                    type="text"
                    value={editedUrl}
                    onChange={(e) => setEditedUrl(e.target.value)}
                    className={styles.modalInput}
                    placeholder="Enter YouTube URL"
                  />
                  <button 
                    onClick={handleOpenUrl}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    disabled={!editedUrl}
                    title={editedUrl ? "Open URL in new tab" : "No URL to open"}
                  >
                    Open URL
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                {!isNew && (
                  <button 
                    onClick={handleDeleteClick}
                    className={`${styles.btn} ${styles.btnDanger}`}
                    title="Delete this video"
                  >
                    Delete
                  </button>
                )}
                <div className={styles.primaryActions}>
                  <button onClick={handleCancel} className={`${styles.btn} ${styles.btnSecondary}`}>
                    Cancel
                  </button>
                  <button onClick={handleSave} className={`${styles.btn} ${styles.btnPrimary}`}>
                    {isNew ? 'Add' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditModal;
