<template>
  <div class="album">
    <template v-if="isAlbumFetching">
      <q-linear-progress color="purple" indeterminate />
    </template>
    <template v-else>
      <div class="row q-mt-lg q-mb-lg column items-center">
        <q-img width="400px" :src="safeImage" />
        <h1 class="q-ma-none q-mt-lg text-h4">{{ album.name }}</h1>
      </div>
      <playlist-songs type="album" :songs="songs" @song:control="controlSong" @song:change="changeSong" />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FindAlbumsQuery from '@/graphql/FindAlbums.gql';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { isNull, Nullable, PlaylistAvailability } from '@xbeat/toolkit';
import { RawArtist, RawSong } from '@/common/types';
import { Album as AlbumEntity } from '@/common/entities/album';
import { Playlist } from '@/common/entities/playlist';
import PlaylistSongs from '@/components/Platlist/PlaylistSongs.vue';
import { PlayerModule } from '@/store/modules/player';

interface RawAlbum {
  name: string;
  url: string;
  cover: Nullable<string>;
  released: string;
  artist: RawArtist;
  songs: RawSong[];
}

@Component({ components: { PlaylistSongs } })
export default class Album extends Vue {
  isAlbumFetching = false;
  album!: AlbumEntity;
  pseudoPlaylist!: Playlist;

  get albumId(): string {
    return this.$route.params.id;
  }

  get safeImage(): string {
    return !isNull(this.album.cover) ? this.album.cover : DEFAULT_ALBUM_PLACEHOLDER;
  }

  get songs() {
    return this.pseudoPlaylist.songs;
  }

  controlSong(isPlaying: boolean) {
    PlayerModule.toggleSong(isPlaying);
  }

  changeSong({ url }: { url: string }): void {
    const song = this.songs.find(song => song.url === url);
    if (!song) {
      return;
    }

    PlayerModule.setCurrentPlayingSong({ song, playlist: this.pseudoPlaylist });
  }

  async created(): Promise<void> {
    this.isAlbumFetching = true;
    const {
      data: {
        findAlbums: [album]
      }
    } = await this.$apolloProvider.clients.studio.query<{ findAlbums: RawAlbum[] }>({
      query: FindAlbumsQuery,
      variables: { search: { url: this.albumId } }
    });
    this.album = new AlbumEntity(album.name, album.url, album.cover, album.released);
    this.pseudoPlaylist = new Playlist(
      album.name,
      album.url,
      PlaylistAvailability.Public,
      null,
      album.cover,
      album.songs.map(song => ({ ...song, album: album, artist: album.artist }))
    );
    this.isAlbumFetching = false;
  }
}
</script>

<style lang="less" scoped>
.album {
}
</style>
