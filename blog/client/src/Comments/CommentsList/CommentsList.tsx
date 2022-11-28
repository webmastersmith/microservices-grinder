// import { useState } from 'react';
import { useEffect, useState } from 'react';
import styles from './CommentsList.module.scss';

type PostId = {
  postId: string;
};
type CommentType = {
  id: string;
  comment: string;
};
export const CommentsList = ({ postId }: PostId) => {
  const [allComments, setComments] = useState<CommentType[] | []>([]);

  const fetchComments = async (postId: string) => {
    const res = await fetch(`http://localhost:4001/posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res.status);
    setComments(await res.json());
  };
  useEffect(() => {
    fetchComments(postId);
  }, []);

  return (
    <ul className={styles.commentsList}>
      {allComments.map(({ id, comment }) => {
        return <li key={id}>{comment}</li>;
      })}
    </ul>
  );
};
