export interface Collaborator {
  user_id: string;
  username: string;
  role: 'co_author';
}

export interface InviteRequest {
  email: string;
}
