<template>
  <q-icon class="playing-indication" :class="[visible && 'visible']" :name="icon"></q-icon>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

const ICONS = ['volume_mute', 'volume_down', 'volume_up'];

@Component
export default class PlayingIndication extends Vue {
  private index = 0;
  private icon = ICONS[0];
  private interval = 0;

  @Prop({ type: Boolean, default: true })
  active!: boolean;

  @Prop({ type: Number, default: 500 })
  delay!: number;

  @Prop({ type: Boolean, default: true })
  visible!: boolean;

  @Watch('active', { immediate: true })
  onActiveChanged(isActive: boolean) {
    if (isActive) {
      this.startInterval();
      return;
    }

    clearInterval(this.interval);
    this.index = 0;
    this.icon = ICONS[0];
  }

  startInterval() {
    this.interval = window.setInterval(() => {
      this.setIcon();
    }, this.delay);
  }

  setIcon() {
    this.index = this.index + 1 !== ICONS.length ? this.index + 1 : 0;

    this.icon = ICONS[this.index];
  }
}
</script>

<style lang="less" scoped>
.playing-indication {
  opacity: 0;

  &.visible {
    opacity: 1;
  }
}
</style>
