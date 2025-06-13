import React from 'react';
import PostCard from './PostCard'; // Reuse your existing post component

function ProfilePosts({ posts }) {
  if (posts.length === 0) return <p>This user hasn't posted yet.</p>;

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default ProfilePosts;
