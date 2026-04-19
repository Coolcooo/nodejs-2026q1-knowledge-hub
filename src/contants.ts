export const Role = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;
export const Roles = Object.values(Role);

export const ArticleStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export const ArticleStatuses = Object.values(ArticleStatus);

export const HTTP_CODE_MESSAGES = {
  ID_NOT_FOUND: "id === userId doesn't exist",
  LOGIN_IS_EXIST: 'login is exist',
  PASSWORD_IS_WRONG: 'old password is wrong',
  ARTICLE_IS_NOT_FOUND: 'article is not found',
  AUTH_IS_WRONG: 'login/password is wrong',
  ROLE_IS_INVALID: 'role is invalid',
} as const;

export const Action = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;
