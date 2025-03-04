import { useState, useEffect, useCallback } from 'react';

const REFRESH_INTERVAL = 600000; // 10 minutes

export const useVideos = (sections = []) => {
  const [videos, setVideos] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      
      // Filter data to only include requested sections
      const filteredData = {};
      sections.forEach(section => {
        filteredData[section] = data[section] || [];
      });
      
      setVideos(filteredData);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sections]);

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchVideos]);

  const updateVideo = async (section, index, newUrl, newTitle) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          index,
          url: newUrl,
          title: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update video');
      }

      await fetchVideos();
      return { success: true };
    } catch (err) {
      console.error('Error updating video:', err);
      return { success: false, error: err.message };
    }
  };

  const addVideo = async (section, video) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          video,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add video');
      }

      await fetchVideos();
      return { success: true };
    } catch (err) {
      console.error('Error adding video:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteVideo = async (section, index) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          index,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      await fetchVideos();
      return { success: true };
    } catch (err) {
      console.error('Error deleting video:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    videos,
    error,
    loading,
    updateVideo,
    addVideo,
    deleteVideo,
    refreshVideos: fetchVideos,
  };
};
