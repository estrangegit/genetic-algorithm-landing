import http from 'http';
import app from './app';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const normalizePort = (val: any): any => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */

const port = normalizePort(process.env.SERVER_PORT || '8080');

app.set('port', port);

const server = http.createServer(app);

const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


server.on('error', errorHandler);

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

module.exports = server;
