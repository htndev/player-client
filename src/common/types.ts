import { Language } from '@/common/constants/language';
import { ApiEndpoint, Nullable } from '@xbeat/toolkit';

import { colors } from './constants/colors';

export type Tokens = Record<ApiEndpoint, string>;

export type AppColors = keyof typeof colors;

export interface RawArtist {
  name: string;
  url: string;
  avatar: Nullable<string>;
  header?: Nullable<string>;
}

export interface RawAlbum {
  name: string;
  url: string;
  released: string;
  cover: Nullable<string>;
}

export type FeatType = {
  name: string;
  avatar: Nullable<string>;
  url: string;
};

export interface RawSong {
  name: string;
  file: string;
  url: string;
  released: boolean;
  album: RawAlbum;
  artist: RawArtist;
  feat: FeatType[];
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

export interface Preferences {
  language: Language;
}

export interface RawPlaylist {
  availability: number;
  title: string;
  url: string;
  cover: Nullable<string>;
  owner: User;
  songs: RawSong[];
}

export interface ArtistType {
  name: string;
  url: string;
  avatar: Nullable<string>;
  header: Nullable<string>;
  albums: { name: string; url: string; cover: Nullable<string> }[];
}
