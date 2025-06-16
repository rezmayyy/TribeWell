import { useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';

function PostCard({ post }) {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [randomImage, setRandomImage] = useState('');

  // Fetch a random image from Lorem Picsum
  useEffect(() => {
    const fetchRandomImage = () => {
      const randomImg = `https://picsum.photos/200/200?random=${Math.random()}`;
      setRandomImage(randomImg);
    };

    fetchRandomImage();
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!post.userId) return;
      try {
        const docRef = doc(db, 'users', post.userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuthorInfo(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchAuthor();
  }, [post.userId]);

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex flex-column">
        {/* User Info */}
        <div className="d-flex align-items-center mb-2">
          <img
            src={authorInfo?.profilePicUrl || randomImage}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-circle me-2"
            style={{
              objectFit: 'cover',
            }}
          />
          <div>
            <strong>{authorInfo?.displayName || 'User'}</strong><br />
            <small className="text-muted">
              {post.timestamp?.toDate().toLocaleString() || 'Unknown date'}
            </small>
            <br />
            <Badge bg="secondary" className="mt-1 text-capitalize">
              {post.type || 'post'}
            </Badge>
          </div>
        </div>

        {/* Media Content */}
        {post.type === 'image' && post.fileURL && (
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-center">
              <Card.Img
                variant="bottom"
                src={post.fileURL}
                style={{
                  width: '70%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="d-flex align-items-baseline mt-2 px-4">
              <strong className="me-2">{authorInfo?.displayName || 'User'}:</strong>
              <Card.Text className="mb-0">
                {post.caption || post.title || <em>No description</em>}
              </Card.Text>
            </div>
          </div>
        )}

        {post.type === 'video' && post.fileURL && (
          <video controls className="w-100 mt-2">
            <source src={post.fileURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {post.type === 'audio' && post.fileURL && (
          <div className="d-flex flex-column mt-2">
            {/* Thumbnail for Audio */}
            <div className="d-flex justify-content-center mb-2">
              <img
                src={post.thumbnailURL || randomImage}
                alt="Audio Thumbnail"
                style={{
                  width: '70%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                }}
              />
            </div>
            {/* Audio Player */}
            <audio controls className="w-100">
              <source src={post.fileURL} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-2">
              <strong>{authorInfo?.displayName || 'User'}:</strong>
              <Card.Text className="mb-0">
                {post.description || <em>No description</em>}
              </Card.Text>
            </div>
          </div>
        )}

        {post.type === 'article' && (
          <div className="mt-2 p-2 border rounded">
            <div className="d-flex justify-content-center">
              <img
                src={post.thumbnailURL || randomImage}
                alt="Article Thumbnail"
                style={{
                  width: '70%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                }}
              />
            </div>
            <h5>{post.articleTitle}</h5>
            <p className="text-muted">{post.articleSummary}</p>
            <a href={post.articleUrl} target="_blank" rel="noreferrer">Read more</a>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostCard;
