const port = Number(process.env.PORT || 3000);
require('./app').listen(port, () => console.log(`Serveur prêt sur http://localhost:${port}`));
