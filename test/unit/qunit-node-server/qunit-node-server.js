const app = require('./server');

const port = 8600;
// Start HTTP server
app.listen(port, () => console.log('HTTP server listening on port ' + port + '!'));
