import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

const useAxios = () => {
  const { token, login, logout } = useAuth();

  const instance = useMemo(() => {
    const api = axios.create({
      // baseURL: 'http://localhost:27017/api', 
      baseURL: 'https://mern-blog-app-production-1e09.up.railway.app/api',
    });

    // REQUEST INTERCEPTOR
    api.interceptors.request.use(
      (config) => {
        const accessToken = token || localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('Refresh token missing');

            const res = await axios.post(
              'http://localhost:27017/api/auth/refresh-token',
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );

            const newAccessToken = res.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            // login(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return api;
  }, [token, login, logout]);

  return instance;
};

export default useAxios;
