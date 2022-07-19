import { CommentItem } from '.';
import './comment-list.css';

interface CommentListProps {
  comments: CommentItem[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  function commentLiTag(comment: CommentItem) {
    const { status } = comment;

    if (status === 'approved') {
      return <li key={comment.id}>{comment.content}</li>;
    }

    if (status === 'rejected') {
      return <li key={comment.id}>This comment is blocked due to policy</li>;
    }

    if (status === 'pending') {
      return (
        <li key={comment.id}>
          This comment is waiting for approval to be visible
        </li>
      );
    }
  }

  return (
    <div>
      <p>{`${comments.length} comments`}</p>
      <ul>{comments.map((comment) => commentLiTag(comment))}</ul>
    </div>
  );
};

export default CommentList;
