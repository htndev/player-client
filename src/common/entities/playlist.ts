import { PlaylistType } from '@/common/constants/playlist';
import { RawSong, User } from '@/common/types';
import i18n from '@/plugins/i18n';
import { UserModule } from '@/store/modules/user';
import { Nullable, PlaylistAvailability, isNull } from '@xbeat/toolkit';
import { TranslateResult } from 'vue-i18n';

import { Album } from './album';
import { Artist } from './artist';
import { Song } from './song';

export class Playlist {
  constructor(
    public readonly title: string,
    public readonly url: string,
    public readonly availability: PlaylistAvailability,
    public readonly owner: Nullable<User>,
    public cover: Nullable<string>,
    public readonly _songs: RawSong[]
  ) {}

  get availableType(): string {
    return PlaylistType[this.availability];
  }

  get localizedAccessType(): TranslateResult {
    return i18n.t(`playlist.availability.${this.availableType}`);
  }

  get link(): string {
    return `/p/${this.url}`;
  }

  get isPrivate(): boolean {
    return this.availability === PlaylistAvailability.Private;
  }

  get isPublic(): boolean {
    return this.availability === PlaylistAvailability.Public;
  }

  get isOwnPlaylist(): boolean {
    return !isNull(this.owner) && UserModule.user!.username === this.owner.username;
  }

  get songs(): Song[] {
    return this._songs.map(
      ({ name, url, released, album, artist, feat, file }) =>
        new Song(
          name,
          url,
          file,
          released,
          new Album(album.name, album.url, album.cover, album.released),
          new Artist(artist.name, artist.url, artist.avatar),
          feat.map(({ name, url, avatar }) => new Artist(name, url, avatar))
        )
    );
  }
}
