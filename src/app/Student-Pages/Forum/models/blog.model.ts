export interface Blog {
  id: number;
  title: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  authorId?: number;
  viewCount?: number;
  likes?: number;
  comments?: number | Comment[];
  tags?: string[];
  published?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  authorId?: number;
  createdAt: Date;
  blogId: number;
}