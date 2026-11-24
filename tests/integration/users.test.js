const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db');
beforeEach(async () => {
  await db.query('DROP TABLE IF EXISTS users');
  await db.query('CREATE TABLE users (id SERIAL PRIMARY KEY, nom TEXT NOT NULL)');
  await db.query("INSERT INTO users (nom) VALUES ('Alice')");
});
afterAll(() => db.end());
describe('GET /users/:id', () => {
  test('ne divulgue pas la technologie du serveur', async () => {
    const res = await request(app).get('/users/1');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
  test('retourne Alice', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body.nom).toBe('Alice');
  });
  test('retourne 404 si absent', async () => {
    expect((await request(app).get('/users/999')).status).toBe(404);
  });
  test('refuse un identifiant invalide', async () => {
    expect((await request(app).get('/users/abc')).status).toBe(400);
  });
  test('refuse une injection SQL et conserve la table', async () => {
    const response = await request(app).get('/users/' + encodeURIComponent('1; DROP TABLE users;--'));
    expect(response.status).toBe(400);
    const { rows } = await db.query('SELECT count(*) FROM users');
    expect(Number(rows[0].count)).toBe(1);
  });
});
