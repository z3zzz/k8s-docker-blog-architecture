import { SetStateAction, useEffect, useState, useRef } from 'react';
import * as Api from '../../utils/api';
import { Post } from '../post-list';
import './post-create.css';

interface PostCreateProps {
  setPosts: React.Dispatch<SetStateAction<Post[]>>;
}

const PostCreate: React.FC<PostCreateProps> = ({ setPosts }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async () => {
    await Api.post('/post', { title: value });

    const { data } = await Api.get('/posts');
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
      <label>
        Post <br />
        <input ref={inputRef} value={value} onChange={onChange} />
      </label>
      <button>Submit</button>
    </form>
  );
};

export default PostCreate;
