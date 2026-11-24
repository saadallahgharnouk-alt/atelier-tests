const port = process.env.E2E_PORT || '3301';
const baseURL = `http://127.0.0.1:${port}`;

module.exports = {
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL },
  webServer: {
    command: 'node src/server.js',
    env: { PORT: port },
    url: `${baseURL}/login.html`,
    reuseExistingServer: false,
  },
};
