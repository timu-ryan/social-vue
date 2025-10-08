
// для авторизации и регистрации, возможно стоит удалить и оставить один из типов
export type AuthUser = {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string | null;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string; // ISO
}

export interface UsersResponse {
  users: User[];
  meta: {
    limit: number;
    offset: number;
    nextOffset?: number;
    hasMore: boolean;
  };
}
