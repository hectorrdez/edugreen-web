import ApiClient from "@services/ApiClient";

export interface AccessCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

// Returned by POST /auth and POST /auth/login
export interface AuthTokens {
  id: string;
  role: string;
  sessionToken: string;
  refreshToken: string;
}

// Returned by POST /auth/refresh
export interface RefreshData {
  sessionToken: string;
}

// Returned by PATCH /auth (forgot password)
export interface ForgotPasswordData {
  token: string;
}

export default class AccessService {
  static register(payload: RegisterPayload) {
    return ApiClient.post<AuthTokens>("/auth", payload);
  }

  static login(credentials: AccessCredentials) {
    return ApiClient.post<AuthTokens>("/auth/login", credentials);
  }

  static refresh(refreshToken: string) {
    return ApiClient.post<RefreshData>("/auth/refresh", { refreshToken });
  }

  static forgotPassword(email: string) {
    return ApiClient.patch<ForgotPasswordData>("/auth", { email });
  }

  static confirmRegister(token: string) {
    return ApiClient.post<AuthTokens>("/auth/register", { token });
  }

  static changePassword(token: string, password: string) {
    return ApiClient.patch<{ message: string }>(`/auth/${token}`, { password });
  }
}
