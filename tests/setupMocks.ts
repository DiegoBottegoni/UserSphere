// Silence console.error during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
