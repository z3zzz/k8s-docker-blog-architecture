import Comment from '../comment';
import { PostItem } from '.';
import './post-list.css';
import { Dispatch, SetStateAction } from 'react';

interface PostListProps {
  posts: PostItem[];
  setPosts: Dispatch<SetStateAction<PostItem[]>>;
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h2>{post.title}</h2>
          <Comment postId={post.id} previousComments={post.comments} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
