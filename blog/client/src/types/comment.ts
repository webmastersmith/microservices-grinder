// Posts
export type PostsType = {
  id: string;
  title: string;
  comments?: CommentType[];
};
export type PostsEventType = {
  type: string;
  data: PostsType;
};

// Comments
export type CommentType = {
  id: string;
  comment: string;
  postId: string;
  status: 'rejected' | 'approved';
};
export type CommentEventType = {
  type: string;
  data: CommentType;
};

// Query
export type QueryType = {
  id: string;
  title: string;
  comments: CommentType[];
};
export type QueryEventType = {
  type: string;
  data: QueryType;
};
