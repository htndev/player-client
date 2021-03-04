<template>
  <q-form class="q-mb-sm">
    <q-input
      v-model="internalValue"
      ref="field"
      outlined
      lazy-rules
      :label="label"
      :rules="rules"
      :maxlength="maxLength"
      :loading="loading"
      @focus="onFocusChanged(true)"
      @blur="onFocusChanged(false)"
    />
    <transition name="fade">
      <div v-show="showButtons" class="q-mt-sm">
        <q-btn
          label="Update"
          text-color="white"
          :style="{ background: updateButtonColor }"
          :disable="hasError()"
          @click="update"
        />
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
  $refs!: { field: any };
  updateButtonColor = colors.darkPurple;
  focused = false;
  padding = 'q-pt-sm';

  @Prop({ type: String })
  value!: string;

  @Prop({ type: String, default: '' })
  label!: string;

  @Prop({ type: Array, default: () => [] })
  rules!: Function[];

  @Prop({ type: Number, default: 255 })
  maxLength!: number;

  @Prop({ type: Boolean, default: false })
  loading!: boolean;

  internalValue = this.value;

  get showButtons(): boolean {
    return this.focused || this.internalValue !== this.value;
  }

  get valueChanged(): boolean {
    return this.internalValue !== this.value;
  }

  hasError() {
    return this.$refs.field ? this.$refs.field.hasError : true;
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

  update() {
    if (!this.valueChanged) {
      return;
    }

    if (this.hasError()) {
      return;
    }

    this.$emit('update', this.internalValue);
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
