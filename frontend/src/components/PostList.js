import React from 'react';
import Post from './Post';

function PostList({ posts, onPostDeleted }) {
  if (!posts || posts.length === 0) {
    return <p className="text-center">No blog posts yet.</p>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          onPostDeleted={onPostDeleted} 
        />
      ))}
    </div>
  );
}

export default PostList;
