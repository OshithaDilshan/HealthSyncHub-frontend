// API base URL
const API_BASE_URL = 'http://localhost:5000/api/auth';

/**
 * Handles user registration
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {Promise<Object>} - Response data
 */
async function register(username,email, password, firstName, lastName) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username.trim(),
                email: email.trim(),
                password: password,
                firstName: firstName.trim(),
                lastName: lastName.trim()
            }),
            credentials: 'include' // Include cookies for session management
        });

        const data = await response.json();
        
        if (!response.ok) {
            // If the response has a message, use it, otherwise use a default message
            const errorMessage = data.message || 
                               (response.status === 400 ? 'Invalid request data' : 
                               'Registration failed. Please try again.');
            throw new Error(errorMessage);
        }

        // Registration successful, store user ID and token
        const userId = data._id;
        localStorage.setItem('userId', userId);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        // Enhance the error message for network issues
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Handles user login
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response data with user info and token
 */
async function login(username, password) {
    try {
        console.log('Attempting login with email:', username);
        console.log('Sending login request to:', `${API_BASE_URL}/login`);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: username.trim(),  // Using the username field as email
                password: password
            }),
            credentials: 'include' // Important for cookies/session
        });

        console.log('Response status:', response.status);
        let data;
        try {
            data = await response.json();
            console.log('Response data:', data);
        } catch (e) {
            console.error('Error parsing response JSON:', e);
            throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
            // Log the full response for debugging
            console.error('Login failed with status:', response.status, 'Response:', data);
            
            // Provide more specific error messages based on status code
            let errorMessage = data.message || 'Login failed';
            if (response.status === 401) {
                errorMessage = 'Invalid username or password';
                console.error('Authentication failed. Please check your credentials.');
            } else if (response.status === 400) {
                errorMessage = 'Please provide username and password';
            } else if (response.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
                console.error('Server error occurred during login');
            }
            throw new Error(errorMessage);
        }

        // Store the token with Bearer prefix in localStorage
        if (data.token) {
            localStorage.setItem('token', `Bearer ${data.token}`);
        }
        
        const userData = {
            id: data._id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role || 'user'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.error('Login error:', error);
        // Enhance the error message for network issues
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Logs out the current user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

/**
 * Gets the current authenticated user
 * @returns {Object|null} - User object if authenticated, null otherwise
 */
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * Checks if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

/**
 * Gets the authentication token
 * @returns {string|null} - Authentication token if exists, null otherwise
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

// Export functions
window.auth = {
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    getAuthToken
};
