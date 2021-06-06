import { Nullable } from '@xbeat/toolkit';

export class Album {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly cover: Nullable<string>,
    private readonly releaseTimestamp: string
  ) {}

  get releaseDate(): Date {
    return new Date(+this.releaseTimestamp);
  }

  get isReleased(): boolean {
    return this.releaseDate < new Date();
  }

  get link(): string {
    return `/album/${this.url}`;
  }
}
