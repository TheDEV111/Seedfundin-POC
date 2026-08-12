export type PropertyType = 'room' | 'apartment';
export type AccountType = 'landlord' | 'tenant';
export type ListingStatus = 'draft' | 'live' | 'filled' | 'expired';

export interface User {
  id: string;
  supabase_id: string;
  name: string;
  phone: string;
  email: string;
  account_type: AccountType;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  property_type: PropertyType;
  price: number;
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: string[];
  amenities: string[];
  availability_date: string;
  description: string;
  status: ListingStatus;
  is_shared?: boolean;
  housemate_count?: number;
  bedroom_count?: number;
  bathroom_count?: number;
  self_contained?: boolean;
  created_at: string;
  updated_at: string;
  distance_km?: number;
}

export interface ListingFilter {
  type?: PropertyType;
  min_price?: number;
  max_price?: number;
  lat?: number;
  lng?: number;
  radius_km?: number;
  amenities?: string[];
}

export interface LandlordContact {
  landlord_name: string;
  landlord_phone: string;
  landlord_email: string;
}

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

class APIClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${path}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = data as APIErrorResponse;
      throw new Error(err.error?.message || `HTTP error ${res.status}`);
    }

    return data as T;
  }

  async getListings(filters: ListingFilter = {}): Promise<{ listings: Listing[]; count: number }> {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
    if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
    if (filters.lat !== undefined) params.append('lat', filters.lat.toString());
    if (filters.lng !== undefined) params.append('lng', filters.lng.toString());
    if (filters.radius_km !== undefined) params.append('radius_km', filters.radius_km.toString());
    if (filters.amenities && filters.amenities.length > 0) {
      params.append('amenities', filters.amenities.join(','));
    }

    const query = params.toString();
    return this.request<{ listings: Listing[]; count: number }>(`/listings${query ? `?${query}` : ''}`);
  }

  async getListing(id: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`);
  }

  async createListing(data: Partial<Listing>): Promise<Listing> {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async revealContact(listingId: string): Promise<LandlordContact> {
    return this.request<LandlordContact>(`/listings/${listingId}/contact`, {
      method: 'POST',
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/me');
  }
}

export const apiClient = new APIClient();
