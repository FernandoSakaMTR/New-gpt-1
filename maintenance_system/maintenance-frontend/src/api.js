// A simple API wrapper to handle auth tokens

const api = async (url, options = {}) => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authTokens?.access) {
        headers['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const response = await fetch(`http://localhost:8000${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Try to parse error from backend, otherwise throw a generic error
        try {
            const errData = await response.json();
            throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
        } catch (e) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    // If response is OK but has no content
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export default api;
