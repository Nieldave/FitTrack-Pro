// /// <reference types="vite/client" />
// import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// import { ApiError } from '../types';
// import {
//   INITIAL_EXERCISES,
//   INITIAL_WORKOUTS,
//   INITIAL_HISTORY,
//   INITIAL_TEMPLATES,
//   INITIAL_ACHIEVEMENTS,
//   INITIAL_SPOTIFY_TRACKS
// } from '../services/mockData';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// export const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // In-memory token references
// let getAccessToken: () => string | null = () => null;
// let getRefreshToken: () => string | null = () => null;
// let onLogout: () => void = () => {};
// let onRefreshSuccess: (tokens: { accessToken: string; refreshToken: string }) => void = () => {};

// export function configureAxiosAuth(config: {
//   getAccessToken: () => string | null;
//   getRefreshToken: () => string | null;
//   onLogout: () => void;
//   onRefreshSuccess: (tokens: { accessToken: string; refreshToken: string }) => void;
// }) {
//   getAccessToken = config.getAccessToken;
//   getRefreshToken = config.getRefreshToken;
//   onLogout = config.onLogout;
//   onRefreshSuccess = config.onRefreshSuccess;
// }

// // Request interceptor: attach bearer token
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = getAccessToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Lock to prevent multi-refresh race condition
// let isRefreshing = false;
// let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else if (token) {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // Local storage keys for mock persistence fallback
// const MOCK_EXERCISES_KEY = 'fittrack_mock_exercises_v1';
// const MOCK_WORKOUTS_KEY = 'fittrack_mock_workouts_v1';
// const MOCK_HISTORY_KEY = 'fittrack_mock_history_v1';
// const MOCK_USERS_KEY = 'fittrack_mock_users_v1';

// // Helper for local mock store
// function getMockStore<T>(key: string, initial: T): T {
//   try {
//     const saved = localStorage.getItem(key);
//     return saved ? JSON.parse(saved) : initial;
//   } catch {
//     return initial;
//   }
// }

// function setMockStore<T>(key: string, data: T): void {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch {
//     // ignore
//   }
// }

// // Response interceptor: handles 401 refresh + mock API fallback when Spring Boot server is not running
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     // 1. If 401 Unauthorized and not already retried
//     if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//       if (originalRequest.url?.includes('/api/auth/refresh')) {
//         onLogout();
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;
//       const refreshToken = getRefreshToken();

//       if (!refreshToken) {
//         isRefreshing = false;
//         onLogout();
//         return Promise.reject(error);
//       }

//       try {
//         const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
//         onRefreshSuccess({ accessToken: data.accessToken, refreshToken: data.refreshToken });
//         isRefreshing = false;
//         processQueue(null, data.accessToken);

//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         }
//         return api(originalRequest);
//       } catch (refreshErr) {
//         processQueue(refreshErr, null);
//         isRefreshing = false;
//         onLogout();
//         return Promise.reject(refreshErr);
//       }
//     }

//     // 2. MOCK FALLBACK: If Spring Boot backend is offline / network error / 404, fulfill with rich mock store
//     const isNetworkOrNotFound =
//       !error.response ||
//       error.code === 'ERR_NETWORK' ||
//       error.code === 'ECONNREFUSED' ||
//       error.response.status === 404 ||
//       error.response.status === 502 ||
//       error.response.status === 503;

//     if (isNetworkOrNotFound && originalRequest) {
//       const mockResult = handleMockRequest(originalRequest);
//       if (mockResult) {
//         return Promise.resolve(mockResult);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // Mock route handler for offline preview mode
// function handleMockRequest(config: InternalAxiosRequestConfig): { data: unknown; status: number; headers: Record<string, string>; config: InternalAxiosRequestConfig } | null {
//   const url = config.url || '';
//   const method = (config.method || 'get').toUpperCase();
//   let body: any = {};
//   if (config.data) {
//     try {
//       body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
//     } catch {
//       body = {};
//     }
//   }

