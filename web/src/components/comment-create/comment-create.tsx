import { SetStateAction, useEffect, useState, useRef } from 'react';
import * as Api from '../../utils/api';
import { Comment } from '../comment-list';
import './comment-create.css';

interface CommentCreateProps {
  postId: string;
  setComments: React.Dispatch<SetStateAction<Comment[]>>;
}

const CommentCreate: React.FC<CommentCreateProps> = ({
  postId,
  setComments,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async () => {
    await Api.post('/comment', { postId, content: value });

    const { data } = await Api.get(`/comments?postId=${postId}`);
    setComments(data);

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
        Comment <br />
        <input ref={inputRef} value={value} onChange={onChange} />
      </label>
      <button>Submit</button>
    </form>
  );
};

export default CommentCreate;
