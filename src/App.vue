<template>
  <q-layout view="hHh LpR fFf">
    <the-header />
    <navigation-drawer />
    <q-page-container class="app-container">
      <container>
        <router-view />
      </container>
      <player />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TheHeader from '@/components/TheHeader.vue';
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer.vue';
import Container from '@/components/Common/Container.vue';
import Player from '@/components/Player/Player.vue';

@Component({ components: { TheHeader, NavigationDrawer, Container, Player } })
export default class App extends Vue {}
</script>

<style lang="less" scoped>
.app-container {
  position: relative;
}
</style>
