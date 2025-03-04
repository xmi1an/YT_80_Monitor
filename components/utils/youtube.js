/**
 * Formats a YouTube URL into an embed URL with specified parameters
 * @param {string} url - The YouTube URL to format
 * @param {Object} options - Options for the embed URL
 * @param {boolean} options.autoplay - Whether to autoplay the video (default: true)
 * @param {boolean} options.mute - Whether to mute the video (default: true)
 * @param {boolean} options.controls - Whether to show video controls (default: false)
 * @param {string} options.quality - Video quality (default: 'small')
 * @returns {string} The formatted embed URL
 */
export const getEmbedUrl = (url, options = {}) => {
  if (!url) return '';

  const {
    autoplay = true,
    mute = true,
    controls = false,
    quality = 'small'
  } = options;

  try {
    // If already an embed URL, just append parameters
    if (url.includes('embed')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&playsinline=1&controls=${controls ? 1 : 0}&rel=0&modestbranding=1&vq=${quality}`;
    }

    // Convert watch URL to embed URL
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${mute ? 1 : 0}&playsinline=1&controls=${controls ? 1 : 0}&rel=0&modestbranding=1&vq=${quality}`;
    }

    // Return original URL if it doesn't match known patterns
    return url;
  } catch (error) {
    console.error('Error formatting YouTube URL:', error);
    return '';
  }
};
