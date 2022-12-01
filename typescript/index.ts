// import axios from 'axios';

interface TodoType {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

(async function () {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const todo: TodoType = await res.json();
    console.log(todo);
    const { completed, id, title, userId } = todo;
  } catch (e) {
    if (e instanceof Error) {
      console.log('err', e);
    } else {
      console.log(String(e));
    }
  }
})();
