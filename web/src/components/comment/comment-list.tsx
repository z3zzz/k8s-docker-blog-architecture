import { CommentItem } from '.';
import './comment-list.css';

interface CommentListProps {
  comments: CommentItem[];
}

export interface Comment {
  id: string;
  content: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div>
      <p>{`${comments.length} comments`}</p>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
