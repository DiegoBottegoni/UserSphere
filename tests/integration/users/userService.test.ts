import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from '@/features/users/userService';

describe('UserService Integration Tests', () => {

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = `create-${Date.now()}@example.com`;
      const newUser = await createUser({
        name: 'Test User',
        email,
        password: 'testPassword123',
      });

      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe('Test User');
      expect(newUser.email).toBe(email);
    });
  });

  describe('getUserById', () => {
    it('should retrieve an existing user', async () => {
      const email = `get-${Date.now()}@example.com`;
      // Setup
      const created = await createUser({
        name: 'Get User',
        email,
        password: 'password',
      });

      // Test
      const retrieved = await getUserById(created.id);
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.email).toBe(email);
    });

    it('should throw error for non-existent user', async () => {
      await expect(getUserById('non-existent-id')).rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve created users', async () => {
      await createUser({ name: 'User 1', email: `u1-${Date.now()}@a.com`, password: 'p' });
      await createUser({ name: 'User 2', email: `u2-${Date.now()}@a.com`, password: 'p' });

      const allUsers = await getAllUsers();
      expect(allUsers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateUser', () => {
    it('should update user fields', async () => {
      // Setup
      const created = await createUser({
        name: 'Update User',
        email: `update-${Date.now()}@example.com`,
        password: 'password',
      });

      // Test
      const updated = await updateUser(created.id, {
        name: 'Updated Name',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.profileUpdatedAt).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      // Setup
      const created = await createUser({
        name: 'Delete User',
        email: `delete-${Date.now()}@example.com`,
        password: 'password',
      });

      // Test
      await deleteUser(created.id);

      // Verify
      await expect(getUserById(created.id)).rejects.toThrow('User not found');
    });
  });
});
