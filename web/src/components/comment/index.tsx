import { useEffect, useState } from 'react';
import Api from '../../utils/api';
import CommentList from './comment-list';
import CommentCreate from './comment-create';

interface CommentProps {
  postId: string;
}

export interface CommentItem {
  id: string;
  content: string;
}

const Comment: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    const getComments = async () => {
      const { data }: { data: CommentItem[] } = await Api.get(
        `/comments?postId=${postId}`
      );

      setComments(data);
    };

    getComments();
  }, [postId]);

  return (
    <div>
      <CommentList comments={comments} />
      <CommentCreate postId={postId} setComments={setComments} />
    </div>
  );
};

export default Comment;
