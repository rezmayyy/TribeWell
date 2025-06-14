import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';

function PostCard({ post }) {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [randomImage, setRandomImage] = useState('');

  // Fetch a random image from Lorem Picsum
  useEffect(() => {
    const fetchRandomImage = () => {
      const randomImg = `https://picsum.photos/200/200?random=${Math.random()}`; // Ensure a square size
      setRandomImage(randomImg);
    };

    fetchRandomImage(); // Call the function to set the random image URL
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
            src={authorInfo?.profilePicUrl || randomImage} // Use randomImage if no profile picture
            alt="Profile"
            width={40}
            height={40}
            className="rounded-circle me-2"
            style={{
              objectFit: 'cover',  // Make sure the image fits within the circle
            }}
          />
          <div>
            <strong>{authorInfo?.displayName || 'User'}</strong><br />
            <small className="text-muted">
              {post.timestamp?.toDate().toLocaleString() || 'Unknown date'}
            </small>
          </div>
        </div>

        {/* Caption or Title */}
        <Card.Text>
          {post.caption || post.title || <em>No description</em>}
        </Card.Text>

        {/* Media Content */}
        {post.type === 'image' && (
          <div className="d-flex justify-content-center">
            <Card.Img
              variant="bottom"
              src={post.fileURL}
              style={{
                width: '100%', // Use full width of the container
                maxWidth: '100%', // Remove hard-coded size, let it fill available space
                height: 'auto',  // Let the height adjust to maintain aspect ratio
                objectFit: 'cover',  // Ensure the image fills the space without distortion
              }}
            />
          </div>
        )}
        {post.type === 'video' && (
          <video controls className="w-100 mt-2">
            <source src={post.fileURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {post.type === 'audio' && (
          <audio controls className="w-100 mt-2">
            <source src={post.fileURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {post.type === 'article' && (
          <div className="mt-2 p-2 border rounded">
            <div className="d-flex justify-content-center">
              <img
                src={post.thumbnailURL || randomImage} // Use randomImage if no thumbnail
                alt="Article Thumbnail"
                style={{
                  width: '70%', // Take up full width of the container
                  maxWidth: '100%', // Make the thumbnail responsive
                  height: 'auto', // Maintain aspect ratio of the image
                  objectFit: 'cover', // Ensure the image is covered correctly
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