//   // --- AUTH ---
//   if (url.includes('/auth/register') || url.includes('/auth/login')) {
//     const isRegister = url.includes('/register');
//     const email = body.email || 'user@fittrack.com';
//     const name = body.name || (email.split('@')[0] || 'User');
//     const isAdmin = email.toLowerCase().includes('admin');
    
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         accessToken: `mock-access-token-${Date.now()}`,
//         refreshToken: `mock-refresh-token-${Date.now()}`,
//         tokenType: 'Bearer',
//         userId: isAdmin ? 999 : 1,
//         name: isRegister ? (body.name || 'Fit Athlete') : name,
//         email: email,
//         role: isAdmin ? 'ADMIN' : 'USER'
//       }
//     };
//   }

//   if (url.includes('/auth/refresh')) {
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         accessToken: `mock-access-token-refreshed-${Date.now()}`,
//         refreshToken: `mock-refresh-token-refreshed-${Date.now()}`,
//         tokenType: 'Bearer',
//         userId: 1,
//         name: 'Fit Athlete',
//         email: 'user@fittrack.com',
//         role: 'USER'
//       }
//     };
//   }

//   // --- USERS / ME ---
//   if (url.includes('/users/me/password')) {
//     return { status: 200, headers: {}, config, data: { message: 'Password updated successfully' } };
//   }

//   if (url.includes('/users/me')) {
//     if (method === 'PUT') {
//       return {
//         status: 200,
//         headers: {},
//         config,
//         data: { id: 1, name: body.name || 'Fit Athlete', email: 'user@fittrack.com', role: 'USER' }
//       };
//     }
//     if (method === 'DELETE') {
//       return { status: 200, headers: {}, config, data: { message: 'User deleted' } };
//     }
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: { id: 1, name: 'Fit Athlete', email: 'user@fittrack.com', role: 'USER' }
//     };
//   }

//   if (url.includes('/users')) {
//     const mockUsers = getMockStore(MOCK_USERS_KEY, [
//       { id: 1, name: 'Alex Athlete', email: 'alex@fittrack.com', role: 'USER', enabled: true },
//       { id: 2, name: 'Sarah Miller', email: 'sarah@fittrack.com', role: 'USER', enabled: true },
//       { id: 3, name: 'David Admin', email: 'admin@fittrack.com', role: 'ADMIN', enabled: true },
//       { id: 4, name: 'Elena Rostova', email: 'elena@fittrack.com', role: 'USER', enabled: false }
//     ]);

//     if (url.includes('/disable')) {
//       const parts = url.split('/');
//       const idStr = parts[parts.length - 2];
//       const updated = mockUsers.map(u => u.id === Number(idStr) ? { ...u, enabled: false } : u);
//       setMockStore(MOCK_USERS_KEY, updated);
//       return { status: 200, headers: {}, config, data: { message: 'Disabled' } };
//     }

//     if (url.includes('/enable')) {
//       const parts = url.split('/');
//       const idStr = parts[parts.length - 2];
//       const updated = mockUsers.map(u => u.id === Number(idStr) ? { ...u, enabled: true } : u);
//       setMockStore(MOCK_USERS_KEY, updated);
//       return { status: 200, headers: {}, config, data: { message: 'Enabled' } };
//     }

//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: mockUsers,
//         pageNumber: 0,
//         pageSize: 20,
//         totalElements: mockUsers.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   // --- EXERCISES ---
//   if (url.includes('/exercises')) {
//     let exercises = getMockStore(MOCK_EXERCISES_KEY, INITIAL_EXERCISES);

//     if (method === 'POST') {
//       const newEx = { ...body, id: Date.now() };
//       exercises = [newEx, ...exercises];
//       setMockStore(MOCK_EXERCISES_KEY, exercises);
//       return { status: 200, headers: {}, config, data: newEx };
//     }

//     if (method === 'PUT') {
//       const parts = url.split('/');
//       const id = Number(parts[parts.length - 1]);
//       exercises = exercises.map(e => e.id === id ? { ...e, ...body } : e);
//       setMockStore(MOCK_EXERCISES_KEY, exercises);
//       return { status: 200, headers: {}, config, data: exercises.find(e => e.id === id) || body };
//     }

//     if (method === 'DELETE') {
//       const parts = url.split('/');
//       const id = Number(parts[parts.length - 1]);
//       exercises = exercises.filter(e => e.id !== id);
//       setMockStore(MOCK_EXERCISES_KEY, exercises);
//       return { status: 200, headers: {}, config, data: { message: 'Deleted' } };
//     }

