import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cors from 'cors';
import { OpenVidu } from 'openvidu-node-client';

import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();


require('dotenv').config(!!process.env['CONFIG'] ? {path: process.env['CONFIG']} : {});

const app = express();

// Enable CORS support
app.use(cors({
  origin: '*',
}));

const server = http.createServer(app);

// Allow application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Allow application/json
app.use(bodyParser.json());

// Serve static resources if available
app.use(express.static(__dirname + '/public'));

// Serve application
server.listen(5000, () => {
  console.log('Application started');
});

console.warn('Application server connecting to OpenVidu at ' + process.env['OPENVIDU_URL']);

const openvidu = new OpenVidu(
  process.env['OPENVIDU_URL']!,
  process.env['OPENVIDU_SECRET']!,
);

app.post('/api/sessions', async (req, res) => {
  const session = await openvidu.createSession(req.body);
  res.send(session.sessionId);
});

app.post('/api/sessions/:sessionId/connections', async (req, res) => {
  const session = openvidu.activeSessions.find(
    (s) => s.sessionId === req.params.sessionId
  );
  if (!session) {
    res.status(404).send();
  } else {
    const connection = await session.createConnection(req.body);
    res.send(connection.token);
  }
});

process.on('uncaughtException', err => console.error(err));


