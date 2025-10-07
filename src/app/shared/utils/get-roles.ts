export const getRoles = () => {
  return localStorage.getItem('roles')
    ? JSON.parse(localStorage.getItem('roles') ?? '{}')
    : null;
};
