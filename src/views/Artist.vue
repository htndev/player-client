<template>
  <section class="artist">
    <template v-if="isFetchingArtist">
      <q-linear-progress color="purple" class="q-mt-xl" indeterminate />
    </template>
    <template v-else>
      <artist-header :artist="artist" />

      <div v-if="hasArtistsAlbums" class="artist__grid q-mt-lg">
        <router-link
          class="artist__grid--item"
          v-for="album in artist.albums"
          :key="album.url"
          :to="`/album/${album.url}`"
        >
          <q-img :src="getSafeImage(album.cover)" />
          <div class="artist__grid--item-overlay" />
          <span>{{ album.name }}</span>
        </router-link>
      </div>
      <h4 class="text-center" v-else>{{ $t('artist-do-not-have-albums', [artist.name]) }}</h4>
    </template>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GetArtists from '@/graphql/GetArtists.gql';
import ArtistHeader from '@/components/Artist/ArtistHeader.vue';
import { ArtistType } from '@/common/types';
import { isNull, Nullable } from '@xbeat/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';

@Component({ components: { ArtistHeader } })
export default class Artist extends Vue {
  isFetchingArtist = false;
  artist: ArtistType = { name: '', url: '', avatar: null, header: null, albums: [] };

  get artistId(): string {
    return this.$route.params.id;
  }

  get hasArtistsAlbums(): boolean {
    return this.artist.albums.length > 0;
  }

  async created(): Promise<void> {
    this.isFetchingArtist = true;
    const {
      data: {
        getArtists: [artist]
      }
    } = await this.$apolloProvider.clients.studio.query<{ getArtists: ArtistType[] }>({
      query: GetArtists,
      variables: { artistsSearch: { url: this.artistId } }
    });
    this.artist = artist;
    this.isFetchingArtist = false;
  }

  getSafeImage(image: Nullable<string>): string {
    return !isNull(image) ? image : DEFAULT_ALBUM_PLACEHOLDER;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@size: 300px;

.artist {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, @size);
    justify-content: space-between;
    gap: 20px;
    grid-auto-rows: @size;

    &--item {
      position: relative;

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
