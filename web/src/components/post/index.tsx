import { useState, useEffect } from 'react';
import PostList from './post-list';
import PostCreate from './post-create';
import Api from '../../utils/api';

export interface PostItem {
  id: string;
  title: string;
}

const Post: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);

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

export default Post;
