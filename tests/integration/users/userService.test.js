"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.error('\n❌ Error: DATABASE_URL environment variable is not set.');
    console.error('Please make sure you have a .env file with DATABASE_URL configured.');
    console.error('You can copy .env.example to .env and update it with your database connection string.\n');
    process.exit(1);
}
(async () => {
    // Dynamic imports after env is loaded
    const { getUserById, getAllUsers, createUser, updateUser, deleteUser } = await Promise.resolve().then(() => __importStar(require('../../../features/users/userService')));
    const { prisma } = await Promise.resolve().then(() => __importStar(require('../../../infrastructure/prisma/client')));
    console.log(`\n🚀 Starting UserService integration test...\n`);
    let testUserId = null;
    const testEmail = `test-${Date.now()}@example.com`;
    try {
        // Get initial user count before creating test user
        const initialUsers = await getAllUsers();
        const initialUserCount = initialUsers.length;
        // --- TEST CREATE USER ---
        console.log(`📝 Testing createUser...`);
        const newUser = await createUser({
            name: 'Test User',
            email: testEmail,
            password: 'testPassword123',
        });
        testUserId = newUser.id;
        console.log(`✅ User created: ${newUser.id} - ${newUser.name} (${newUser.email})`);
        console.log(`   - isOnline: ${newUser.isOnline}`);
        console.log(`   - createdAt: ${newUser.createdAt}`);
        // Verify user was created in database
        const dbUser = await prisma.user.findUnique({ where: { id: testUserId } });
        if (!dbUser) {
            throw new Error('User not found in database after creation');
        }
        console.log(`✅ Verified user exists in database`);
        // --- TEST GET USER BY ID ---
        console.log(`\n🔍 Testing getUserById...`);
        const retrievedUser = await getUserById(testUserId);
        if (retrievedUser.id !== testUserId || retrievedUser.email !== testEmail) {
            throw new Error('Retrieved user does not match created user');
        }
        console.log(`✅ User retrieved successfully: ${retrievedUser.name}`);
        // --- TEST GET ALL USERS ---
        console.log(`\n📋 Testing getAllUsers...`);
        const allUsers = await getAllUsers();
        const expectedUserCount = initialUserCount + 1;
        if (allUsers.length !== expectedUserCount) {
            throw new Error(`Expected ${expectedUserCount} user(s), but found ${allUsers.length} users`);
        }
        const foundUser = allUsers.find(u => u.id === testUserId);
        if (!foundUser) {
            throw new Error('Created user not found in getAllUsers result');
        }
        console.log(`✅ getAllUsers returned ${allUsers.length} user(s) (increased from ${initialUserCount})`);
        console.log(`✅ Created user found in list`);
        // --- TEST UPDATE USER ---
        console.log(`\n✏️  Testing updateUser...`);
        const updatedUser = await updateUser(testUserId, {
            name: 'Updated Test User',
        });
        if (updatedUser.name !== 'Updated Test User') {
            throw new Error('User name was not updated correctly');
        }
        console.log(`✅ User updated: ${updatedUser.name}`);
        // Verify profileUpdatedAt was set
        if (!updatedUser.profileUpdatedAt) {
            throw new Error('profileUpdatedAt was not set after update');
        }
        console.log(`✅ profileUpdatedAt set: ${updatedUser.profileUpdatedAt}`);
        // Test password update
        await updateUser(testUserId, {
            password: 'newPassword456',
        });
        console.log(`✅ Password updated successfully`);
        // --- TEST DELETE USER ---
        console.log(`\n🗑️  Testing deleteUser...`);
        await deleteUser(testUserId);
        console.log(`✅ User deleted`);
        // Verify user was deleted from database
        const deletedUser = await prisma.user.findUnique({ where: { id: testUserId } });
        if (deletedUser) {
            throw new Error('User still exists in database after deletion');
        }
        console.log(`✅ Verified user removed from database`);
        // --- TEST ERROR HANDLING ---
        console.log(`\n⚠️  Testing error handling...`);
        try {
            await getUserById('non-existent-id');
            throw new Error('Should have thrown error for non-existent user');
        }
        catch (error) {
            if (error.message === 'User not found') {
                console.log(`✅ Error handling works: ${error.message}`);
            }
            else {
                throw error;
            }
        }
        console.log(`\n✅ All tests passed! 🎉\n`);
        process.exit(0);
    }
    catch (error) {
        console.error(`\n❌ Test failed: ${error.message}`);
        console.error(error);
        // Cleanup on error
        if (testUserId) {
            try {
                await prisma.user.delete({ where: { id: testUserId } }).catch(() => { });
                console.log(`🧹 Cleaned up test user`);
            }
            catch {
                // Ignore cleanup errors
            }
        }
        process.exit(1);
    }
})();
//# sourceMappingURL=userService.test.js.map