const WebSocket = require("websocket").server;
const http = require("http");

// Create a new HTTP server
const server = http.createServer((request, response) => {
    console.log("Received request for " + request.url);
    response.writeHead(404);
    response.end();
});

// Create a new WebSocket server
const wsServer = new WebSocket({
    httpServer: server,
    autoAcceptConnections: true
});

// When a WebSocket connection is established, log a message to the console
wsServer.on("connect", (connection) => {
    console.log("WebSocket connection established");

    // When a message is received from a WebSocket connection, broadcast the message to all connections
    connection.on("message", (message) => {
        wsServer.broadcastUTF(message.utf8Data);
    });

    // When a WebSocket connection is closed, log a message to the console
    connection.on("close", (reasonCode, description) => {
        console.log("WebSocket connection closed");
    });
});

// Start the HTTP server on the specified port
server.listen(8000, () => {
    console.log("Server listening on port 8000");
});
