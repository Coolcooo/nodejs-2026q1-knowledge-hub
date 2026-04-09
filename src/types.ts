import { ArticleStatus, Role } from './contants';

export type TUser = {
  id: string;
  login: string;
  password: string;
  role: TRole;
  createdAt: number;
  updatedAt: number;
};

export type TArticle = {
  id: string;
  title: string;
  content: string;
  status: TArcticleStatus;
  authorId: string | null; // refers to User
  categoryId: string | null; // refers to Category
  tags: string[]; // array of tag names
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
};

export type TCategory = {
  id: string;
  name: string;
  description: string;
};

export type TComment = {
  id: string; // uuid v4
  content: string;
  articleId: string; // refers to Article
  authorId: string | null; // refers to User
  createdAt: number; // timestamp of creation
};

export type TRole = (typeof Role)[keyof typeof Role];
export type TArcticleStatus =
  (typeof ArticleStatus)[keyof typeof ArticleStatus];

export type TUpdateUserDto = {
  oldPassword: string;
  newPassword: string;
};
export type TCreateUserDto = {
  login: string;
  password: string;
  role?: TRole; // defaults to 'viewer'
};

export type TCreateCategoryDto = {
  name: string;
  description: string;
};
export type TUpdateCategoryDto = Partial<TCreateCategoryDto>;
