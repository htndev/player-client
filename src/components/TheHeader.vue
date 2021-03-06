<template>
  <q-header elevated class="header">
    <q-toolbar>
      <q-btn flat dense round @click="changedDrawer" aria-label="Menu" icon="menu" />
      <router-link to="/">
        <logo small />
      </router-link>
      <q-space />
      <avatar :avatar="avatar" :username="username">
        <template #onclick>
          <q-item dense class="items-center justify-end">
            <q-item-label lines="1" class="text-weight-bold font-size-16 full-width text-right">
              <router-link :to="`/u/${username}`" class="text-decoration-none color-secondary">
                {{ username }}
                <q-tooltip
                  v-if="showUsernaneTooltip"
                  anchor="top middle"
                  self="bottom middle"
                  content-class="bg-dark-purple"
                >
                  {{ username }}
                </q-tooltip>
              </router-link>
            </q-item-label>
          </q-item>
          <q-item class="items-center justify-end" clickable>
            <q-item-label lines="1">
              <router-link to="/settings" class="text-decoration-none color-black font-size-14">
                {{ $t('settings.title') }}
              </router-link>
            </q-item-label>
          </q-item>
          <q-item class="items-center justify-end" clickable>
            <q-item-label lines="1">
              <a :href="artistUrl" class="text-decoration-none color-black">{{ $t('go-to-artist') }}</a>
            </q-item-label>
          </q-item>
          <q-item class="items-center justify-end" clickable>
            <q-item-label lines="1" @click="logout">{{ $t('logout') }}</q-item-label>
          </q-item>
        </template>
      </avatar>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Logo from '@/components/Common/Logo.vue';
import Avatar from '@/components/Common/Avatar.vue';
import { UserModule } from '@/store/modules/user';
import { DrawerModule } from '@/store/modules/drawer';
import { User } from '@/common/types';
import { Nullable } from '@xbeat/toolkit';
import { CLIENTS } from '@/common/constants/constants';

@Component({
  components: { Logo, Avatar }
})
export default class TheHeader extends Vue {
  artistUrl = CLIENTS.ARTIST;

  get user(): Nullable<User> {
    return UserModule.user;
  }

  get username(): string {
    return this.user ? this.user.username : '';
  }

  get avatar(): string | null {
    return this.user ? this.user.avatar : '';
  }

  get showUsernaneTooltip(): boolean {
    return this.username.length > 12;
  }

  changedDrawer() {
    DrawerModule.toggle();
  }

  logout() {
    UserModule.logout();
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.header {
  background: @purple;
}
</style>
