import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: 'tenant' | 'landlord' | null;
  email: string | null;
  isVerified: boolean;
}

const initialState: AuthState = {
  role: 'tenant', // Default for dev
  email: null,
  isVerified: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<'tenant' | 'landlord'>) => {
      state.role = action.payload;
    },
    verifyUser: (state) => {
      state.isVerified = true;
    },
    clearAuth: (state) => {
      state.role = null;
      state.email = null;
      state.isVerified = false;
    }
  },
});

export const { setUserRole, verifyUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
