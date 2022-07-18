import { useState } from 'react';
import CommentList from './comment-list';
import CommentCreate from './comment-create';

interface CommentProps {
  postId: string;
  previousComments: CommentItem[];
}

export interface CommentItem {
  id: string;
  content: string;
}

const Comment: React.FC<CommentProps> = ({ postId, previousComments }) => {
  const [comments, setComments] = useState<CommentItem[]>(previousComments);

  return (
    <div>
      <CommentList comments={comments} />
      <CommentCreate postId={postId} setComments={setComments} />
    </div>
  );
};

export default Comment;
