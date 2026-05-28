export interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_username: string;
  created_at: string;
}

export interface CommentRequest {
  content: string;
}
