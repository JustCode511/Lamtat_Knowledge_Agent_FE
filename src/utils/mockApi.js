export const mockLoginApi = async (email, password) => {
  await new Promise(r => setTimeout(r, 600));
  if (email === 'test@demo.com' && password === '123456') {
    const token = `lamtat-${Date.now()}`;
    return { token, user: { email, name: 'Demo User' } };
  }
  throw new Error('Invalid credentials');
};

export const mockGPTResponse = async (message) => {
  await new Promise(r => setTimeout(r, 900));
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) return 'Hello! How can I help you today?';
  if (lower.includes('help')) return 'Sure — tell me more about what you need help with.';
  if (lower.includes('summary')) return 'Here is a short summary: ' + message.slice(0, 80) + '...';
  return `GPT (mock): I received your message: "${message}"`;
};
