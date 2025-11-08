// import { io } from 'socket.io-client';
const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:3000'; // ajustá si usás otro puerto

// simulamos dos usuarios
const userA = { id: 'USER_ID_1', name: 'Alice' };
const userB = { id: 'USER_ID_2', name: 'Bob' };

// crear dos sockets (clientes)
const socketA = io(SERVER_URL, { transports: ['websocket'] });
const socketB = io(SERVER_URL, { transports: ['websocket'] });

// eventos globales para ver actividad
function setupListeners(socket, username) {
  socket.on('connect', () => console.log(`✅ ${username} conectado con id ${socket.id}`));
  socket.on('disconnect', () => console.log(`❌ ${username} desconectado`));

  socket.on('user:online', (id) => console.log(`🟢 User online: ${id}`));
  socket.on('user:offline', (id) => console.log(`🔴 User offline: ${id}`));

  socket.on('message:new', (msg) => console.log(`💬 ${username} recibió:`, msg));
  socket.on('message:sent', (msg) => console.log(`📤 ${username} envió:`, msg));
  socket.on('message:read', (data) => console.log(`👁️ Mensaje leído:`, data));
  socket.on('message:deleted', (data) => console.log(`🗑️ Mensaje eliminado:`, data));
}

// inicializamos listeners
setupListeners(socketA, userA.name);
setupListeners(socketB, userB.name);

// registrar usuarios al conectarse
socketA.on('connect', () => {
  socketA.emit('register', userA.id);
});

socketB.on('connect', () => {
  socketB.emit('register', userB.id);
});

// enviar un mensaje de A → B después de 3 segundos
setTimeout(() => {
  console.log('✉️ Enviando mensaje de Alice a Bob...');
  socketA.emit('message:send', {
    senderId: userA.id,
    receiverId: userB.id,
    content: 'Hola Bob! Esto es una prueba en tiempo real 🚀',
  });
}, 3000);

// marcar mensaje como leído después de 6 segundos (simulación)
setTimeout(() => {
  console.log('👁️ Bob marca el mensaje como leído...');
  // suponiendo que el último mensaje tiene ID 1
  socketB.emit('message:read', '1');
}, 6000);

// cerrar conexión después de 10 segundos
setTimeout(() => {
  console.log('🔌 Cerrando conexiones...');
  socketA.disconnect();
  socketB.disconnect();
}, 10000);
