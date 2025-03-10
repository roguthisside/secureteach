
// Mock authentication for demo purposes
// In a real application, this would connect to a backend service

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  private storageKey = 'secure_teach_auth';
  
  isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }
  
  getUser(): User | null {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as User;
    } catch (error) {
      this.logout();
      return null;
    }
  }
  
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo validation - in a real app, this would call a backend API
    if (credentials.email && credentials.password) {
      // Mock user creation for demo
      const user: User = {
        id: crypto.randomUUID(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  }
  
  async register(credentials: RegisterCredentials): Promise<User> {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo validation - in a real app, this would call a backend API
    if (credentials.name && credentials.email && credentials.password) {
      // Mock user creation for demo
      const user: User = {
        id: crypto.randomUUID(),
        name: credentials.name,
        email: credentials.email,
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid registration data');
  }
  
  logout(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const authService = new AuthService();
export type { User, LoginCredentials, RegisterCredentials };
