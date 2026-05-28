export interface VoteResponse {
  upvotes: number;
  downvotes: number;
  user_vote: 'up' | 'down' | 'none';
}

export interface VoteRequest {
  vote: 'up' | 'down' | 'none';
}
