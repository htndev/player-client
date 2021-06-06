import { initialize } from '@/common/utils/initialize-store';
import { PreferencesModule } from '@/store/modules/preferences';
import { UserModule } from '@/store/modules/user';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import { PlaylistModule } from './../store/modules/playlist';

Vue.use(VueRouter);

const Route = {
  Playlist: 'Playlist',
  Playlists: 'Playlists',
  LikedSongs: 'LikedSongs',
  Browse: 'Browse',
  Settings: 'Settings',
  About: 'About',
  Home: 'Home',
  NotFound: 'NotFound'
};

const routes: Array<RouteConfig> = [
  {
    path: '',
    alias: '/p',
    name: Route.Playlists,
    component: () => import(/* webpackChunkName: "playlists" */ '../views/Playlists.vue')
  },
  {
    path: '/p/:id',
    name: Route.Playlist,
    component: () => import(/* webpackChunkName: "playlist" */ '../views/Playlist.vue')
  },
  {
    path: '/about',
    name: Route.About,
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/settings',
    name: Route.Settings,
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/browse',
    name: Route.Browse,
    component: () => import(/* webpackChunkName: "browse" */ '../views/Browse.vue')
  },
  {
    path: '/liked',
    name: Route.LikedSongs,
    component: () => import(/* webpackChunkName: "liked" */ '../views/Liked.vue')
  },
  {
    path: '*',
    alias: '404',
    name: Route.NotFound,
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async ({ name, params: { id } }, from, next) => {
  if (!UserModule.isUserInitialized) {
    await initialize(UserModule, PreferencesModule, PlaylistModule);
  }

  if (name === Route.Playlist) {
    if (!PlaylistModule.isFetchingPlaylists) {
      const [playlist] = await PlaylistModule.findPlaylists({ url: id });

      if (!playlist) {
        return next({ name: Route.NotFound });
      }

      await PlaylistModule.setCurrentPlaylist({ id });
    }
  }
  return next();
});

export default router;
