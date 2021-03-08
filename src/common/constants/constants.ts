import { Tokens } from '@/common/types';

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'http://localhost:3000',
  STUDIO: process.env.STUDIO_URL || 'http://localhost:5000'
};

export const CLIENTS = {
  ID: process.env.ID_URL || 'http://localhost:8080',
  HOMEPAGE: process.env.HOMEPAGE_URL || 'http://localhost:7070'
};

export const EMPTY_TOKENS: Tokens = {
  passport: '',
  studio: '',
  media: ''
};

export const PLAYER_REDIRECT_QUERY_PARAM = `?to=player`;