//     // Single item GET
//     const matchSingle = url.match(/\/exercises\/(\d+)/);
//     if (matchSingle) {
//       const id = Number(matchSingle[1]);
//       const found = exercises.find(e => e.id === id);
//       if (found) {
//         return { status: 200, headers: {}, config, data: found };
//       }
//     }

//     // List GET with params
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: exercises,
//         pageNumber: 0,
//         pageSize: 20,
//         totalElements: exercises.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   // --- WORKOUTS & HISTORY ---
//   if (url.includes('/workouts/history/me')) {
//     const history = getMockStore(MOCK_HISTORY_KEY, INITIAL_HISTORY);
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: history,
//         pageNumber: 0,
//         pageSize: 50,
//         totalElements: history.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   if (url.includes('/history')) {
//     const history = getMockStore(MOCK_HISTORY_KEY, INITIAL_HISTORY);
//     if (method === 'POST') {
//       const parts = url.split('/');
//       const workoutId = Number(parts[parts.length - 2]);
//       const workouts = getMockStore(MOCK_WORKOUTS_KEY, INITIAL_WORKOUTS);
//       const w = workouts.find(x => x.id === workoutId);

//       const newHistoryItem = {
//         id: Date.now(),
//         workoutId,
//         workoutTitle: w ? w.title : 'Workout',
//         userId: 1,
//         date: body.date || new Date().toISOString().split('T')[0],
//         duration: body.duration || (w ? w.duration : 45),
//         calories: body.calories || 400,
//         completed: body.completed ?? true
//       };

//       const updatedHistory = [newHistoryItem, ...history];
//       setMockStore(MOCK_HISTORY_KEY, updatedHistory);
//       return { status: 200, headers: {}, config, data: newHistoryItem };
//     }

//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: history,
//         pageNumber: 0,
//         pageSize: 20,
//         totalElements: history.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   if (url.includes('/workouts')) {
//     let workouts = getMockStore(MOCK_WORKOUTS_KEY, INITIAL_WORKOUTS);

//     if (method === 'POST') {
//       const exercises = getMockStore(MOCK_EXERCISES_KEY, INITIAL_EXERCISES);
//       const mappedExercises = (body.exercises || []).map((ex: any) => {
//         const matchingEx = exercises.find(e => e.id === ex.exerciseId);
//         return {
//           ...ex,
//           exerciseName: matchingEx ? matchingEx.name : ex.exerciseName || 'Exercise'
//         };
//       });

//       const newWorkout = {
//         id: Date.now(),
//         userId: 1,
//         title: body.title || 'New Workout',
//         day: body.day || 'MONDAY',
//         duration: body.duration || 45,
//         exercises: mappedExercises
//       };
//       workouts = [newWorkout, ...workouts];
//       setMockStore(MOCK_WORKOUTS_KEY, workouts);
//       return { status: 200, headers: {}, config, data: newWorkout };
//     }

//     if (method === 'PUT') {
//       const parts = url.split('/');
//       const id = Number(parts[parts.length - 1]);
//       const exercises = getMockStore(MOCK_EXERCISES_KEY, INITIAL_EXERCISES);
      
//       workouts = workouts.map(w => {
//         if (w.id === id) {
//           const mappedExercises = (body.exercises || []).map((ex: any) => {
//             const matchingEx = exercises.find(e => e.id === ex.exerciseId);
//             return {
//               ...ex,
//               exerciseName: matchingEx ? matchingEx.name : ex.exerciseName || 'Exercise'
//             };
//           });
//           return { ...w, ...body, exercises: mappedExercises };
//         }
//         return w;
//       });

//       setMockStore(MOCK_WORKOUTS_KEY, workouts);
//       return { status: 200, headers: {}, config, data: workouts.find(w => w.id === id) };
//     }

//     if (method === 'DELETE') {
//       const parts = url.split('/');
//       const id = Number(parts[parts.length - 1]);
//       workouts = workouts.filter(w => w.id !== id);
//       setMockStore(MOCK_WORKOUTS_KEY, workouts);
//       return { status: 200, headers: {}, config, data: { message: 'Deleted' } };
//     }

