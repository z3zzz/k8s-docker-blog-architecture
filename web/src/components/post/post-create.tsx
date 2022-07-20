import { SetStateAction, useEffect, useState, useRef } from 'react';
import Api from '../../utils/api';
import { PostItem } from '.';
import './post-create.css';
import { randomId } from '../../utils/useful-functions';

interface PostCreateProps {
  setPosts: React.Dispatch<SetStateAction<PostItem[]>>;
}

const PostCreate: React.FC<PostCreateProps> = ({ setPosts }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = randomId();
    const newPost = { id, title: value, comments: [] };

    setPosts((posts) => [...posts, newPost]);

    Api.post('/api/post', { id, title: value });

    setValue('');
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>Create Post</h2>
      <label>
        Title <br />
        <input ref={inputRef} value={value} onChange={onChange} />
      </label>
      <br />
      <br />
      <button>Submit</button>
    </form>
  );
};

export default PostCreate;
