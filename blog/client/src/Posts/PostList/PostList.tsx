import { useState, useEffect } from 'react';
import { CommentCreate, CommentsList } from 'Comments';
import styles from './PostList.module.scss';

type Title = {
  id: string;
  title: string;
};

export const PostList = () => {
  const [posts, setPosts] = useState<Title[] | []>([]);
  const fetchPosts = async () => {
    const res = await fetch('http://localhost:4000/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res.status);
    const data: Title[] = Object.values(await res.json());
    console.log(data);

    setPosts(data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.postList}>
      <h1>PostList</h1>
      <ul>
        {posts.map((post, i) => {
          return (
            <div
              key={post.id}
              className={styles.postCard}
              data-post-id={post.id}
            >
              <div className={styles.postCard__body}>
                <h2>{post.title}</h2>
                <CommentsList postId={post.id} />
                <CommentCreate postId={post.id} />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
