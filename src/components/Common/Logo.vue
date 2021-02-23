<template>
  <div class="logo" :class="[size]">
    <img src="@/assets/images/svg/logo.svg" svg-inline />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

enum LogoSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large'
}

const DEFAULT_SIZE_PROP_OPTIONS = { default: false, type: Boolean };

@Component
export default class Logo extends Vue {
  @Prop(DEFAULT_SIZE_PROP_OPTIONS)
  small!: boolean;

  @Prop(DEFAULT_SIZE_PROP_OPTIONS)
  medium!: boolean;

  @Prop(DEFAULT_SIZE_PROP_OPTIONS)
  large!: boolean;

  @Prop(DEFAULT_SIZE_PROP_OPTIONS)
  extraLarge!: boolean;

  get size(): LogoSize {
    const styles = [
      { class: LogoSize.Small, value: this.small },
      { class: LogoSize.Medium, value: this.medium },
      { class: LogoSize.Large, value: this.large },
      { class: LogoSize.ExtraLarge, value: this.extraLarge }
    ];
    const activeStyles = styles.filter(style => style.value);

    return activeStyles.length ? activeStyles[activeStyles.length - 1].class : LogoSize.Medium;
  }
}
</script>

<style lang="less" scoped>
@small: 30px;
@medium: 50px;
@large: 70px;
@extra-large: 100px;

.size(@size) {
  width: @size;
  height: @size;

  svg {
    width: @size;
    height: @size;
  }
}

.logo {
  display: flex;
  align-items: center;

  width: 100%;
  height: auto;
  &.medium {
    .size(@medium);
  }

  &.small {
    .size(@small);
  }

  &.large {
    .size(@large);
  }

  &.extra-large {
    .size(@extra-large);
  }

  svg {
    outline: none;
  }
}
</style>
