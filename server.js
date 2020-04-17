
const conga = require('./common.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 3000
app.use(bodyParser.json());

const players = {};
const genPlayerId = () => Math.floor(Math.random() * Math.pow(2, 32));

const maxScore = () => Object.values(players).reduce((acc, p) => acc + p.score, 0);

app.post('/join', (req, res) => {
  const { name } = req.body;
  if (typeof name !== 'string') {
    res.send({ error: 'Needs a name '})
  }
  else if (Object.values(players).some(p => p.name === name)) {
    res.send({ error: 'A player with that name already exists.' })
  } else {
    const id = genPlayerId();
    const score = maxScore();
    players[id] = {
      id,
      score,
      name
    };
    res.send({ id, score });
  }
})

app.post('/start', (req, res) => {
  if(players.keys().count < 2) {
    res.send({ error: 'Not enough players' })
  } else {
    
  }
})

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
