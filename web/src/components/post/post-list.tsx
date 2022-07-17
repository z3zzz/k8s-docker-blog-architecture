import Comment from '../comment';
import { PostItem } from '.';
import './post-list.css';

interface PostListProps {
  posts: PostItem[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h2>{post.title}</h2>
          <Comment postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
