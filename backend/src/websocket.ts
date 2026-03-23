import WebSocket, { WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ port: 8080 });    // websocket server, frontend buraya baglanacak

export const clients = new Set<WebSocket>()        // bagli olan frontend'lerin listesi 

wss.on('connection', (ws) => {
    ws.on('error', console.error);
    clients.add(ws)

    ws.on('close', () => {
        clients.delete(ws)
    })
});