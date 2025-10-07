import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            email: credentials?.email,
            password: credentials?.password
          });

          const { token, user } = response.data;

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: token
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin'
  }
};

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private employeeId: string | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login and store token
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      this.token = token;
      this.employeeId = String(user.id);
      localStorage.setItem('token', token);
      localStorage.setItem('employeeId', String(user.id));
      localStorage.setItem('tokenTimestamp', Date.now().toString());

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  // Logout and clear session
  logout(): void {
    this.token = null;
    this.employeeId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    window.location.href = '/';
  }

  // Get current employee ID
  getCurrentEmployeeId(): string | null {
    if (!this.employeeId) {
      this.employeeId = localStorage.getItem('employeeId');
      // Fallback: decode from JWT token if localStorage is null/invalid
      if (!this.employeeId || this.employeeId === 'null') {
        const token = this.getToken();
        if (token) {
          try {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            this.employeeId = String(payload.userId);
            // Update localStorage for future use
            localStorage.setItem('employeeId', this.employeeId);
          } catch (error) {
            console.error('Error decoding JWT token for employeeId:', error);
          }
        }
      }
    }
    return this.employeeId;
  }

  // Get auth token
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // Check if token is expired (assuming JWT token)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const exp = payload.exp;
      if (!exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (this.isTokenExpired()) {
      return false;
    }
    return !!this.getToken();
  }

  // Get onboarding status
  async getOnboardingStatus(): Promise<any> {
    try {
      const employeeId = this.getCurrentEmployeeId();
      if (!employeeId) return null;

      const response = await axios.get(`/api/onboarding/status/${employeeId}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get onboarding status:', error);
      return null;
    }
  }

  // Check if employee can access dashboard (process completed + ID generated)
  async canAccessDashboard(): Promise<boolean> {
    try {
      const employeeId = this.getCurrentEmployeeId();
      if (!employeeId) return false;

      const response = await axios.get(`/api/employees/dashboard-access/${employeeId}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });

      return response.data.canAccess;
    } catch (error) {
      console.error('Failed to check dashboard access:', error);
      return false;
    }
  }

  // Get redirect path based on current progress
  async getRedirectPath(): Promise<string> {
    try {
      const employeeId = this.getCurrentEmployeeId();
      if (!employeeId) return '/login';

      const response = await axios.get(`/api/employees/progress/${employeeId}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });

      return response.data.redirectTo || '/employee-onboarding';
    } catch (error) {
      console.error('Failed to get redirect path:', error);
      return '/employee-onboarding';
    }
  }

  // Check if can proceed (not in failed state)
  async canProceed(): Promise<boolean> {
    const status = await this.getOnboardingStatus();
    if (!status) return true;

    if (status.failedAt && new Date(status.failedAt.retryAfter) > new Date()) {
      return false;
    }

    return true;
  }

  // Get retry message
  async getRetryMessage(): Promise<string | null> {
    const status = await this.getOnboardingStatus();
    if (!status || !status.failedAt) return null;

    const retryDate = new Date(status.failedAt.retryAfter);
    const daysLeft = Math.ceil((retryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return `You have failed. Please try again after ${daysLeft} days.`;
  }
}

export default AuthService.getInstance();
