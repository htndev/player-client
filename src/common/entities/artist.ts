import { Nullable } from '@xbeat/toolkit';

export class Artist {
  constructor(public readonly name: string, public readonly url: string, public readonly avatar: Nullable<string>) {}

  get link(): string {
    return `/a/${this.url}`;
  }
}
