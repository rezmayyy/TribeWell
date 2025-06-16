import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { db, auth, storage } from '../../services/Firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import TagSelector from '../TagSystem/TagSelector';

function CreateAudio() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null); // For thumbnail image
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || tags.length === 0 || !audioFile) return;

    setLoading(true);
    try {
      // Upload audio file
      const audioStoragePath = `content_uploads/${user.uid}/${Date.now()}_${audioFile.name}`;
      const audioRef = ref(storage, audioStoragePath);
      const audioUploadResult = await uploadBytes(audioRef, audioFile);
      const fileURL = await getDownloadURL(audioUploadResult.ref);

      // Upload thumbnail image if selected
      let thumbnailURL = '';
      if (thumbnailFile) {
        const thumbnailStoragePath = `content_uploads/${user.uid}/${Date.now()}_${thumbnailFile.name}`;
        const thumbnailRef = ref(storage, thumbnailStoragePath);
        const thumbnailUploadResult = await uploadBytes(thumbnailRef, thumbnailFile);
        thumbnailURL = await getDownloadURL(thumbnailUploadResult.ref);
      }

      // Save the post data to Firestore
      await addDoc(collection(db, 'content-posts'), {
        type: 'audio',
        title,
        description,
        fileURL,
        thumbnailURL,
        userId: user.uid,
        tags: tags.map(tag => tag.value),
        timestamp: serverTimestamp(),
        status: 'approved',
        views: 0,
        likesCount: 0,
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setTags([]);
      setAudioFile(null);
      setThumbnailFile(null);
    } catch (err) {
      console.error('Error posting audio:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (role !== 'healer' && role !== 'admin')) {
    return <Alert variant="danger">Only healers and admins can upload audio content.</Alert>;
  }

  return (
    <Container className="my-5 p-4 border rounded shadow-sm">
      <h2 className="mb-4">Upload Audio</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Audio Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control-lg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Audio File</Form.Label>
          <Form.Control
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
          />
        </Form.Group>

        {/* Thumbnail upload */}
        <Form.Group className="mb-3">
          <Form.Label>Select Thumbnail Image (Optional)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
          />
        </Form.Group>

        <TagSelector selectedTags={tags} setSelectedTags={setTags} />

        <Button type="submit" variant="primary" disabled={loading} className="w-100 mt-3">
          {loading ? 'Uploading...' : 'Upload Audio'}
        </Button>

        {success && <Alert variant="success" className="mt-3">✅ Audio uploaded successfully!</Alert>}
      </Form>
    </Container>
  );
}

export default CreateAudio;
