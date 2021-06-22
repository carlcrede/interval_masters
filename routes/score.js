const router = require('express').Router();
const { query } = require('../db.js');

const getHighscores = async () => {
    const rows = await query(`SELECT * FROM scores ORDER BY score DESC LIMIT 10`);
    return rows;
}

const submitScore = async (data) => {
    const { name, score, goal, correctNotes, avoidedNotes } = data;
    const params = [name, score, goal, correctNotes, avoidedNotes, new Date];
    const sql = `INSERT INTO scores (player,score,goal,collected,avoided,date) VALUES(?,?,?,?,?,?)`;
    const rows = await query(sql, params);
    return rows;
}

router.get('/scores', async (req, res, next) => {
    try {
        const data = await getHighscores();
        res.json(data);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
});

router.post('/scores', async (req, res, next) => {
    try {
        const data = await submitScore(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
});

module.exports = {
    router
} 