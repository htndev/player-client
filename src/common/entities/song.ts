import { Album } from './album';
import { Artist } from './artist';

export class Song {
  constructor(
    public readonly title: string,
    public readonly url: string,
    public readonly file: string,
    public readonly isReleased: boolean,
    public readonly album: Album,
    public readonly artist: Artist,
    public readonly feat: Artist[]
  ) {}

  get hasFeats(): boolean {
    return this.feat.length > 0;
  }
}
