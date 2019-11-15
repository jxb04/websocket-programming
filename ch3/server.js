var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({ port: 8181 });
var uuid = require('node-uuid');

var clients = [];

var nickname = client_uuid.substr(0,8);
clients.push({"id": client_uuid, "ws": ws, "nickname": nickname});

if (message.indexOf('/nick') == 0) {
    var nickname_array = message.split(' ')
    if (nickname_array.length >= 2) {
        var old_nickname = nickname;
        nickname = nickname_array[1];
        for (var i=0; i<clients.length; i++) {
            var clientSocket = clients[i].ws;
            var nickname_message = "Client " + old_nickname + " changed to " + nickname;
            clientSocket.send(JSON.stringify({
                "id": client_uuid,
                "nickname": nickname,
                "message": nickname_message
            }));
        }
    }
}

wss.on('connection', function (ws) {
    var client_uuid = uuid.v4();
    clients.push({ "id": client_uuid, "ws": ws });
    console.log('client [%s] connected', client_uuid);

    ws.on('message', function (message) {
        for (var i = 0; i < clients.length; i++) {
            var clientSocket = clients[i].ws;
            if (clientSocket.readyState === WebSocket.OPEN) {
                console.log('client [%s]: %s', clients[i].id, message);
                clientSocket.send(JSON.stringify({
                    "id": client_uuid,
                    "nickname": nickname,
                    "message": message
                }));
            }
        }
    });

    ws.on('close', function() {
        for(var i=0; i<clients.length; i++) {
            if (clients[i].id == client_uuid) {
                console.log('client [%s} disconnected', client_uuid);
                clients.splice(i, 1);
            }
        }
    });

    ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var messages = document.getElementById('messages');
        var message = document.createElement("li");
        message.innerHTML = data.message;
        messages.appendChild(message);
    }

})
