import { useEffect, useState } from 'react';
import * as Api from '../../utils/api';
import CommentCreate from '../comment-create';
import './comment-list.css';

interface CommentListProps {
  postId: string;
}

export interface Comment {
  id: string;
  content: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async (postId: string) => {
      const { data }: { data: Comment[] } = await Api.get(
        `/comments?postId=${postId}`
      );

      setComments(data);
    };

    getComments(postId);
  }, [postId]);

  return (
    <div>
      <p>{`${comments.length} comments`}</p>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
      <CommentCreate postId={postId} setComments={setComments} />
    </div>
  );
};

export default CommentList;
