import { useEffect, useState } from 'react';
import { Card, Badge, Button, Image, Form, InputGroup } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';
import { FaHeart, FaComment, FaShareAlt, FaChevronDown, FaChevronUp, FaUserCircle } from 'react-icons/fa';

function PostCard({ post }) {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [randomImage, setRandomImage] = useState('');
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);

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

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    setComments(prev => [...prev, newComment.trim()]);
    setNewComment('');
  };

  return (
    <Card className="mb-5 shadow-sm rounded-4 fade-in" style={{ border: 'none' }}>
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
            <div className="fw-semibold">{authorInfo?.displayName || 'User'}</div>
            <small className="text-muted">{post.timestamp?.toDate().toLocaleString() || 'Unknown date'}</small>
            <div className="mt-1">
              <Badge bg="light" text="dark" className="border text-capitalize">
                {post.type || 'post'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="media-container">
          {post.type === 'image' && post.fileURL && (
            <div className="d-flex justify-content-center mb-3">
              <Card.Img
                src={post.fileURL}
                style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
              />
            </div>
          )}

          {post.type === 'video' && post.fileURL && (
            <div className="w-100 mb-3">
              <video controls style={{ width: '100%', borderRadius: '10px' }}>
                <source src={post.fileURL} type="video/mp4" />
              </video>
            </div>
          )}

          {post.type === 'audio' && post.fileURL && (
            <div className="d-flex flex-column align-items-center mb-3">
              <img
                src={post.thumbnailURL || randomImage}
                alt="Audio Thumbnail"
                style={{ width: '80%', borderRadius: '10px', marginBottom: '1rem' }}
              />
              <audio controls style={{ width: '100%' }}>
                <source src={post.fileURL} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {post.type === 'article' && (
            <>
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={post.thumbnailURL || randomImage}
                  alt="Article Thumbnail"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>
              <h5>{post.articleTitle}</h5>
              <p className="text-muted">{post.articleSummary}</p>
              <a href={post.articleUrl} target="_blank" rel="noreferrer" className="fw-semibold">
                Read full article →
              </a>
            </>
          )}
        </div>

        {/* Caption */}
        <div className="mt-3">
          <h5 className="fw-bold">{post.caption || post.title || <em>No description</em>}</h5>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 d-flex justify-content-around">
          <Button variant="light" className="rounded-pill visible-action-btn">
            <FaHeart className="me-2 text-danger" /> Like
          </Button>
          <Button
            variant="light"
            className="rounded-pill visible-action-btn"
            onClick={() => setShowCommentSection(prev => !prev)}
          >
            <FaComment className="me-2 text-primary" /> {showCommentSection ? 'Hide' : 'Comment'}
          </Button>
          <Button variant="light" className="rounded-pill visible-action-btn" onClick={handleShare}>
            <FaShareAlt className="me-2 text-success" /> Share
          </Button>
        </div>

        {/* Comment Section */}
        {showCommentSection && (
          <div className="mt-4 comment-section-container p-3 rounded-4">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddComment())}
                className="rounded-pill px-3 comment-input"
              />
              <Button variant="primary" className="rounded-pill ms-2 px-4" onClick={handleAddComment}>
                Post
              </Button>
            </InputGroup>

            {comments.length > 0 && (
              <div className="mt-2">
                {!showAllComments && comments.length > 2 && (
                  <Button variant="link" size="sm" className="p-0 mb-2 fw-semibold" onClick={() => setShowAllComments(true)}>
                    View all comments ({comments.length}) <FaChevronDown />
                  </Button>
                )}

                {comments.slice(0, showAllComments ? comments.length : 2).map((c, idx) => (
                  <div key={idx} className="d-flex align-items-start mb-3 fade-in-comment">
                    <FaUserCircle size={22} className="me-2 text-secondary" />
                    <div className="comment-bubble">
                      <span className="fw-semibold">User:</span> {c}
                    </div>
                  </div>
                ))}

                {showAllComments && comments.length > 2 && (
                  <Button variant="link" size="sm" className="p-0 fw-semibold" onClick={() => setShowAllComments(false)}>
                    Hide comments <FaChevronUp />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Card.Body>

      <style>
        {`
          .fade-in {
            animation: fadeIn 0.5s ease;
          }
          .fade-in-comment {
            animation: fadeInComment 0.4s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInComment {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .visible-action-btn {
            background-color: #f1f1f1;
            border: 1px solid #ddd;
            padding: 10px 22px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .visible-action-btn:hover {
            background-color: #e9ecef;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transform: translateY(-2px);
          }
          .comment-bubble {
            background: #ffffff;
            border: 1px solid #eee;
            padding: 10px 15px;
            border-radius: 18px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.05);
            max-width: 80%;
          }
          .comment-section-container {
            background-color: #f9fafb;
            border: 1px solid #eee;
          }
          .media-container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 12px;
          }
          .comment-input:focus {
            border-color: #86b7fe;
            box-shadow: 0 0 0 0.2rem rgba(13,110,253,.25);
          }
        `}
      </style>
    </Card>
  );
}

export default PostCard;
