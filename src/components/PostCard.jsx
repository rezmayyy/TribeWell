import { useEffect, useState } from 'react';
import { Card, Badge, Button, Image } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';
import { FaHeart, FaComment, FaShareAlt } from 'react-icons/fa';

function PostCard({ post }) {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [randomImage, setRandomImage] = useState('');

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post!',
          text: post.caption || post.title || post.description || 'Check this out!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };

  return (
    <Card className="mb-4 shadow-sm rounded-4 fade-in" style={{ border: 'none' }}>
      <Card.Body className="d-flex flex-column">

        {/* Author Info */}
        <div className="d-flex align-items-center mb-3">
          <Image
            src={authorInfo?.profilePicUrl || randomImage}
            roundedCircle
            width={45}
            height={45}
            className="me-3"
            style={{ objectFit: 'cover' }}
          />
          <div>
            <div className="fw-bold">{authorInfo?.displayName || 'User'}</div>
            <small className="text-muted">{post.timestamp?.toDate().toLocaleString() || 'Unknown date'}</small>
            <div className="mt-1"><Badge bg="secondary" className="text-capitalize">{post.type || 'post'}</Badge></div>
          </div>
        </div>

        {/* Media Section with soft canvas background */}
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '15px' }}>
          {post.type === 'image' && post.fileURL && (
            <>
              <div className="d-flex justify-content-center mb-3">
                <Card.Img
                  src={post.fileURL}
                  style={{ width: '90%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }}
                />
              </div>
              <div className="px-2">
                <h5 className="fw-semibold">{post.caption || post.title || <em>No description</em>}</h5>
              </div>
            </>
          )}

          {post.type === 'video' && post.fileURL && (
            <div className="w-100 mb-3">
              <video controls style={{ width: '100%', borderRadius: '10px' }}>
                <source src={post.fileURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {post.type === 'audio' && post.fileURL && (
            <div className="d-flex flex-column align-items-center mb-3">
              <img
                src={post.thumbnailURL || randomImage}
                alt="Audio Thumbnail"
                style={{ width: '80%', maxWidth: '300px', borderRadius: '10px', objectFit: 'cover', marginBottom: '1rem' }}
              />
              <audio controls style={{ width: '100%' }}>
                <source src={post.fileURL} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="mt-3 text-center">
                <h5>{post.description || <em>No description</em>}</h5>
              </div>
            </div>
          )}

          {post.type === 'article' && (
            <>
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={post.thumbnailURL || randomImage}
                  alt="Article Thumbnail"
                  style={{ width: '80%', borderRadius: '10px', objectFit: 'cover' }}
                />
              </div>
              <h5>{post.articleTitle}</h5>
              <p className="text-muted">{post.articleSummary}</p>
              <a href={post.articleUrl} target="_blank" rel="noreferrer" className="fw-semibold">Read full article →</a>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-2 d-flex justify-content-around">
          <Button variant="light" className="rounded-pill action-btn">
            <FaHeart className="me-2 text-danger" /> Like
          </Button>
          <Button variant="light" className="rounded-pill action-btn">
            <FaComment className="me-2 text-primary" /> Comment
          </Button>
          <Button variant="light" className="rounded-pill action-btn" onClick={handleShare}>
            <FaShareAlt className="me-2 text-success" /> Share
          </Button>
        </div>
      </Card.Body>

      {/* Animations */}
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .action-btn {
            border: 1px solid #ddd;
            transition: all 0.3s ease;
          }
          .action-btn:hover {
            background-color: #f8f9fa;
            box-shadow: 0 3px 10px rgba(0,0,0,0.15);
            transform: translateY(-2px);
          }
        `}
      </style>
    </Card>
  );
}

export default PostCard;
