import { Playlist } from '@/common/entities/playlist';
import { Song } from '@/common/entities/song';
import store from '@/store';
import { Nullable } from '@xbeat/toolkit';
import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators';

@Module({ namespaced: true, dynamic: true, name: 'player', store })
export class Player extends VuexModule {
  playlist: Nullable<Playlist> = null;
  song: Nullable<Song> = null;
  isPlaying = false;

  @Mutation
  SET_PLAYLIST(playlist: Nullable<Playlist>): void {
    this.playlist = playlist;
  }

  @Mutation
  SET_SONG(song: Nullable<Song>): void {
    this.song = song;
  }

  @Mutation
  PLAY_SONG(): void {
    this.isPlaying = true;
  }

  @Mutation
  PAUSE_SONG(): void {
    this.isPlaying = false;
  }

  @Action
  async setCurrentPlayingSong({ song, playlist }: { song: Song; playlist: Playlist }): Promise<void> {
    this.SET_PLAYLIST(playlist);
    this.SET_SONG(song);
    this.PLAY_SONG();
  }

  @Action
  async toggleSong(isPlaying: boolean): Promise<void> {
    const method = isPlaying ? 'PLAY_SONG' : 'PAUSE_SONG';

    this[method]();
  }

  @Action
  async resetModule(): Promise<void> {
    this.PAUSE_SONG();
    this.SET_PLAYLIST(null);
    this.SET_SONG(null);
  }
}

export const PlayerModule = getModule(Player);
