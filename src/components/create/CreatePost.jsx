import { useState, useEffect } from 'react';
import { db, auth, storage } from '../../services/Firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { Form, Button, Container, Alert, Row, Col, Image } from 'react-bootstrap';

function CreatePost() {
  const [user, setUser] = useState(null);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !imageFile) return;

    setLoading(true);
    let fileURL = null;

    try {
      // Upload image to Firebase Storage if provided
      if (imageFile) {
        const imageRef = ref(storage, `content_uploads/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        fileURL = await getDownloadURL(imageRef);
      }

      // Save post to Firestore
      await addDoc(collection(db, 'content-posts'), {
        type: 'image',
        userId: user.uid,
        caption,
        fileURL,
        timestamp: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        status: 'approved',
      });

      setCaption('');
      setImageFile(null);
      setPreviewURL(null);
      setSuccess(true);
    } catch (err) {
      console.error('Error posting:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Alert variant="danger">You must be logged in to create a post.</Alert>;

  return (
    <Container className="my-5 p-4 border rounded shadow-sm">
      <Row className="mb-4">
        <Col>
          <h2>Create a Post</h2>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Image (optional)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

        {previewURL && (
          <div className="mb-3 text-center">
            <Image src={previewURL} alt="Preview" thumbnail fluid style={{ maxHeight: '300px' }} />
          </div>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="w-100">
          {loading ? 'Posting...' : 'Post'}
        </Button>

        {success && <Alert variant="success" className="mt-3">✅ Post created successfully!</Alert>}
      </Form>
    </Container>
  );
}

export default CreatePost;
