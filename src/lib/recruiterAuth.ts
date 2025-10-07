export class AdminAuthService {
  private static readonly ADMIN_TOKEN_KEY = 'adminToken';
  private static readonly ADMIN_USER_KEY = 'adminUser';

  static async checkAdminAuth(): Promise<boolean> {
    const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async loginAdmin(email: string, password: string, role: string = 'admin'): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem(this.ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static logoutAdmin(): void {
    localStorage.removeItem(this.ADMIN_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_USER_KEY);
  }

  static getAdminToken(): string | null {
    return localStorage.getItem(this.ADMIN_TOKEN_KEY);
  }

  static setAdminToken(token: string): void {
    localStorage.setItem(this.ADMIN_TOKEN_KEY, token);
  }

  static setAdminUser(user: any): void {
    localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(user));
  }

  static getAdminUser(): any {
    const userStr = localStorage.getItem(this.ADMIN_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
