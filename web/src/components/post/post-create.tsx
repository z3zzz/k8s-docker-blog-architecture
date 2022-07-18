import { SetStateAction, useEffect, useState, useRef } from 'react';
import Api from '../../utils/api';
import { PostItem } from '.';
import './post-create.css';

interface PostCreateProps {
  setPosts: React.Dispatch<SetStateAction<PostItem[]>>;
}

const PostCreate: React.FC<PostCreateProps> = ({ setPosts }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await Api.post('/post', { title: value });

    const { data } = await Api.get('/query/posts');
    setPosts(data);

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
