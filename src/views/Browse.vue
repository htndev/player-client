<template>
  <main class="browse">
    <h1>{{ $t('browse') }}</h1>
    <div class="row q-mb-xl">
      <q-input v-model="query" outlined class="col-4" @keydown.enter="search" :placeholder="$t('search.placeholder')" />
      <q-btn icon="search" class="q-ml-md" outline @click="search" :loading="isSearching" />
    </div>
    <div class="browse__greeting" v-if="isFirstSeach" />
    <div class="browser__loading" v-else-if="isSearching">
      <q-linear-progress color="purple" indeterminate />
    </div>
    <div class="browse__result" v-else>
      <template v-if="!isNothingFound">
        <template v-if="hasArtists">
          <h2>{{ $t('search.artists') + ` (${artists.length})` }}</h2>
          <div class="browse__result--grid">
            <router-link
              class="browse__result--item"
              v-for="artist in artists"
              :key="artist.url"
              :to="`/a/${artist.url}`"
            >
              <q-img :src="safeImage(artist.avatar)" />
              <div class="browse__result--item-overlay" />
              <span>{{ artist.name }}</span>
            </router-link>
          </div>
        </template>
        <template v-if="hasAlbums">
          <h2>{{ $t('search.albums') + ` (${albums.length})` }}</h2>
          <div class="browse__result--grid">
            <router-link
              class="browse__result--item"
              v-for="album in albums"
              :key="album.url"
              :to="`/album/${album.url}`"
            >
              <q-img :src="safeImage(album.cover)" />
              <div class="browse__result--item-overlay" />
              <span>
                <span>{{ album.name + ` (${album.songs.length}) ` }}</span>
                <q-icon name="fiber_manual_record" class="q-my-sm" />
                <router-link :to="`/a/${album.artist.url}`">{{ album.artist.name }}</router-link>
              </span>
            </router-link>
          </div>
        </template>
        <template v-if="hasSongs">
          <h2>{{ $t('search.songs') + ` (${songs.length})` }}</h2>
          <div class="browse__result--grid">
            <router-link
              class="browse__result--item"
              v-for="song in songs"
              :key="song.url"
              :to="`/album/${song.album.url}?track=${song.url}`"
            >
              <q-img :src="safeImage(song.album.cover)" />
              <div class="browse__result--item-overlay" />
              <span>
                <span>{{ song.name }}</span>
                <q-icon name="fiber_manual_record" class="q-my-sm" />
                <router-link :to="`/album/${song.album.url}`">{{ song.album.name }}</router-link>
              </span>
            </router-link>
          </div>
        </template>
        <template v-if="hasPlaylists">
          <h2>{{ $t('search.playlists') + ` (${playlists.length})` }}</h2>
          <div class="browse__result--grid">
            <router-link
              class="browse__result--item"
              v-for="playlist in playlists"
              :key="playlist.url"
              :to="`/p/${playlist.url}`"
            >
              <q-img :src="safeImage(playlist.cover)" />
              <div class="browse__result--item-overlay" />
              <span>{{ playlist.title }}</span>
            </router-link>
          </div>
        </template>
      </template>
      <template v-else>
        <h4>{{ $t('search.nothing') }}</h4>
      </template>
    </div>
  </main>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { SearchModule } from '@/store/modules/search';
import { RawAlbum, RawArtist, RawPlaylist, RawSong } from '@/common/types';
import { isNull, Nullable } from '@xbeat/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_PLATE_PLACEHOLER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';

@Component({
  async beforeRouteEnter(to, from, next) {
    const query: string | undefined = to.query.query as string | undefined;

    if (query) {
      await SearchModule.search({ query });
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    SearchModule.RESET_SEARCH();
    next();
  }
})
export default class Browse extends Vue {
  query = '';

  get isFirstSeach(): boolean {
    return !SearchModule.isSearched;
  }

  get isSearching(): boolean {
    return SearchModule.isSearching;
  }

  get queryResult() {
    return SearchModule.queryResult;
  }

  get artists(): RawArtist[] {
    return this.queryResult.artists;
  }

  get hasArtists(): boolean {
    return this.artists.length > 0;
  }

  get albums(): RawAlbum[] {
    return this.queryResult.albums;
  }

  get hasAlbums(): boolean {
    return this.albums.length > 0;
  }

  get songs(): RawSong[] {
    return this.queryResult.songs;
  }

  get hasSongs(): boolean {
    return this.songs.length > 0;
  }

  get playlists(): RawPlaylist[] {
    return this.queryResult.playlists;
  }

  get hasPlaylists(): boolean {
    return this.playlists.length > 0;
  }

  get isNothingFound(): boolean {
    return [this.hasPlaylists, this.hasArtists, this.hasAlbums, this.hasSongs].every(v => v === false);
  }

  async search(): Promise<void> {
    if (this.query.length < 1) {
      return;
    }

    this.$router.push({ query: { query: this.query } });
    await SearchModule.search({ query: this.query });
  }

  safeImage(image: Nullable<string>): string {
    return !isNull(image) ? image : DEFAULT_PLATE_PLACEHOLER;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@result-item-size: 200px;

.browse {
  &__result {
    &--grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, @result-item-size);
      justify-content: left;
      gap: 20px;
      grid-auto-rows: @result-item-size;
    }

    &--item {
      position: relative;
      text-decoration: none;

      a {
        text-decoration: none;
        color: @white;
      }

      &-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 0%, black 120%);
        z-index: 0;
      }

      > span {
        position: absolute;
        z-index: 1;
        bottom: 1em;
        left: 1em;
        color: @white;
      }
    }
  }
}
</style>
