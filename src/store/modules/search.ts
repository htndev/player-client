import { RawSong, RawPlaylist } from '@/common/types';
import { RawArtist, RawAlbum } from './../../common/types';
import { studio } from '@/common/apollo/studio';
import store from '@/store';
import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators';
import SearchQuery from '@/graphql/Search.gql';

@Module({ dynamic: true, namespaced: true, name: 'search', store })
export default class Search extends VuexModule {
  isSearching = false;
  isSearched = false;
  artists: RawArtist[] = [];
  albums: RawAlbum[] = [];
  songs: RawSong[] = [];
  playlists: RawPlaylist[] = [];

  get queryResult() {
    return {
      artists: this.artists,
      albums: this.albums,
      songs: this.songs,
      playlists: this.playlists
    };
  }

  @Mutation
  SEARCH_STARTED(): void {
    this.isSearched = true;
    this.isSearching = true;
  }

  @Mutation
  SEARCH_COMPLETED(): void {
    this.isSearching = false;
  }

  @Mutation
  SET_ARTISTS(artists: RawArtist[]): void {
    this.artists = artists;
  }

  @Mutation
  SET_ALBUMS(albums: RawAlbum[]): void {
    this.albums = albums;
  }

  @Mutation
  SET_SONGS(songs: RawSong[]): void {
    this.songs = songs;
  }

  @Mutation
  SET_PLAYLISTS(playlists: RawPlaylist[]): void {
    this.playlists = playlists;
  }

  @Mutation
  RESET_SEARCH(): void {
    this.isSearched = false;
    this.isSearching = false;
    this.artists = [];
    this.albums = [];
    this.songs = [];
    this.playlists = [];
  }

  @Action
  async search({ query }: { query: string }): Promise<void> {
    this.SEARCH_STARTED();
    const {
      data: {
        search: { albums, artists, songs, playlists }
      }
    } = await studio.query<{
      search: {
        artists: RawArtist[];
        albums: RawAlbum[];
        songs: RawSong[];
        playlists: RawPlaylist[];
      };
    }>({ query: SearchQuery, variables: { query } });

    this.SET_ALBUMS(albums);
    this.SET_ARTISTS(artists);
    this.SET_SONGS(songs);
    this.SET_PLAYLISTS(playlists);

    this.SEARCH_COMPLETED();
  }
}

export const SearchModule = getModule(Search);
