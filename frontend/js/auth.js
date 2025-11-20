// API URL
const API_URL = 'http://localhost:3001/api';

// auth functions
const auth = {
  // login
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'ไม่สามารถเชื่อมต่อ server ได้'
      };
    }
  },

  // register
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'ไม่สามารถเชื่อมต่อ server ได้'
      };
    }
  },

  // logout
  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // check if logged in
  isLoggedIn() {
    return !!localStorage.getItem('user');
  }
};
