// import { useState } from 'react'
import styles from './App.module.scss'

function App() {
  interface Title {
    title: string
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
     //reset w/ types
     const dataObject: unknown = Object.fromEntries(formData)  //as HTMLFormElement not needed if 'unknown'
     const data = dataObject as Title  //{email: string, feedback: string}
    console.log('data', data);
    
    const res = await fetch('http://localhost:4000/posts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    console.log(res.status)
    const result = await res.json()
    console.log(result)
    
     if (event.target instanceof HTMLFormElement) event.target.reset() //reset form.
  }

  return (
    <div className={styles.App} id={styles.root}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit} className={styles.titleForm}>
        <div>
          <label htmlFor="title" className={styles.titleForm__titleLabel}>Title</label>
          <input type="text" name="title" id="title" className={styles.titleForm__titleInput} required />
        </div>
        <button type="submit" className={styles.titleForm__submitButton}>Submit</button>
      </form>
    </div>
  );
}

export default App
