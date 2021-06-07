import { StatusType } from '@xbeat/client-toolkit';
import { studio } from '@/common/apollo/studio';
import MediaEndpoint from '@/common/endpoints/media';
import { Playlist as PlaylistEntity } from '@/common/entities/playlist';
import { RawPlaylist } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import GetUserPlaylistsQuery from '@/graphql/GetUserPlaylists.gql';
import UpdatePlaylistCoverMutation from '@/graphql/UpdatePlaylistCover.gql';
import store from '@/store';
import Vue from 'vue';
import { Nullable, isNull, PlaylistAvailability, isNil } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import CreateNewPlaylistMutation from '@/graphql/CreateNewPlaylist.gql';
import UpdatePlaylistAvailabilityMutation from '@/graphql/UpdatePlaylistAvailability.gql';

import { UserModule } from './user';

const mapRawPlaylist = (playlist: RawPlaylist) =>
  new PlaylistEntity(
    playlist.title,
    playlist.url,
    playlist.availability,
    playlist.owner,
    playlist.cover,
    playlist.songs
  );

@Module({ dynamic: true, store, name: 'playlist', namespaced: true })
export class Playlist extends VuexModule implements InitializeStore {
  playlists: PlaylistEntity[] = [];
  isFetchingPlaylists = false;
  currentPlaylistUrl: Nullable<string> = null;
  externalPlaylist: Nullable<PlaylistEntity> = null;

  get hasPlaylists(): boolean {
    return this.playlists.length > 0;
  }

  get currentPlaylist(): Nullable<PlaylistEntity> {
    return !isNull(this.currentPlaylistUrl)
      ? (this.playlists.find(p => p.url === this.currentPlaylistUrl) as PlaylistEntity)
      : !isNull(this.externalPlaylist)
      ? this.externalPlaylist
      : null;
  }

  @Mutation
  SET_PLAYLISTS(playlists: RawPlaylist[]): void {
    this.playlists = playlists.map(mapRawPlaylist);
  }

  @Mutation
  PLAYLISTS_FETCHING_STARTED(): void {
    this.isFetchingPlaylists = true;
  }

  @Mutation
  PLAYLISTS_FETCHING_COMPLETED(): void {
    this.isFetchingPlaylists = false;
  }

  @Mutation
  SET_CURRENT_PLAYLIST(playlist: Nullable<string>): void {
    this.currentPlaylistUrl = playlist;
  }

  @Mutation
  SET_CURRENT_PLAYLIST_COVER(url: Nullable<string>): void {
    const playlistIndex = this.playlists.findIndex(playlist => playlist.url === this.currentPlaylistUrl);

    Vue.set(this.playlists[playlistIndex], 'cover', url);
  }

  @Mutation
  SET_EXTERNAL_PLAYLIST(playlist: Nullable<RawPlaylist>): void {
    this.externalPlaylist = isNull(playlist) ? null : mapRawPlaylist(playlist);
  }

  @Action
  async initialize() {
    await this.getCurrentUserPlaylists();
  }

  @Action
  async getCurrentUserPlaylists(): Promise<void> {
    const playlists = await this.findPlaylists({ username: UserModule.user!.username });

    this.SET_PLAYLISTS(playlists);
  }

  @Action
  async findPlaylists(search: { url?: string; title?: string; username?: string }): Promise<RawPlaylist[]> {
    const {
      data: { findPlaylists: playlists }
    } = await studio.query<{ findPlaylists: RawPlaylist[] }>({
      query: GetUserPlaylistsQuery,
      variables: { search }
    });

    return playlists;
  }

  @Action
  async setCurrentPlaylist({ id }: { id: string }): Promise<void> {
    const [rawCurrentPlaylist] = await this.findPlaylists({ url: id });
    const isExternalPlaylist = await this.isExternalPlaylist({ id });
    const mutation = isExternalPlaylist ? 'SET_EXTERNAL_PLAYLIST' : 'SET_CURRENT_PLAYLIST';
    const resetMutation = !isExternalPlaylist ? 'SET_EXTERNAL_PLAYLIST' : 'SET_CURRENT_PLAYLIST';

    this[resetMutation](null);
    this[mutation](isExternalPlaylist ? rawCurrentPlaylist : (rawCurrentPlaylist.url as any));
  }

  @Action
  async uploadCover(file: Blob): Promise<void> {
    const {
      data: {
        files: [cover]
      }
    } = await MediaEndpoint.uploadImage(file);

    await studio.mutate<{ updatePlaylistCover: StatusType }>({
      mutation: UpdatePlaylistCoverMutation,
      variables: {
        input: {
          cover,
          playlist: this.currentPlaylist?.url
        }
      }
    });

    this.SET_CURRENT_PLAYLIST_COVER(cover);
  }

  @Action
  async createNew({ title }: { title: string }): Promise<void> {
    await studio.mutate({ mutation: CreateNewPlaylistMutation, variables: { playlist: { title } } });
    await this.getCurrentUserPlaylists();
  }

  @Action
  async updateAvailability(availability: PlaylistAvailability): Promise<void> {
    await studio.mutate({
      mutation: UpdatePlaylistAvailabilityMutation,
      variables: { input: { playlist: this.currentPlaylistUrl, availability: availability } }
    });
    await this.getCurrentUserPlaylists();
  }

  @Action
  async isExternalPlaylist({ id }: { id: string }): Promise<boolean> {
    return isNil(this.playlists.find(({ url }) => url === id));
  }
}

export const PlaylistModule = getModule(Playlist);
