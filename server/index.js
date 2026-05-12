const crypto = require("crypto");
const { WebSocketServer } = require("ws");

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

function sendJson(socket, payload) {
	if (socket.readyState === socket.OPEN) {
		socket.send(JSON.stringify(payload));
	}
}

function broadcast(payload) {
	server.clients.forEach((client) => {
		sendJson(client, payload);
	});
}

server.on("connection", (socket) => {
	console.log("Client connected");

	socket.on("message", (rawMessage) => {
		try {
			const message = JSON.parse(rawMessage.toString());

			if (message.type !== "chat" || typeof message.text !== "string") {
				return;
			}

			broadcast({
				type: "chat",
				id: crypto.randomUUID(),
				text: message.text,
				clientId: message.clientId,
				createdAt: new Date().toISOString(),
			});
		} catch (error) {
			sendJson(socket, {
				type: "error",
				text: "Message was not valid JSON.",
				createdAt: new Date().toISOString(),
			});
		}
	});

	socket.on("close", () => {
		console.log("Client disconnected");
	});
});

console.log(`Websocket server running on ws://localhost:${PORT}`);
