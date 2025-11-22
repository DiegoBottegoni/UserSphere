import { io as Client } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

// 🧩 Replace these IDs with real existing ones from your database
const aliceId = '120e5c82-40f4-40bc-a493-48af921d5896'; // <- must exist in DB
const bobId = '3b29f210-732b-4730-9b14-1a19a42d9047';   // <- must exist in DB

const aliceSocket = Client(SERVER_URL);
const bobSocket = Client(SERVER_URL);

(async () => {
  console.log(`\n🚀 Starting socket integration test...\n`);

  // --- CONNECT USERS ---
  await new Promise<void>((resolve) => {
    let connected = 0;

    const handleConnect = (name: string, socket: any) => {
      console.log(`✅ ${name} connected with id ${socket.id}`);
      connected++;
      if (connected === 2) resolve();
    };

    aliceSocket.on('connect', () => handleConnect('Alice', aliceSocket));
    bobSocket.on('connect', () => handleConnect('Bob', bobSocket));
  });

  // --- REGISTER USERS ---
  aliceSocket.emit('register', aliceId);
  bobSocket.emit('register', bobId);
  await new Promise((r) => setTimeout(r, 500));

  // --- SEND MESSAGE ---
  console.log(`✉️ Enviando mensaje de Alice a Bob...`);
  aliceSocket.emit('message:send', {
    senderId: aliceId,
    receiverId: bobId,
    content: 'Hola Bob! Esto es una prueba en tiempo real ⚡',
  });

  // Listen for incoming message on Bob's side
  bobSocket.on('message:new', (message) => {
    console.log(`📥 Bob recibió mensaje: "${message.content}"`);
    // Immediately mark as read
    console.log(`👁️ Bob marca el mensaje como leído...`);
    bobSocket.emit('message:read', message.id);
  });

  // --- LISTEN FOR READ CONFIRMATION ---
  aliceSocket.on('message:read', (message) => {
    console.log(`✅ Alice fue notificado que Bob leyó el mensaje (id: ${message.id})`);
  });

  // --- WAIT AND DISCONNECT ---
  await new Promise((r) => setTimeout(r, 3000));

  console.log(`🔌 Cerrando conexiones...`);
  aliceSocket.disconnect();
  bobSocket.disconnect();

  console.log(`❌ Alice desconectado`);
  console.log(`❌ Bob desconectado\n`);

  process.exit(0);
})();

