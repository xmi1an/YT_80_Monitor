import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Admin.module.css';

const EditModal = ({ visible, video, onSave, onCancel, onDelete, isNew = false }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (video) {
      setEditedTitle(video.title || '');
      setEditedUrl(video.url || '');
      validateTitle(video.title || '');
      validateUrl(video.url || '');
    }
    setShowDeleteConfirm(false);
    
    // Auto-focus title input when modal opens
    if (visible && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 100);
    }
  }, [video, visible]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCancel();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible]);

  const validateTitle = (title) => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      setIsValidTitle(false);
      return false;
    }

    if (isNew) {
      const titlePattern = /^CH\d+\s*\|\s*[A-Z0-9]+$/;
      if (!titlePattern.test(title)) {
        setError('Title must be in format "CH123 | ABC45"');
        setIsValidTitle(false);
        return false;
      }
    }

    setIsValidTitle(true);
    setError('');
    return true;
  };

  const validateUrl = (url) => {
    if (!url.trim()) {
      setError('URL cannot be empty');
      setIsValidUrl(false);
      return false;
    }

    const youtubePattern = /^https:\/\/(www\.)?youtube\.com\/(embed\/|watch\?v=)[a-zA-Z0-9_-]+/;
    if (!youtubePattern.test(url)) {
      setError('Please enter a valid YouTube URL');
      setIsValidUrl(false);
      return false;
    }

    setIsValidUrl(true);
    setError('');
    return true;
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditedTitle(newTitle);
    validateTitle(newTitle);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setEditedUrl(newUrl);
    validateUrl(newUrl);
  };

  const handleSave = () => {
    const isTitleValid = validateTitle(editedTitle);
    const isUrlValid = validateUrl(editedUrl);

    if (!isTitleValid || !isUrlValid) {
      return;
    }

    onSave(editedTitle, editedUrl);
    setError('');
  };

  const handleCancel = () => {
    setError('');
    setShowDeleteConfirm(false);
    setIsValidTitle(true);
    setIsValidUrl(true);
    onCancel();
  };

  const handleOpenUrl = () => {
    if (editedUrl) {
      // Convert embed URL to watch URL if needed
      let watchUrl = editedUrl;
      if (editedUrl.includes('embed/')) {
        const videoId = editedUrl.split('embed/')[1].split('?')[0];
        watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
      window.open(watchUrl, '_blank');
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

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={`${styles.modalContent} ${styles.modalAnimate}`}>
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
              <button 
                onClick={handleCancel} 
                className={styles.closeButton}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {error && (
                <div className={`${styles.errorMessage} ${styles.errorShake}`}>
                  {error}
                </div>
              )}
              <div className={styles.inputWrapper}>
                <label htmlFor="videoTitle">Title (format: CH123 | ABC45)</label>
                <input
                  id="videoTitle"
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={handleTitleChange}
                  className={`${styles.modalInput} ${!isValidTitle ? styles.inputError : ''}`}
                  placeholder="Enter Video Title (e.g., CH161 | LA41)"
                />
                <div className={styles.inputHelper}>
                  Format example: CH161 | LA41
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="videoUrl">URL (YouTube)</label>
                <div className={styles.urlInputGroup}>
                  <input
                    id="videoUrl"
                    type="text"
                    value={editedUrl}
                    onChange={handleUrlChange}
                    className={`${styles.modalInput} ${!isValidUrl ? styles.inputError : ''}`}
                    placeholder="Enter YouTube URL"
                  />
                  <button 
                    onClick={handleOpenUrl}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnIcon}`}
                    disabled={!editedUrl}
                    title={editedUrl ? "Open URL in new tab" : "No URL to open"}
                  >
                    <span className={styles.btnText}>Preview</span>
                  </button>
                </div>
                <div className={styles.inputHelper}>
                  Example: https://www.youtube.com/watch?v=xxxxx
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.modalActions}>
                {!isNew && (
                  <button 
                    onClick={handleDeleteClick}
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnWithIcon}`}
                    title="Delete this video"
                  >
                    <span className={styles.btnText}>Delete</span>
                  </button>
                )}
                <div className={styles.primaryActions}>
                  <button 
                    onClick={handleCancel} 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={!isValidTitle || !isValidUrl}
                  >
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
