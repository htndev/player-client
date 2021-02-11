<template>
  <q-header elevated class="header-bg">
    <q-toolbar>
      <q-btn flat dense round @click="changedDrawer" aria-label="Menu" icon="menu" />
      <logo small />
      <q-space />
      <q-avatar :color="avatarColor">
        <span v-if="!avatar">{{ username }}</span>
        <template v-else>
          <img @load="onAvatarLoaded" :src="avatar" v-if="avatarLoaded" />
          <q-spinner v-else />
        </template>
      </q-avatar>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Logo from '@/components/Common/Logo.vue';
import { UserModule } from '@/store/modules/user';
import { AppColors, Nullable, User } from '@/common/types';
import { isNil } from '@/common/object';

@Component({
  components: { Logo }
})
export default class TheHeader extends Vue {
  avatarLoaded = false;

  get avatarColor(): AppColors {
    return 'purple';
  }

  get user(): Nullable<User> {
    return UserModule.user;
  }

  get avatar(): Nullable<string> {
    return UserModule.avatar;
  }

  get username(): string {
    return UserModule.isUserInitialized ? (UserModule.hasAvatar ? '' : (this.user as User).username) : '';
  }

  changedDrawer() {
    console.log('Changed drawer');
  }

  created() {
    // console.log(this.)
  }

  onAvatarLoaded(data: any) {
    console.log(data);
    console.log('avatar loaded');
    this.avatarLoaded = true;
  }

  @Watch('avatar')
  onAvatarChanged(newValue: Nullable<string>) {
    if (isNil(newValue)) {
      return;
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.header-bg {
  background: @purple;
}
</style>
