export interface AuthResponse {
  readonly token: string;
  readonly userId: number;
  readonly userRole: string;
  readonly firstName: string;
}
