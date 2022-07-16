import { useEffect, useState } from 'react';
import * as Api from '../../utils/api';
import './comment-list.css';

interface CommentListProps {
  postId: string;
}

interface Comment {
  id: string;
  comment: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async (postId: string) => {
      const comments = Api.get(``);
    };
  });

  return <div>header</div>;
};

export default CommentList;
