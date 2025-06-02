import { Card } from 'react-bootstrap';

function PostCard({ post }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        {/* User Info */}
        <div className="d-flex align-items-center mb-2">
          <img
            src={post.authorProfilePic || '/default-profile.png'}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-circle me-2"
          />
          <div>
            <strong>{post.userId || 'User'}</strong><br />
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
          <Card.Img variant="bottom" src={post.fileURL} />
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
