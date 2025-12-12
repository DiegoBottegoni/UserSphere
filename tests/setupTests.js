"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/setupTests.ts
const testDb_1 = require("./helpers/testDb");
// Antes de cada test → BD limpia
beforeEach(async () => {
    await (0, testDb_1.resetTestDB)();
});
// Después de todos los tests → cerrar conexión
afterAll(async () => {
    await (0, testDb_1.disconnectDB)();
});
//# sourceMappingURL=setupTests.js.map