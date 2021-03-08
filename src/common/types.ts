import { Language } from '@/common/constants/language';
import { ApiEndpoint } from '@xbeat/toolkit';

import { colors } from './constants/colors';

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

export interface Preferences {
  language: Language;
}
