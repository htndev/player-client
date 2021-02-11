export const PROJECT_TITLE = 'xBeat';

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'http://localhost:3000',
  STUDIO: process.env.STUDIO_URL || 'http://localhost:5000'
};

export const CLIENTS = {
  ID: process.env.ID_URL || 'http://localhost:8080',
  HOMEPAGE: process.env.HOMEPAGE_URL || 'http://localhost:7070'
};

export enum ApiEndpoint {
  Passport = 'passport',
  Studio = 'studio',
  Media = 'media'
}

export enum HttpStatus {
  NotFound = 404,
  Unauthorized = 401
}
