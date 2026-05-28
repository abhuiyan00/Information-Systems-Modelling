import { UserProfile } from './auth';

export type ReviewAction = 'approve' | 'reject';

export interface ReviewRequest {
  action: ReviewAction;
  reason?: string;            // required when action = "reject"
}

export interface AdminUsersResponse {
  items: UserProfile[];
  total: number;
}
