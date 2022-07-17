import { SetStateAction, useState } from 'react';
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await Api.post('/comment', { postId, content: value });

    const { data } = await Api.get(`/comments?postId=${postId}`);
    setComments(data);

    setValue('');
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Comment <br />
        <input value={value} onChange={onChange} />
      </label>
      <br />
      <br />
      <button>Submit</button>
    </form>
  );
};

export default CommentCreate;
