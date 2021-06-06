<template>
  <div class="playlist">
    <image-cropper-popup
      v-model="showCroppingPopup"
      :image="rawCover"
      :loading="isCroppingPopupLoading"
      @cropped="cropped"
    />
    <div class="row q-mt-lg q-mb-lg">
      <div class="playlist__cover">
        <q-img :src="safeImage" />
        <span v-if="isOwnPlaylist" @click="uploadFile">{{ $t('playlist.change-cover') }}</span>
      </div>
      <h1 class="q-ma-none q-ml-lg q-mt-auto">{{ name }}</h1>
    </div>

    <playlist-songs :songs="songs" @song:control="controlSong" @song:change="changeSong" />
  </div>
</template>

<script lang="ts">
import { PlaylistModule } from '@/store/modules/playlist';
import { isNil, Nullable } from '@xbeat/toolkit';
import { Component, Vue } from 'vue-property-decorator';
import { Playlist as PlaylistEntity } from '@/common/entities/playlist';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { Song } from '@/common/entities/song';
import PlaylistSongs from '@/components/Platlist/PlaylistSongs.vue';
import { PlayerModule } from '@/store/modules/player';
import { User } from '@/common/types';
import { UserModule } from '@/store/modules/user';
import ImageCropperPopup from '@/components/Common/ImageCropperPopup.vue';
import convert from 'convert-size';

const MAX_AVATAR_SIZE = 1000000;

@Component({ components: { PlaylistSongs, ImageCropperPopup } })
export default class Playlist extends Vue {
  showCroppingPopup = false;
  rawCover: Nullable<File> = null;
  isCroppingPopupLoading = false;

  get user(): Nullable<User> {
    return UserModule.user;
  }

  get playlist(): PlaylistEntity {
    return PlaylistModule.currentPlaylist as PlaylistEntity;
  }

  get isOwnPlaylist(): boolean {
    return this.playlist.owner.username === this.user?.username;
  }

  get name(): string {
    return this.playlist.title;
  }

  get songs(): Song[] {
    return this.playlist.songs;
  }

  get safeImage(): string {
    return !isNil(this.playlist.cover) ? this.playlist.cover : DEFAULT_ALBUM_PLACEHOLDER;
  }

  controlSong(isPlaying: boolean): void {
    PlayerModule.toggleSong(isPlaying);
  }

  changeSong({ url }: { url: string }): void {
    const song = this.songs.find(song => song.url === url);
    if (!song) {
      return;
    }

    PlayerModule.setCurrentPlayingSong({ song, playlist: this.playlist });
  }

  async uploadFile(): Promise<void> {
    const fileUploader = document.createElement('input');
    fileUploader.type = 'file';
    fileUploader.accept = 'image/x-png,image/gif,image/jpeg';

    fileUploader.onchange = async () => {
      const files = fileUploader.files;
      if (!files) {
        return;
      }

      const [file] = [...files];
      if (file.size > MAX_AVATAR_SIZE) {
        this.$q.notify({
          message: this.$t('errors.file.too-big', [convert(MAX_AVATAR_SIZE, { accuracy: 2 })]) as string,
          type: 'negative',
          position: 'bottom-right'
        });
        return;
      }

      this.rawCover = file;
      this.showCroppingPopup = true;
      fileUploader.remove();
    };

    fileUploader.click();
  }

  async cropped(file: Blob): Promise<void> {
    this.isCroppingPopupLoading = true;
    await PlaylistModule.uploadCover(file);
    this.isCroppingPopupLoading = false;
    this.showCroppingPopup = false;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.playlist {
  &__cover {
    position: relative;
    width: 200px;
    height: 200px;

    span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      font-size: 1.5em;
      color: @white;
      font-weight: 600;
      background: transparent;
      user-select: none;
      will-change: opacity, background, transition;
      transition: 0.15s ease-in;
      transition-property: opacity, background;

      &:hover {
        opacity: 1;
        background: rgba(@black, 0.8);
      }
    }
  }
}
</style>
