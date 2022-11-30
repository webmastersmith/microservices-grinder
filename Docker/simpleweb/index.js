const express = require('express');

const app = new express();

app.get('/', (req, res, next) => {
  console.log('im a teapot!');
  res.send('Hello World!'); //process will die here if next() not called. -Generator.
});

app.listen(9000, () => {
  console.log('Running port 9000');
});
