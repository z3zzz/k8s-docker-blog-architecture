import CommentList from '../comment-list';
import './post-list.css';

export interface Post {
  id: string;
  title: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h2>{post.title}</h2>
          <CommentList postId={post.id} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
