import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No need to add Authorization header - backend uses cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (data) =>
    api.post('/user/login', {
      email: data.email,
      password: data.password,
    }),
  register: (data) => api.post('/user/register', data),
  logout: () => api.post('/user/logout', {}),
  getCurrentUser: () => api.get('/user'), // Get current user info
};

// User management services
export const userService = {
  listUsers: () => api.get('/user/all'),
  // Removed getUser as it doesn't exist in backend
  changeRole: (data) => api.post('/user/change-role', data),
  changeAccountState: (data) => api.post('/user/change-account-state', data),
  removeUser: (data) => api.post('/user/remove', data),
  changeAttributes: (data) => api.post('/user/change-attributes', data),
  changePassword: (data) => api.post('/user/change-password', data),
  // Account state management operations
  activateAccount: (data) => api.post('/user/activate', data),
  deactivateAccount: (data) => api.post('/user/deactivate', data),
  suspendAccount: (data) => api.post('/user/suspend', data),
  requestAccountRemoval: (data) => api.post('/user/request-removal', data),
  getAccountsForRemoval: () => api.post('/user/accounts-for-removal'),
  getAccountStatus: (data) => api.post('/user/account-status', data),
  changeProfile: (data) => api.post('/user/change-profile', data), // Added missing endpoint
};

// Worksheet services
export const worksheetService = {
  create: (data) => api.post('/work-sheet/import', data),
  delete: (id) => api.delete(`/work-sheet/${id}`),
  getAll: () => api.get('/work-sheet/'),
  get: (id) => api.get(`/work-sheet/${id}`),
};

// Execution Sheet services
export const executionSheetService = {
  create: (data) => api.post('/execution-sheet/', data),
  assignOperation: (data) => api.post('/execution-sheet/assign-operation', data),
  startActivity: (data) => api.post('/execution-sheet/start-activity', data),
  stopActivity: (data) => api.post('/execution-sheet/stop-activity', data),
  viewActivity: (data) => api.post('/execution-sheet/view-activity', data),
  viewStatusGlobal: (data) => api.post('/execution-sheet/view-status-global', data),
  editOperation: (data) => api.post('/execution-sheet/edit-operation', data),
  export: (data) => api.post('/execution-sheet/export', data),
  getById: (id) => api.get(`/execution-sheet/${id}`),
};

// Utils services
export const utilsService = {
  hello: () => api.get('/utils/hello'),
  time: () => api.get('/utils/time'),
};

export default api;
