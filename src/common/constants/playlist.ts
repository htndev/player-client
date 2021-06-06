import { PlaylistAvailability } from '@xbeat/toolkit';

export const PlaylistType: { [k in PlaylistAvailability]: string } = {
  [PlaylistAvailability.Private]: 'private',
  [PlaylistAvailability.Public]: 'public'
};
