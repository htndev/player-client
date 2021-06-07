<template>
  <div class="artist-header">
    <q-img height="350px" width="100%" :src="safeHeader" />
    <div class="artist-header--overlay"></div>
    <div class="artist-header--description flex items-end">
      <artist-avatar :avatar="artist.avatar" />
      <h2 class="q-ma-none q-ml-md text-weight-bold text-white">{{ artist.name }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ARTIST_HEADER_IMAGE from '@/assets/images/svg/ARTIST-HEADER-FALLBACK.svg';
import ArtistAvatar from '@/components/Artist/ArtistAvatar.vue';
import { ArtistType } from '@/common/types';
import { isNull } from '@xbeat/toolkit';

@Component({ components: { ArtistAvatar } })
export default class ArtistHeader extends Vue {
  @Prop({ type: Object, default: () => ({}) })
  artist!: ArtistType;

  get safeHeader(): string {
    return !isNull(this.artist.header) ? this.artist.header : DEFAULT_ARTIST_HEADER_IMAGE;
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';
.artist-header {
  position: relative;

  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, black 110%);
  }

  &--description {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 2;
    width: calc(100% - 1rem);

    .update-artist-header {
      padding: 5px 10px;
      background: rgba(@light-gray, 0.8);
      color: @black;
      border: 1px solid transparent;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.15s ease-in;

      &:hover {
        background: rgba(@light-gray, 1);
        border-color: @secondary;
      }
    }
  }
}
</style>
