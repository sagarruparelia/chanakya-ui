// User types
export type UserStatus =
  | 'INVITED'
  | 'ACTIVE'
  | 'DISABLED';

export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'CA_OWNER'
  | 'CA_MANAGER'
  | 'CA_STAFF'
  | 'CLIENT_ADMIN'
  | 'CLIENT_MANAGER'
  | 'CLIENT_USER';

export type StaffType = 'CA' | 'ARTICLE';

export type AccessType = 'individual' | 'business' | 'ca_firm';

export interface Permission {
  canUploadDocuments?: boolean;
  canApproveDocuments?: boolean;
  canViewAllClients?: boolean;
  canManageInvites?: boolean;
  canExportData?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  staffType?: StaffType;
  permissions?: Permission;
  tenantId?: string;
  clientId?: string;
  department?: string;
  assignedClientIds?: string[];
  status: UserStatus;
  createdAt?: string;
}

// Auth types
export interface Tokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Request/Response types
export interface SignupRequest {
  inviteToken: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  firmName?: string;    // For CA_OWNER signup
  firmGstin?: string;   // For CA_OWNER signup
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface AccessRequestSubmit {
  accessType: AccessType;
  reason: string;
}

export interface InvitationActivateRequest {
  code: string;
}

export interface CompleteProfileRequest {
  gstNumber: string;
  businessName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

// API Response types
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
  user: User;
}

export interface AccessRequestStatus {
  id: string;
  accessType: AccessType;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface InvitationStatus {
  valid: boolean;
  organizationName?: string;
  role?: string;
  expiresAt?: string;
}

export interface InvitationActivateResponse {
  status: 'activated' | 'pending_verification';
  message: string;
  organizationName?: string;
}

// Error types
export interface ApiError {
  status: number;
  code: string;
  message: string;
}
