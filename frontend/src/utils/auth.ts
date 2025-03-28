
// Mock authentication for demo purposes
// In a real application, this would connect to a backend service

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
  joinDate: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

class AuthService {
  private storageKey = 'secure_teach_auth';
  
  isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }
  
  isTeacher(): boolean {
    const user = this.getUser();
    return !!user && (user.role === 'teacher' || user.role === 'admin');
  }
  
  isStudent(): boolean {
    const user = this.getUser();
    return !!user && (user.role === 'student' || user.role === 'admin');
  }
  
  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && user.role === 'admin';
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
        role: credentials.email.includes('teacher') ? 'teacher' : 'student',
        joinDate: new Date().toISOString(),
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
        role: credentials.role || 'student',
        joinDate: new Date().toISOString(),
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid registration data');
  }
  
  updateUser(userData: Partial<User>): User {
    const currentUser = this.getUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const updatedUser: User = {
      ...currentUser,
      ...userData,
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
    return updatedUser;
  }
  
  logout(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const authService = new AuthService();
