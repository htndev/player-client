<template>
  <q-form>
    <q-input
      v-model="internalValue"
      outlined
      :label="$t('username')"
      :rules="rules"
      @focus="onFocusChanged(true)"
      @blur="onFocusChanged(false)"
    />
    <transition name="fade">
      <div v-show="showButtons" class="q-mt-xs">
        <q-btn label="Update" text-color="white" :style="{ background: updateButtonColor }" />
        <q-btn label="Cancel" flat @click="cancel" />
      </div>
    </transition>
  </q-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { colors } from '@/common/colors';

@Component
export default class SettingsConfirmationField extends Vue {
  updateButtonColor = colors.darkPurple;
  focused = false;

  @Prop({ type: String })
  value!: string;

  @Prop({ type: Array, default: () => [] })
  rules!: Function[];

  internalValue = this.value;

  get showButtons(): boolean {
    return this.focused || this.internalValue !== this.value;
  }

  @Watch('value')
  onValueChanged(value: string) {
    this.internalValue = value;
  }

  onFocusChanged(isFocused: boolean) {
    this.focused = isFocused;
  }

  cancel() {
    this.internalValue = this.value;
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
