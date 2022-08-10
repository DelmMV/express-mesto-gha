const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62f16a68a924af19f67a3e54',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Упс! Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
