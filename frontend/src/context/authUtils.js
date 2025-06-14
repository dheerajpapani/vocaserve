export const loginLogic = () => {
  localStorage.setItem('isAdmin', 'true');
};

export const logoutLogic = () => {
  localStorage.removeItem('isAdmin');
};

export const isLoggedIn = () => {
  return localStorage.getItem('isAdmin') === 'true';
};
