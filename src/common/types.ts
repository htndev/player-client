import { ApiEndpoint } from '@xbeat/toolkit';
import { colors } from './colors';

export type Tokens = Record<ApiEndpoint, string>;

export type AppColors = keyof typeof colors;

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  location: {
    city: string;
    code: string;
    country: string;
    region: string;
  };
}
