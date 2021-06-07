<template>
  <div class="playlists">
    <h1>{{ $t('search.playlists') }}</h1>
    <q-dialog v-model="showCreateNewPlaylistPopup">
      <q-card style="width: 400px">
        <q-card-section>
          {{ $t('create-playlist') }}
        </q-card-section>
        <q-card-section>
          <q-input v-model="newPlaylistTitle" :rules="newPlaylistTitleRules" placeholder="E.g, Party Music" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn :label="$t('close')" @click="closePopup" flat />
          <q-btn :label="$t('create-playlist')" @click="createPlaylist" :loading="isPlaylistCreatingLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <template v-if="hasAlbums">
      <div class="playlists__grid">
        <playlist-plate
          v-for="playlist in playlists"
          :key="playlist.url"
          :title="playlist.title"
          :url="playlist.url"
          :cover="playlist.cover"
        />
        <span class="playlists__create-new" @click="openPopup"><q-icon name="add" />{{ $t('create-playlist') }}</span>
      </div>
    </template>
    <template v-else>
      <h3 class="text-center">{{ $t('playlist.no-playlists') }}</h3>
      <div class="row justify-center"><q-btn :label="$t('create-playlist')" @click="openPopup" /></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Playlist } from '@/common/entities/playlist';
import { PlaylistModule } from '@/store/modules/playlist';
import { Vue, Component } from 'vue-property-decorator';
import PlaylistPlate from '@/components/Platlist/PlaylistPlate.vue';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { TranslateResult } from 'vue-i18n';

@Component({ components: { PlaylistPlate } })
export default class Playlists extends Vue {
  showCreateNewPlaylistPopup = false;
  newPlaylistTitle = '';
  isPlaylistCreatingLoading = false;

  get playlists(): Playlist[] {
    return PlaylistModule.playlists;
  }

  get hasAlbums(): boolean {
    return this.playlists.length > 0;
  }

  get newPlaylistTitleRules(): ((v: string) => true | TranslateResult)[] {
    return [
      (v: string) =>
        v.length > FIELD_LENGTH.PLAYLIST.MIN || this.$t('playlist.rules.too-short', [FIELD_LENGTH.PLAYLIST.MIN]),
      (v: string) =>
        v.length < FIELD_LENGTH.PLAYLIST.MAX || this.$t('playlist.rules.too-long', [FIELD_LENGTH.PLAYLIST.MAX])
    ];
  }

  openPopup(): void {
    this.showCreateNewPlaylistPopup = true;
  }

  closePopup(): void {
    this.showCreateNewPlaylistPopup = false;
    this.newPlaylistTitle = '';
  }

  async createPlaylist(): Promise<void> {
    this.isPlaylistCreatingLoading = true;
    await PlaylistModule.createNew({ title: this.newPlaylistTitle });
    this.isPlaylistCreatingLoading = false;
    this.closePopup();
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';
@size: 300px;

.playlists {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, @size);
    justify-content: space-evenly;
    gap: 20px;
    grid-auto-rows: @size;
  }

  &__create-new {
    width: 100%;
    height: 100%;
    border: 2px solid @dark-purple;
    background: rgba(@dark-purple, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    transition: background 0.15s ease-in;
    will-change: background;
    cursor: pointer;

    &:hover {
      background: rgba(@dark-purple, 0.5);
    }
  }
}
</style>
