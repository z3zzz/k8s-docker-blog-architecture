import { useState, useEffect } from 'react';
import PostList from './post-list';
import PostCreate from './post-create';
import Api from '../../utils/api';
import { CommentItem } from '../comment';

export interface PostItem {
  id: string;
  title: string;
  comments: CommentItem[];
}

const Post: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await Api.get('/api/query/posts');
      setPosts(data);
    };

    getPosts();
  }, []);

  return (
    <div>
      <PostCreate setPosts={setPosts} />
      <hr />
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default Post;
