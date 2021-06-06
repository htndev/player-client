<template>
  <main class="browse">
    <h1>Browse</h1>
    <q-input v-model="search" />
  </main>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Browse extends Vue {
  search = '';
}
</script>
