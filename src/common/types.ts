import { colors } from './colors';
import { ApiEndpoint } from './constants';

export type Tokens = Record<ApiEndpoint, string>;
export type AppColors = keyof typeof colors;

export type StatusResponse = { status: number; message: string };

export type Nullable<T> = T | null;

export type StatusType = { status: number; message?: string };
export interface GraphQLError {
  message: string;
  path: string[];
  locations: { line: number; column: number }[];
  extensions: {
    exception: StatusResponse & { response: StatusResponse };
    stacktrace: string[];
  };
}

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
