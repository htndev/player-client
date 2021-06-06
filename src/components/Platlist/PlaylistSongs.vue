<template>
  <div class="playlist-songs">
    <q-table
      :columns="columns"
      :data="formatedSong"
      :pagination="{ rowsPerPage: 0 }"
      :no-data-label="$t('playlist.no-songs-in-playlist')"
      class="playlist-songs__table"
      hide-pagination
    >
      <template v-slot:body="props">
        <q-tr :props="props" @mouseenter="onMouseUp(props.row.index)" @mouseleave="onMouseLeave">
          <q-td key="index" :props="props">
            <q-btn
              v-if="props.row.isHovering"
              :icon="getDisplayIcon(props.row.url)"
              fab-mini
              outline
              @click="controlSong(props.row.url)"
            />
            <span v-else class="playlist-songs__table--action">
              {{ props.row.index + 1 }}
            </span>
          </q-td>
          <q-td key="title" :props="props">
            <q-img :src="props.row.cover" width="40px" class="q-mr-md" />
            <span>{{ props.row.title }}</span>
          </q-td>
          <q-td key="artist" :props="props">
            <template v-for="(artist, index) in props.row.artist">
              <span v-if="index !== 0" :key="artist.text">, </span>
              <router-link :key="artist.url" :to="artist.url">
                {{ artist.text }}
              </router-link>
            </template>
          </q-td>
          <q-td key="album" :props="props">
            <router-link :to="props.row.album.url">{{ props.row.album.text }}</router-link>
          </q-td>
          <q-td key="duration" :props="props">{{ props.row.duration | formatDuration }}</q-td>
          <q-menu touch-position context-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="removeSongFromPlaylist(props.row.url)">
                  {{ $t('player.menu.remove-song') }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="copyShareLink(props.row.url)">
                  {{ $t('player.menu.share-link') }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { Song } from '@/common/entities/song';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormatFilter } from '@/common/mixin/format';
import { PlayerModule } from '@/store/modules/player';
import { isNull, Nullable } from '@xbeat/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';

type TextUrlType = { text: string; url: string };

interface SongType {
  index: number;
  title: string;
  artist: TextUrlType[];
  album: { text: string; url: string };
  duration: number;
}

@Component({ mixins: [FormatFilter] })
export default class PlaylistSongs extends Vue {
  @Prop({ type: Array })
  songs!: Song[];

  hoveringItem = -1;

  get columns() {
    return [
      { name: 'index', required: true, label: '#', align: 'left', sortable: true },
      {
        name: 'title',
        required: true,
        label: this.$t('player.field.title'),
        align: 'left',
        sortable: true
      },
      {
        name: 'artist',
        required: true,
        label: this.$t('player.field.artist'),
        align: 'left',
        sortable: true
      },
      {
        name: 'album',
        required: true,
        label: this.$t('player.field.album'),
        align: 'left',
        sortable: true
      },
      {
        name: 'duration',
        required: true,
        label: this.$t('player.field.duration'),
        align: 'left',
        sortable: true
      }
    ];
  }

  get currentPlaylingSong(): Nullable<Song> {
    return PlayerModule.song;
  }

  get isCurrentSongPlaying(): boolean {
    return PlayerModule.isPlaying;
  }

  get formatedSong(): SongType[] {
    return this.songs.map((song, index) => ({
      index,
      title: song.title,
      url: song.url,
      cover: song.album.cover || DEFAULT_ALBUM_PLACEHOLDER,
      isHovering: index === this.hoveringItem,
      album: {
        text: song.album.name,
        url: song.album.link
      },
      duration: 0,
      artist: [
        { url: song.artist.link, text: song.artist.name },
        ...(song.hasFeats ? song.feat.map(feat => ({ text: feat.name, url: feat.link })) : [])
      ]
    }));
  }

  getDisplayIcon(url: string): 'pause' | 'play_arrow' {
    const isCurrentSong = !isNull(this.currentPlaylingSong) && url === this.currentPlaylingSong.url;
    if (!isCurrentSong) {
      return 'play_arrow';
    }

    if (isCurrentSong && this.isCurrentSongPlaying) {
      return 'pause';
    }

    return 'play_arrow';
  }

  changeSong({ url }: { url: string }): void {
    this.$emit('song:change', { url });
  }

  controlSong(url: string): void {
    if (isNull(this.currentPlaylingSong)) {
      this.changeSong({ url });
      return;
    }

    if (url !== this.currentPlaylingSong.url) {
      this.changeSong({ url });
      return;
    }

    this.$emit('song:control', !this.isCurrentSongPlaying);
  }

  onMouseLeave() {
    this.hoveringItem = -1;
  }

  onMouseUp(hoveringItem: number): void {
    this.hoveringItem = hoveringItem;
  }

  removeSongFromPlaylist(url: string) {
    console.log('Remove song', url);
  }

  copyShareLink(url: string) {
    console.log('Copy', url);
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.playlist-songs {
  &__table {
    /deep/ &--action {
      display: flex;
      width: 40px;
      height: 40px;
      align-items: center;
    }
    /deep/ a {
      text-decoration: none;
      color: @black;

      &:hover {
        color: @dark-purple;
      }
    }
  }
}
</style>
