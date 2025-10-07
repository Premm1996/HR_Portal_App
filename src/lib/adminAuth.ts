export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/admin/check', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin || false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return false;
  }
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const response = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/auth/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Admin logout error:', error);
  }
}
