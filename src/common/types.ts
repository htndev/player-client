import { ApiEndpoint } from './constants';

export type Tokens = Record<ApiEndpoint, string>;

export type GraphQLTypename = { __typename: string };

export type StatusResponse = { status: number; message: string };

export type Nullable<T> = T | null;

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
  location: {
    city: string;
    code: string;
    country: string;
    region: string;
  };
}
