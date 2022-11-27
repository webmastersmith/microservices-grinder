import { useState } from 'react';
import styles from './CommentCreate.module.scss';

type PostId = {
  postId: string;
};
export const CommentCreate = ({ postId }: PostId) => {
  const [comment, setComment] = useState('');

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const res = fetch(`http://localhost:5000/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ id: 'temp', comment }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (e.target instanceof HTMLFormElement) e.target.reset();
    setComment('');
  };

  return (
    <div>
      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <div className={styles.commentForm__content}>
          <label htmlFor="comment" className={styles.commentForm__commentLabel}>
            Comment
          </label>
          <input
            type="text"
            name="comment"
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentForm__commentInput}
          />
        </div>
        <button type="submit" className={styles.commentForm__btn}>
          Submit
        </button>
      </form>
    </div>
  );
};
