<template>
  <div class="not-found">
    <h1>404</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {}
</script>

<style lang="less" scoped>
.not-found {
}
</style>
