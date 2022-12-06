import { useState } from 'react';
import styles from './PostCreate.module.scss';

export function PostCreate() {
  const [title, setTitle] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ): Promise<void> => {
    event.preventDefault();
    // localhost:4000
    const res = await fetch('http://posts.com/posts', {
      method: 'POST',
      // body: JSON.stringify(data),
      body: JSON.stringify({ title: title }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setTitle('');
    console.log(res.status);
    const result = await res.json();
    console.log(result);

    if (event.target instanceof HTMLFormElement) event.target.reset(); //reset form.
  };

  return (
    <form onSubmit={handleSubmit} className={styles.postForm}>
      <div className={styles.postForm__titleDiv}>
        <label htmlFor="title" className={styles.postForm__titleLabel}>
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className={styles.postForm__titleInput}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <button type="submit" className={styles.postForm__submitBtn}>
        Submit
      </button>
    </form>
  );
}
