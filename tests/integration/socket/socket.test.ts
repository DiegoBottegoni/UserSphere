import { io as Client, Socket } from 'socket.io-client';
import { server } from '@/server';
import { createUser } from '@/features/users/userService';

describe('Socket Integration Tests', () => {
  let aliceId: string;
  let bobId: string;
  let aliceSocket: Socket;
  let bobSocket: Socket;
  const PORT = process.env.PORT || 3000;
  const SERVER_URL = `http://localhost:${PORT}`;

  afterAll(async () => {
    // Cleanup sockets
    if (aliceSocket) aliceSocket.close();
    if (bobSocket) bobSocket.close();
    
    // Close server
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test('should exchange messages between Alice and Bob', async () => {
    // 1. Create Users (Must be done inside test because beforeEach wipes DB)
    const alice = await createUser({
      name: 'Alice Socket',
      email: `alice-${Date.now()}@test.com`,
      password: 'password123',
    });
    aliceId = alice.id;

    const bob = await createUser({
      name: 'Bob Socket',
      email: `bob-${Date.now()}@test.com`,
      password: 'password123',
    });
    bobId = bob.id;

    // 2. Connect Sockets
    aliceSocket = Client(SERVER_URL);
    bobSocket = Client(SERVER_URL);

    // Wait for connection
    await new Promise<void>((resolve) => {
      let connectedCount = 0;
      const onConnect = () => {
        connectedCount++;
        if (connectedCount === 2) resolve();
      };
      aliceSocket.on('connect', onConnect);
      bobSocket.on('connect', onConnect);
    });

    // 3. Register Users
    aliceSocket.emit('register', aliceId);
    bobSocket.emit('register', bobId);
    
    // Give a moment for registration mapping
    await new Promise((r) => setTimeout(r, 200));

    // 4. Send Message Alice -> Bob
    const messageContent = 'Hello Bob from test!';
    const messageData = {
      senderId: aliceId,
      receiverId: bobId,
      content: messageContent,
    };

    // Setup listener on Bob BEFORE sending
    const receivePromise = new Promise<any>((resolve) => {
      bobSocket.on('message:new', (msg) => {
        resolve(msg);
      });
    });

    aliceSocket.emit('message:send', messageData);

    const receivedMsg = await receivePromise;

    expect(receivedMsg).toBeDefined();
    expect(receivedMsg.content).toBe(messageContent);
    expect(receivedMsg.senderId).toBe(aliceId);

    // 5. Send Read Receipt Bob -> Alice
    const readPromise = new Promise<any>((resolve) => {
      aliceSocket.on('message:read', (msg) => {
        resolve(msg);
      });
    });

    bobSocket.emit('message:read', receivedMsg.id);

    const readMsg = await readPromise;
    expect(readMsg.id).toBe(receivedMsg.id);
  }, 10000);
});
