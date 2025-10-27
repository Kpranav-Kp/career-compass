const API_URL = 'http://localhost:8000/api/v1';

// Auth services
export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            // Store the token in localStorage
            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);
        }
        return data;
    },

    register: async (username, email, password) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        return await response.json();
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        return await response.json();
    },

    resetPassword: async (id, token, password) => {
        const response = await fetch(`${API_URL}/resetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, token, password })
        });
        return await response.json();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
    }
};

// Skills services
export const skillsService = {
    extractSkills: async (file, role) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', role);

        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        });
        return await response.json();
    },

    getSkillRoadmap: async (skills) => {
        const response = await fetch(`${API_URL}/skill-roadmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ skills })
        });
        return await response.json();
    },

    getMarketAnalysis: async (skills) => {
        const response = await fetch(`${API_URL}/skill-market-analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ skills })
        });
        return await response.json();
    }
};