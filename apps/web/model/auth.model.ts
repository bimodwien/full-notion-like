export type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisteredUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  signIn: () => void;
  signOut: () => void;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};
