// MongoDB API service for authentication and data management
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export type UserRole = 'farmer' | 'landowner';

export interface User {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface FarmerProfile {
  _id: string;
  user_id: string;
  farm_size?: number;
  crop_types?: string[];
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export interface Land {
  _id: string;
  owner_id: string;
  title: string;
  description?: string;
  location: string;
  area: number;
  price_per_acre?: number | null;
  soil_type?: string | null;
  water_availability?: string | null;
  status: 'available' | 'rented' | 'sold';
  created_at: string;
  updated_at: string;
}

// Authentication API calls
export const authAPI = {
  async signup(email: string, password: string, fullName: string, role: UserRole) {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return await response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return await response.json();
  },
};

// Profile API calls
export const profileAPI = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Profile update failed');
    }

    return await response.json();
  },
};

// Lands API calls
export const landsAPI = {
  async getLands(): Promise<Land[]> {
    const response = await fetch(`${API_BASE_URL}/api/lands`);
    if (!response.ok) {
      throw new Error('Failed to fetch lands');
    }
    return await response.json();
  },

  async getUserLands(userId: string): Promise<Land[]> {
    const response = await fetch(`${API_BASE_URL}/api/lands/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user lands');
    }
    return await response.json();
  },

  async createLand(land: Omit<Land, '_id' | 'created_at' | 'updated_at'>): Promise<Land> {
    const response = await fetch(`${API_BASE_URL}/api/lands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(land),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create land');
    }

    return await response.json();
  },

  async updateLand(landId: string, updates: Partial<Land>): Promise<Land> {
    const response = await fetch(`${API_BASE_URL}/api/lands/${landId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update land');
    }

    return await response.json();
  },

  async deleteLand(landId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/lands/${landId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete land');
    }
  },
};

