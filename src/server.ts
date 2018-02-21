import { createServer } from 'bottender/express';
import { BotServer } from './Bot';

const server = createServer(BotServer);

server.listen(8080, () => {
    console.log('server is running on 8080 port...');
});