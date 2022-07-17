import './post-list.css';

interface Post {
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
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <div>commentlist</div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
