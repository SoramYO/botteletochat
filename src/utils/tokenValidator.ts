export const validateToken = (token: string): boolean => {
  // Token format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
  const tokenPattern = /^\d+:[A-Za-z0-9_-]{35}$/;
  return tokenPattern.test(token);
};