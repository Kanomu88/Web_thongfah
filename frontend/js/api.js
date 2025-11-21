const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Helper function to convert Google Drive share URL to direct image URL
 * @param {string} url - Original Google Drive URL
 * @returns {string} - Direct image URL or original URL if not a Drive link
 */
function convertGoogleDriveUrl(url) {
    if (!url) return url;

    // Check if it's a Google Drive URL
    const drivePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(drivePattern);

    if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return url; // Return original URL if not a Drive link
}

// Helper function for GET requests
async function get(endpoint) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: headers
        });
        return await response.json();
    } catch (error) {
        console.error('GET Error:', error);
        return { success: false, message: error.message };
    }
}

// Helper function for POST requests
async function post(endpoint, data) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('POST Error:', error);
        return { success: false, message: error.message };
    }
}

// Helper function for PUT requests
async function put(endpoint, data) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('PUT Error:', error);
        return { success: false, message: error.message };
    }
}

// Helper function for DELETE requests
async function del(endpoint) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: headers
        });
        return await response.json();
    } catch (error) {
        console.error('DELETE Error:', error);
        return { success: false, message: error.message };
    }
}

// API wrapper object
const api = {
    get: get,
    post: post,
    put: put,
    delete: del
};

// Auth Service
const auth = {
    async login(username, password) {
        const result = await post('/auth/login', { username, password });
        if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.data));
        }
        return result;
    },

    async register(userData) {
        const result = await post('/auth/register', userData);
        if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.data));
        }
        return result;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../views/login.html';
    },

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    checkAuth() {
        const user = this.getUser();
        const token = this.getToken();
        if (!user || !token) {
            window.location.href = '../views/login.html';
            return null;
        }
        return user;
    },

    checkAdmin() {
        const user = this.checkAuth();
        if (user && !user.isAdmin) {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            window.location.href = '../views/index.html';
            return null;
        }
        return user;
    }
};

// Product Service
const productService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await get(`/products${queryString ? '?' + queryString : ''}`);
    },

    async getById(id) {
        return await get(`/products/${id}`);
    },

    async create(product) {
        return await post('/products', product);
    },

    async update(id, product) {
        return await put(`/products/${id}`, product);
    },

    async delete(id) {
        return await del(`/products/${id}`);
    }
};

// User Service (Admin)
const userService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await get(`/users${queryString ? '?' + queryString : ''}`);
    },

    async getById(id) {
        return await get(`/users/${id}`);
    },

    async create(user) {
        return await post('/users', user);
    },

    async update(id, user) {
        return await put(`/users/${id}`, user);
    },

    async delete(id) {
        return await del(`/users/${id}`);
    }
};

// Public Service Example (Random User Generator for avatars)
const publicService = {
    async getRandomUser() {
        try {
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            return data.results[0];
        } catch (error) {
            console.error('Public API Error:', error);
            return null;
        }
    }
};
