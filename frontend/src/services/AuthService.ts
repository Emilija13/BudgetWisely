import axiosInstance from '../auth/axiosInstance';
import { LoginRequest } from '../models/dto/LoginRequest';
import { User } from '../models/User';

const apiUrl = 'http://localhost:8080/api/auth'; 

const AuthService = {
  loginStatus: false,
  currentUser: null as User | null,

  login(request: LoginRequest) {
    return axiosInstance.post(`${apiUrl}/authenticate`, request)
      .then((response) => {
        if (response.data.token) {
          this.setLoginStatus(true);

          localStorage.setItem('jwtToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.setCurrentUser(response.data.user)

          return response.data;
        }
        throw new Error('Invalid credentials');
      })
      .catch((error) => {
        throw error.response?.data || error.message;
      });
  },

  register(user: any) {  //TODO Add RegisterRequest
    return axiosInstance.post(`${apiUrl}/register`, user)
      .then((response) => {
        return response.data; 
      })
      .catch((error) => {
        throw error;
      });
  },

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    this.setLoginStatus(false);
    this.setCurrentUser(null);
  },
  setLoginStatus(status: boolean) {
    this.loginStatus = status;
  },

  getLoginStatus() {
    return this.loginStatus;
  },

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  },

  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default AuthService;
