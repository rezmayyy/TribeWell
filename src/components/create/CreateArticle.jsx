import { useState, useEffect } from 'react';
import { db, auth, storage } from '../../services/Firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import TagSelector from '../TagSystem/TagSelector';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';

function CreateArticle() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState(EditorState.createEmpty());
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
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
    if (!title || !description || tags.length === 0) return;

    setLoading(true);
    try {
      let thumbnailURL = '';

      if (thumbnail) {
        const thumbRef = ref(storage, `thumbnails/${user.uid}/${Date.now()}_${thumbnail.name}`);
        const uploadResult = await uploadBytes(thumbRef, thumbnail);
        thumbnailURL = await getDownloadURL(uploadResult.ref);
      }

      const htmlBody = stateToHTML(body.getCurrentContent());

      await addDoc(collection(db, 'content-posts'), {
        type: 'article',
        title,
        description,
        body: htmlBody,
        userId: user.uid,
        tags: tags.map(tag => tag.value),
        thumbnailURL,
        timestamp: serverTimestamp(),
        status: 'approved',
        views: 0,
        likesCount: 0,
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setBody(EditorState.createEmpty());
      setTags([]);
      setThumbnail(null);
    } catch (err) {
      console.error('Error posting article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (editorState) => {
    setBody(editorState);
  };

  if (!user || (role !== 'healer' && role !== 'admin')) {
    return <Alert variant="danger">You must be a healer to post articles. Apply to be a healer today!</Alert>;
  }

  return (
    <Container className="create-article my-5 p-4 border rounded shadow-sm">
      <Row className="mb-4">
        <Col>
          <h2>Create Article</h2>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Article Title"
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
          <Form.Label>Optional Thumbnail Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </Form.Group>

        <div className="editor-container mb-4" style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
          <Editor
            editorState={body}
            onChange={handleEditorChange}
            placeholder="Write your article here..."
          />
        </div>

        <TagSelector 
          selectedTags={tags} 
          setSelectedTags={setTags} 
        />

        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="w-100 mt-3"
        >
          {loading ? 'Posting...' : 'Post Article'}
        </Button>

        {success && <Alert variant="success" className="mt-3">✅ Article posted successfully!</Alert>}
      </Form>
    </Container>
  );
}

export default CreateArticle;
