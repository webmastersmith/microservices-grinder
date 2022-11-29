import styles from './CommentsList.module.scss';
import { CommentType } from 'types/comment';

export const CommentsList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <ul className={styles.commentsList}>
      {comments.map(({ comment, id }) => (
        <li key={id}>{comment}</li>
      ))}
    </ul>
  );
};
