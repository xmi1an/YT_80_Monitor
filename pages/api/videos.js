import fs from 'fs/promises';
import path from 'path';
import videoData from '../../data';

// Helper function to sort videos by title
const sortVideosByTitle = (videos) => {
  return videos.sort((a, b) => {
    if (!a.title) return 1;
    if (!b.title) return -1;
    
    // Extract channel numbers (e.g., "CH161" -> 161)
    const aMatch = a.title.match(/CH(\d+)/);
    const bMatch = b.title.match(/CH(\d+)/);
    
    if (!aMatch) return 1;
    if (!bMatch) return -1;
    
    return parseInt(aMatch[1]) - parseInt(bMatch[1]);
  });
};

// Helper function to save data back to data.js
async function saveData(updatedData) {
  const filePath = path.join(process.cwd(), 'data.js');
  const content = `const videoData = ${JSON.stringify(updatedData, null, 2)};\n\n// Export the data\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = videoData;\n}`;
  await fs.writeFile(filePath, content, 'utf8');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(videoData);
  } 
  else if (req.method === 'POST') {
    const { section, video } = req.body;
    if (!videoData[section]) {
      videoData[section] = [];
    }
    videoData[section].push(video);
    videoData[section] = sortVideosByTitle(videoData[section]);
    
    try {
      await saveData(videoData);
      res.status(200).json({ message: 'Video added successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Error saving data' });
    }
  } 
  else if (req.method === 'PUT') {
    const { section, index, url, title } = req.body;
    if (!videoData[section] || !videoData[section][index]) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    videoData[section][index] = { url, title };
    videoData[section] = sortVideosByTitle(videoData[section]);

    try {
      await saveData(videoData);
      res.status(200).json({ message: 'Video updated successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Error saving data' });
    }
  } 
  else if (req.method === 'DELETE') {
    const { section, index } = req.body;
    if (!videoData[section] || !videoData[section][index]) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    videoData[section].splice(index, 1);
    try {
      await saveData(videoData);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Error saving data' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
