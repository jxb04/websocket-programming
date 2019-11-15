var uuid = require('node-uuid');

var WebSocketServer = require('ws').Server,
   wss = new WebSocketServer({port: 8181});

   var clients = [];

   wss.on('connection', function(ws) {
       var client_uuid = uuid.v4();
       clients.push(("id": client_uuid, "ws": ws));
       console.log('client [%s] connected', client_uuid);
       ws.on('message', function(message) {
           console.log(message);
       });
   });