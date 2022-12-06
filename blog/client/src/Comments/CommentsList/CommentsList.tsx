import styles from './CommentsList.module.scss';
import { CommentType } from 'types/types';

export const CommentsList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <ul className={styles.commentsList}>
      {comments.map(({ comment, id, status }) => {
        switch (status) {
          case 'approved':
            break;
          case 'rejected':
            comment = 'This comment has been removed!';
            break;
          default:
            comment = 'Comment pending approval';
            break;
        }
        return <li key={id}>{comment}</li>;
      })}
    </ul>
  );
};