//     // Single item GET
//     const matchSingle = url.match(/\/workouts\/(\d+)/);
//     if (matchSingle) {
//       const id = Number(matchSingle[1]);
//       const found = workouts.find(w => w.id === id);
//       if (found) {
//         return { status: 200, headers: {}, config, data: found };
//       }
//     }

//     // List GET
//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: workouts,
//         pageNumber: 0,
//         pageSize: 20,
//         totalElements: workouts.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   // --- MOCK SERVICES FOR PHASE 2 ---
//   if (url.includes('/templates')) {
//     if (url.includes('/copy')) {
//       const parts = url.split('/');
//       const idStr = parts[parts.length - 2];
//       const template = INITIAL_TEMPLATES.find(t => t.id === Number(idStr));
//       let workouts = getMockStore(MOCK_WORKOUTS_KEY, INITIAL_WORKOUTS);
//       const copied = {
//         ...template,
//         id: Date.now(),
//         userId: 1,
//         title: `${template ? template.title : 'Template'} (Copy)`,
//         isTemplate: false
//       };
//       workouts = [copied, ...workouts];
//       setMockStore(MOCK_WORKOUTS_KEY, workouts);
//       return { status: 200, headers: {}, config, data: copied };
//     }

//     return {
//       status: 200,
//       headers: {},
//       config,
//       data: {
//         content: INITIAL_TEMPLATES,
//         pageNumber: 0,
//         pageSize: 20,
//         totalElements: INITIAL_TEMPLATES.length,
//         totalPages: 1,
//         last: true
//       }
//     };
//   }

//   if (url.includes('/achievements')) {
//     return { status: 200, headers: {}, config, data: INITIAL_ACHIEVEMENTS };
//   }

//   if (url.includes('/spotify')) {
//     return { status: 200, headers: {}, config, data: INITIAL_SPOTIFY_TRACKS };
//   }

//   return null;
// }

// export function parseApiError(error: unknown): ApiError {
//   if (axios.isAxiosError(error) && error.response?.data) {
//     const data = error.response.data as ApiError;
//     if (data.message || data.error) {
//       return data;
//     }
//   }
//   return {
//     timestamp: new Date().toISOString(),
//     status: 500,
//     error: 'Internal Error',
//     message: (error as Error)?.message || 'An unexpected error occurred',
//     path: ''
//   };
// }
/// <reference types="vite/client" />
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234/api';

// Fail loudly at startup if the base URL looks wrong, instead of silently
// falling back to mock data later.
console.info(`[api] Using backend base URL: ${BASE_URL}`);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory token references
let getAccessToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let onLogout: () => void = () => {};
let onRefreshSuccess: (tokens: { accessToken: string; refreshToken: string }) => void = () => {};

export function configureAxiosAuth(config: {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onLogout: () => void;
  onRefreshSuccess: (tokens: { accessToken: string; refreshToken: string }) => void;
}) {
  getAccessToken = config.getAccessToken;
  getRefreshToken = config.getRefreshToken;
  onLogout = config.onLogout;
  onRefreshSuccess = config.onRefreshSuccess;
}

// Request interceptor: attach bearer token + log outgoing requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.debug(`[api] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Lock to prevent multi-refresh race condition
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: logs every response/error, and handles 401 refresh.
// NOTE: the old mock-data fallback has been removed on purpose — it was
// silently faking successful login/register/CRUD responses whenever the
// real backend was unreachable, which is why nothing ever hit MySQL.
api.interceptors.response.use(
  (response) => {
    console.debug(`[api] ← ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      // The request never reached the server at all — wrong URL, backend
      // not running, or CORS rejection. Log it clearly instead of masking it.
      console.error(
        `[api] Network error calling ${originalRequest?.url} — is the backend running at ${BASE_URL}? `,
        error.message
      );
      return Promise.reject(error);
    }

    console.error(`[api] ← ${error.response.status} ${originalRequest?.url}`, error.response.data);

    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        onLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        onLogout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        onRefreshSuccess({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        isRefreshing = false;
        processQueue(null, data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        onLogout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as ApiError;
    if (data.message || data.error) {
      return data;
    }
  }
  return {
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'Internal Error',
    message: (error as Error)?.message || 'An unexpected error occurred',
    path: ''
  };
}