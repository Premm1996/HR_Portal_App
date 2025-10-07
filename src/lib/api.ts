import axios from 'axios';
import useSWR from 'swr';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// SWR fetcher function
const fetcher = (url: string) => api.get(url).then(res => res.data);

// Custom hooks for common API calls
export const useEmployeeProfile = (employeeId: string | null) => {
  return useSWR(employeeId ? `/employees/${employeeId}/profile` : null, fetcher);
};

export const useAttendanceSummary = (employeeId: string | null) => {
  return useSWR(employeeId ? `/attendance/summary/${employeeId}` : null, fetcher);
};

export const usePayrollHistory = () => {
  return useSWR('/finance/payroll-history', fetcher);
};

export const useUpcomingBirthdays = () => {
  return useSWR('/employees/upcoming-birthdays', fetcher);
};

// Function to update employee profile
export const updateEmployeeProfile = async (employeeId: string, data: any) => {
  const response = await api.put(`/employees/${employeeId}/profile/enhanced`, data);
  return response.data;
};

export default api;
