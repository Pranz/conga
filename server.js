
const conga = require('./common.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 3000
app.use(bodyParser.json());

const players = {};
const genPlayerId = () => Math.floor(Math.random() * Math.pow(2, 32));

const maxScore = () => players.reduce((acc, p) => acc + p.score, 0);

app.post('/join', (req, res) => {
    const { name } = req.body;
    if (typeof name !== 'string') {
        res.send({ error: 'Needs a name '})
    }
    else if(players.some(p => p.name === name)) {
        res.send({ error: 'A player with that name already exists.' })
    } else {
        const id = genPlayerId();
        const score = maxScore();
        players[name] = {
            id,
            score
        };
        res.send({ id, score });
    }
})

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));