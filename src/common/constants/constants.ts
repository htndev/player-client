import { Tokens } from '@/common/types';
import {} from 'quasar';

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'http://localhost:3000',
  STUDIO: process.env.STUDIO_URL || 'http://localhost:5000',
  MEDIA: process.env.MEDIA_URL || 'http://localhost:4000'
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

export const SUCCESS_NOTIFICATION_OPTIONS: { type: string; position: 'bottom-right'; timeout: number } = {
  type: 'positive',
  position: 'bottom-right',
  timeout: 7500
};

export const ERROR_NOTIFICATION_OPTIONS: { type: string; position: 'bottom-right'; timeout: number } = {
  type: 'negative',
  position: 'bottom-right',
  timeout: 7500
};
