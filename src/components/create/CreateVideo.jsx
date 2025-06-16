import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { db, auth, storage } from '../../services/Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

function CreateVideo() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !title) {
      setError('Please fill in all fields and select a video.');
      return;
    }

    setUploading(true);
    const videoRef = ref(storage, `videos/${videoFile.name}`);
    const videoThumbnailRef = thumbnailFile ? ref(storage, `thumbnails/${thumbnailFile.name}`) : null;

    try {
      // Upload video to Firebase Storage
      await uploadBytes(videoRef, videoFile);
      const videoURL = await getDownloadURL(videoRef);

      // If a thumbnail is selected, upload it to Firebase Storage
      let thumbnailURL = '';
      if (thumbnailFile) {
        await uploadBytes(videoThumbnailRef, thumbnailFile);
        thumbnailURL = await getDownloadURL(videoThumbnailRef);
      }

      // Create a document in Firestore for the new video post
      const videoPostRef = doc(db, 'posts', new Date().toISOString());
      await setDoc(videoPostRef, {
        fileURL: videoURL,
        title,
        description,
        type: 'video',
        thumbnailURL,
        timestamp: new Date(),
        userId: user.uid,
        status: 'approved',  // Or any other status you wish
        views: 0,
        likesCount: 0
      });

      setUploading(false);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (err) {
      setUploading(false);
      setError('Error uploading the video. Please try again later.');
      console.error(err);
    }
  };

  // Only allow healers and admins to access the form
  if (!user || (role !== 'healer' && role !== 'admin')) {
    return <Alert variant="danger">You must be a healer to post videos. Apply to be a healer today!</Alert>;
  }

  return (
    <Container className="my-5 p-4 border rounded shadow-sm">
      <h2 className="mb-4">Upload Video</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Video uploaded successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            placeholder="Enter video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Video File</Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
        </Form.Group>

        {/* Thumbnail upload */}
        <Form.Group className="mb-3">
          <Form.Label>Select Thumbnail Image (Optional)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={uploading} className="w-100 mt-3">
          {uploading ? 'Uploading...' : 'Upload Video'}
        </Button>

      </Form>
    </Container>
  );
}

export default CreateVideo;
