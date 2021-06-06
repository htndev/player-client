<template>
  <div class="playlist-plate" @click.prevent.stop="setCurrentPlaylist">
    <q-img :src="safeCover" />
    <span class="playlist-plate__title">{{ title }}</span>
    <div class="playlist-plate__overlay" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { isNull, Nullable } from '@xbeat/toolkit';
import { PlaylistModule } from '@/store/modules/playlist';

@Component
export default class PlaylistPlate extends Vue {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  url!: string;

  @Prop({ type: [String, Object] })
  cover!: Nullable<string>;

  get safeCover(): string {
    return !isNull(this.cover) ? this.cover : ALBUM_PLACEHOLDER;
  }

  async setCurrentPlaylist(): Promise<void> {
    await PlaylistModule.setCurrentPlaylist({ id: this.url });
    this.$router.push(`/p/${this.url}`);
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.playlist-plate {
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;

  &__title {
    position: absolute;
    bottom: 1em;
    left: 1em;
    color: @white;
    z-index: 1;
    font-size: 1.5em;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, black 120%);
    z-index: 0;
  }
}
</style>
