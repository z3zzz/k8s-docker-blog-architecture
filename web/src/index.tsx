import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import PostList, { Post } from './components/post-list';
import PostCreate from './components/post-create';
import * as Api from './utils/api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await Api.get('/posts');
      setPosts(data);
    };

    getPosts();
  }, []);

  return (
    <div>
      <PostCreate setPosts={setPosts} />
      <hr />
      <PostList posts={posts} />
    </div>
  );
};

root.render(<App />);
