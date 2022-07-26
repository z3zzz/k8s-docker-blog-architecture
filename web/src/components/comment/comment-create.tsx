import { SetStateAction, useState } from 'react';
import { CommentItem } from '.';
import Api from '../../utils/api';
import { randomId } from '../../utils/useful-functions';
import './comment-create.css';

interface CommentCreateProps {
  postId: string;
  setComments: React.Dispatch<SetStateAction<CommentItem[]>>;
}

const CommentCreate: React.FC<CommentCreateProps> = ({
  postId,
  setComments,
}) => {
  const [value, setValue] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = randomId();
    const newComment = {
      id,
      postId,
      content: value,
      status: 'pending',
    } as CommentItem;

    setComments((comments) => [...comments, newComment]);

    Api.post('/api/comment', newComment);

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
