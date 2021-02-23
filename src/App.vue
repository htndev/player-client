<template>
  <q-layout view="hHh LpR fFf">
    <the-header />
    <navigation-drawer />
    <q-page-container>
      <container>
        <router-view />
      </container>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TheHeader from '@/components/TheHeader.vue';
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer.vue';
import Container from '@/components/Common/Container.vue';
import { UserModule } from '@/store/modules/user';

@Component({ components: { TheHeader, NavigationDrawer, Container } })
export default class App extends Vue {
  async created() {
    UserModule.initUser();
  }
}
</script>
