import { useState, useEffect } from 'react';
import { imageDb } from '../config'; // Ensure this file exports the configured Firebase storage instance
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function and alias it as uuidv4 for generating unique IDs
import './App.css';

function App() {
  const [img, setImg] = useState(null);
  const [imgUrls, setImgUrls] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [showAllItems, setShowAllItems] = useState(false); // State to toggle showing all items

  const handleClick = async () => {
    if (!img) {
      setUploadStatus('No file selected');
      return;
    }
    try {
      const imgRef = ref(imageDb, `files/${uuidv4()}`);
      await uploadBytes(imgRef, img);
      const url = await getDownloadURL(imgRef);
      console.log('Uploaded image URL:', url); // Log the image URL to the console

      // Send data to MongoDB via your backend server
      await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, imageUrl: url })
      });

      setUploadStatus('Upload and data save successful');
      fetchImages();
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const fetchImages = async () => {
    try {
      const listRef = ref(imageDb, 'files');
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      setImgUrls(urls);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };
  const toggleShowItems = () => {
    setShowAllItems(prev => !prev); // Toggle showAllItems state
  };
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="price">Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleClick}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {previewUrl && <div><img src={previewUrl} alt="Selected" style={{ maxWidth: '200px', marginTop: '10px' }} /></div>}

      {/* Button to toggle showing all items */}
      <button onClick={toggleShowItems}>
        {showAllItems ? 'Hide Items' : 'Show All Items'}
      </button>

      {/* Display items if showAllItems is true */}
      {showAllItems && (
        <div>
          <h2>All Items:</h2>
          {imgUrls.map((url, index) => (
            <img key={index} src={url} alt={`Item ${index}`} style={{ maxWidth: '200px', margin: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
