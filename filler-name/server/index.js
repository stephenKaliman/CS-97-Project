const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { User, Exercise, Tag, ExerciseTag } = require('../database');

const app = express();
const port = 3000;
const JWT_SECRET = 'dtrgyuhijohuttfcghvjbkhvdt';

app.use(bodyParser.json());
const auth = (req, res, next) => {
  let data = req.headers.authorization.split(' ');
  req.jwt = data[1];
  return next();
};

/* initialize database */
User.createTable();
Exercise.createTable();
Tag.createTable();
ExerciseTag.createTable();

/* most of these endpoints are just for debugging */

app.get('/', (req, res) => {
  return res.send('hello, world!');
});

app.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.authenticate(email, password);
  if(!user) return res.status(401).json({
    error: 'invalid-credentials'
  });
  const token = jwt.sign(user, JWT_SECRET);
  return res.json({
    token: token
  });
});

app.get('/users/:userId/exercises', async (req, res) => {
  const { authorization } = req.headers;
  const { userId } = req.params;
  if(!authorization) return res.status(401);
  const userExercises = await (await User.find(Number(userId))).getExercises();
  return res.json(userExercises);
});

app.get('/users', async (req, res) => {
  const { authorization } = req.headers;
  if(req.jwt === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJwYXVsc2VyYTEiLCJwYXNzd29yZCI6IiNjaGlja2VuMTIiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjE0NDc2OTM3fQ.F8o2-G0O09mbn7pIv2ptd5sdUdPeMgfDyYVroxjE5eo')
    return res.send(await User.find(1));
  return res.send(await User.all());
});

app.post('/users', async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User(username, password, email);
  const resp = await user.save();
  return res.send(resp);
});

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  return res.send(await User.find(userId));
});

app.get('/exercises/:exerciseId', async (req, res) => {
  const { exerciseId } = req.params;
  return res.send(await Exercise.find(exerciseId));
});

app.get('/exercises', async (req, res) => {
  const { authorization } = req.headers;
  return res.send(await Exercise.all());
});

/* app.post('/exercises', auth, async (req, res) => {
  const { name, description } = req.body;
  let bearer = jwt.verify(req.jwt, JWT_SECRET);
  const exercise = await (new Exercise(name, description, bearer)).save();
  return res.json(exercise);
}); */

app.get('/tags', async (req, res) => {
  return res.send(await Tag.all());
});

app.get('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;
  return res.send(await Tag.find(tagId));
});

app.listen(port, () => console.log('ready'));