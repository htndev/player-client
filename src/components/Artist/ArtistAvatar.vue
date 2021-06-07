<template>
  <q-avatar size="150px">
    <q-img :src="saveImage" ratio="1" />
  </q-avatar>
</template>

<script lang="ts">
import { isNull, Nullable } from '@xbeat/toolkit';
import { Vue, Component, Prop } from 'vue-property-decorator';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import DEFAULT_ARTIST_PLACEHOLDER from '@/assets/images/ARTIST-AVATAR-FALLBACK.png';

@Component
export default class Artist extends Vue {
  @Prop()
  avatar!: Nullable<string>;

  get saveImage(): string {
    return !isNull(this.avatar) ? this.avatar : DEFAULT_ARTIST_PLACEHOLDER;
  }
}
</script>
