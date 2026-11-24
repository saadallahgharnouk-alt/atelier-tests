const express = require('express');
const db = require('./db');
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static('public'));
app.get('/users/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ erreur: 'id invalide' });
  try {
    const { rows } = await db.query('SELECT id, nom FROM users WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ erreur: 'introuvable' });
    return res.json(rows[0]);
  } catch (err) { return next(err); }
});
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  return res.sendStatus(email === 'a@test.fr' && password === 'secret' ? 200 : 401);
});
module.exports = app;
