<template>
  <div class="player-timeline">
    <q-slider v-model="currentValue" :min="min" :max="max" :step="step" color="purple" v-on="$listeners" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';

@Component
export default class PlayerTimeline extends Vue {
  @Prop({ type: Number, default: 0 })
  min!: number;
  @Prop({ type: Number, default: 1 })
  max!: number;
  @Prop({ type: Number, default: 1 })
  step!: number;

  @PropSync('value', { type: Number, default: 0 })
  currentValue!: number;
}
</script>

<style lang="less" scoped>
.player-timeline {
  width: 100%;
}
</style>
