// tests/setupTests.ts
import { resetTestDB, disconnectDB } from './helpers/testDb';

// Antes de cada test → BD limpia
beforeEach(async () => {
  await resetTestDB();
});

// Después de todos los tests → cerrar conexión
afterAll(async () => {
  await disconnectDB();
});
