// import { useState } from 'react'
import styles from './App.module.scss';
import { PostCreate, PostList } from 'Posts';

function App() {
  return (
    <div id={styles.root}>
      <h1>Create Post</h1>
      <PostCreate />
      <PostList />
    </div>
  );
}

export default App;
