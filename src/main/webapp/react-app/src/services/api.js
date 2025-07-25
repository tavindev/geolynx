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
  getUserById: (userId) => api.get(`/user/${userId}`),
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
  assignCorporation: (data) => api.post('/user/assign-corporations', data),
};

// Worksheet services
export const worksheetService = {
  create: (data) => api.post('/work-sheet/import', data),
  delete: (id) => api.delete(`/work-sheet/${id}`),
  getAll: () => api.get('/work-sheet/'),
  get: (id) => api.get(`/work-sheet/${id}`),
  getPolygons: () => api.get('/work-sheet/polygons'),
};

// Execution Sheet services
export const executionSheetService = {
  create: (data) => api.post('/execution-sheet/', data),
  assignOperation: (data) =>
    api.post('/execution-sheet/assign-operation', data),
  startActivity: (data) => api.post('/execution-sheet/start-activity', data),
  stopActivity: (data) => api.post('/execution-sheet/stop-activity', data),
  viewActivity: (data) => api.post('/execution-sheet/view-activity', data),
  viewStatusGlobal: (data) =>
    api.post('/execution-sheet/view-status-global', data),
  editOperation: (data) => api.post('/execution-sheet/edit-operation', data),
  export: (data) => api.post('/execution-sheet/export', data),
  getById: (id) => api.get(`/execution-sheet/${id}`),
  getMyAssignments: () => api.get('/execution-sheet/my-assignments'),
  getByWorksheetId: (worksheetId) =>
    api.get(`/execution-sheet/by-worksheet/${worksheetId}`),
};

// Region services
export const regionService = {
  getRegionData: (lat, lng) => api.get(`/region/?lat=${lat}&lng=${lng}`),
};

// Corporation services
export const corporationService = {
  getAll: () => api.get('/corporation/all'),
  getById: (id) => api.get(`/corporation/${id}`),
};

// Animal services
export const animalService = {
  create: (data) => api.post('/animal/', data),
  getNearby: (geohash) => api.get(`/animal/nearby?geohash=${geohash}`),
};

// Historical Curiosities services
export const historicalCuriosityService = {
  create: (data) => api.post('/historical-curiosities/', data),
  getNearby: (geohash) =>
    api.get(`/historical-curiosities/nearby?geohash=${geohash}`),
};

// Utils services
export const utilsService = {
  hello: () => api.get('/utils/hello'),
  time: () => api.get('/utils/time'),
};

// Dashboard services
export const dashboardService = {
  getStatistics: () => api.get('/execution-sheet/dashboard/statistics'),
  getOperatorStatistics: () =>
    api.get('/execution-sheet/dashboard/operator-statistics'),
};

export default api;
