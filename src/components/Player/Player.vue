<template>
  <div class="player">
    <q-img :src="safeCover" width="60px" />
    <div class="player__description q-ml-md">
      <p class="q-mb-sm">{{ safeTitle }}</p>
      <div class="row">
        <template v-for="(artist, index) in artists">
          {{ index !== 0 ? ',' : '' }}
          <router-link :key="artist.url" :to="artist.url">{{ artist.title }}</router-link>
        </template>
      </div>
    </div>
    <div class="player__control">
      <span class="q-mr-md">{{ currentSongPosition | formatDuration }}</span>
      <div class="player__timeline">
        <div class="player__buttons">
          <q-btn icon="skip_previous" class="q-mr-sm" outline fab-mini @click="rewind('previous')" />
          <q-btn :icon="playPauseIcon" class="q-mr-sm" outline fab-mini @click="playPauseSong" />
          <q-btn icon="skip_next" outline fab-mini @click="rewind('forward')" />
        </div>
        <player-timeline
          v-model="currentSongPosition"
          :min="0"
          :max="duration"
          :step="1"
          @change="onSongPositionChanged"
        />
      </div>
      <span class="q-mx-md">{{ duration | formatDuration }}</span>
    </div>
    <div class="player__volume">
      <q-icon name="volume_up" size="md" class="q-mr-sm" />
      <player-timeline v-model="currentVolume" :min="0" :max="1" :step="0.1" />
    </div>
    <!-- {{ duration | formatDuration }} -->
  </div>
</template>

<script lang="ts">
import { Playlist } from '@/common/entities/playlist';
import { isNil, isNull, Nullable } from '@xbeat/toolkit';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { PlayerModule } from '@/store/modules/player';
import { Song } from '@/common/entities/song';
import PlayerTimeline from '@/components/Player/PlayerTimeline.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { FormatFilter } from '@/common/mixin/format';

@Component({ mixins: [FormatFilter], components: { PlayerTimeline } })
export default class Player extends Vue {
  audio: Nullable<HTMLAudioElement> = null;
  duration = 0;
  currentSongPosition = 0;
  currentVolume = 1;
  interval = -1;

  get playlist(): Nullable<Playlist> {
    return PlayerModule.playlist;
  }

  get song(): Nullable<Song> {
    return PlayerModule.song;
  }

  get hasPlayingSong(): boolean {
    return !isNil(this.song);
  }

  get artists(): { title: string; url: string }[] {
    return this.hasPlayingSong
      ? [
          { title: this.song!.artist.name, url: this.song!.artist.url },
          ...(this.song!.hasFeats ? this.song!.feat.map(feat => ({ title: feat.name, url: feat.url })) : [])
        ]
      : [];
  }

  get playPauseIcon(): string {
    return this.isPlaying ? 'pause' : 'play_arrow';
  }

  get isPlaying(): boolean {
    return PlayerModule.isPlaying;
  }

  set isPlaying(isPlaying: boolean) {
    const method = isPlaying ? 'PLAY_SONG' : 'PAUSE_SONG';

    PlayerModule[method]();
  }

  get safeTitle(): string {
    return this.hasPlayingSong ? this.song!.title : '';
  }

  get safeCover(): string {
    if (!this.hasPlayingSong) {
      return DEFAULT_ALBUM_PLACEHOLDER;
    }

    return !isNull(this.song!.album.cover) ? this.song!.album.cover : DEFAULT_ALBUM_PLACEHOLDER;
  }

  @Watch('song')
  async onSongChanged(newSong: Nullable<Song>): Promise<void> {
    if (isNull(newSong)) {
      this.currentSongPosition = 0;
      this.audio = null;
      return;
    }

    if (!isNull(this.audio)) {
      this.audio.pause();
      this.audio = null;
    }

    this.currentSongPosition = 0;
    this.audio = new Audio();
    this.audio.addEventListener('playing', this.launchInterval.bind(this));
    this.audio.addEventListener('pause', this.stopInterval.bind(this));
    this.audio.addEventListener('ended', this.stopInterval.bind(this));
    this.audio.addEventListener('loadeddata', () => {
      this.audio!.play();
      this.duration = Math.floor(this.audio!.duration);
    });

    const file = await fetch(newSong.file).then(song => song.blob());
    this.audio.src = URL.createObjectURL(file);
  }

  @Watch('isPlaying')
  onIsPlayingChanged(isPlaying: boolean) {
    const method: 'play' | 'pause' = isPlaying ? 'play' : 'pause';
    this.isPlaying = isPlaying;

    this.audio?.[method]();
  }

  @Watch('currentVolume')
  onVolumeChanged(volume: number): void {
    this.audio!.volume = volume;
  }

  onSongPositionChanged(time: number): void {
    this.audio!.pause();
    this.audio!.currentTime = time;
    this.audio!.play();
    this.isPlaying = true;
  }

  launchInterval(): void {
    this.interval = setInterval(() => this.currentSongPosition++, 1000);
  }

  playPauseSong(): void {
    this.isPlaying = !this.isPlaying;
  }

  stopInterval(): void {
    clearInterval(this.interval);
    this.interval = -1;
  }

  async rewind(direction: 'forward' | 'previous'): Promise<void> {
    const currentSongIndex = PlayerModule.playlist!.songs.findIndex(song => song.url === this.song!.url);

    if (currentSongIndex === 0 && direction === 'previous') {
      PlayerModule.setCurrentPlayingSong({ song: this.playlist!.songs[0], playlist: this.playlist as Playlist });
      return;
    }

    const incrementor = direction === 'forward' ? 1 : -1;
    const nextSong = PlayerModule.playlist!.songs[currentSongIndex + incrementor];

    if (isNil(nextSong)) {
      await this.audio?.pause();
      PlayerModule.toggleSong(false);
      PlayerModule.SET_SONG(null);
      return;
    }

    PlayerModule.setCurrentPlayingSong({ playlist: this.playlist as Playlist, song: nextSong });
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.player {
  position: fixed;
  bottom: 0;
  right: 0;
  width: calc(100% - 300px);
  height: 100px;
  background: @light-gray;
  padding: 1rem;
  display: flex;
  align-items: center;

  a {
    color: @black;
    text-decoration: none;

    &:hover {
      color: @secondary;
    }
  }

  &__control {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }

  &__timeline {
    display: flex;
    flex-grow: 1;
    align-items: center;
    flex-direction: column;
  }

  &__volume {
    display: flex;
    align-items: center;
    width: 10rem;
  }

  &__buttons {
    display: flex;
    align-items: center;
  }
}
</style>
