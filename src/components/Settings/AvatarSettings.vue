<template>
  <section class="avatar settings">
    <q-avatar size="100px" class="avatar-bg" text-color="white">
      <span v-if="!avatar" class="no-select">{{ usernameCapitalLetter }}</span>
      <template v-else>
        <img :src="avatar" v-if="isAvatarLoading" />
        <q-spinner v-else />
      </template>
    </q-avatar>
    <span>Avatar file should not exceed 1 Mb</span>
    <q-btn-dropdown label="Update avatar" class="q-mt-md">
      <q-list>
        <q-item clickable v-close-popup>
          <q-item-section>Upload new avatar</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Remove avatar</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Avatar from '@/components/Common/Avatar.vue';
import { UserModule } from '@/store/modules/user';
import { isNil, Nullable } from '@xbeat/toolkit';

@Component({
  components: { Avatar }
})
export default class AvatarSettings extends Vue {
  isAvatarLoading = false;

  get avatar() {
    return UserModule.avatar;
  }

  get username(): string {
    return UserModule.user ? UserModule.user.username : '';
  }

  get usernameCapitalLetter(): string {
    return this.username[0] ? this.username[0] : '';
  }

  @Watch('avatar', { immediate: true })
  onAvatarChanged(avatar: Nullable<string>) {
    if (isNil(avatar)) {
      return;
    }
    const img = document.createElement('img');

    img.onload = () => {
      this.isAvatarLoading = true;
    };

    img.src = avatar;
    this.isAvatarLoading = false;
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar {
    &-bg {
      background: @dark-purple;
    }
  }
}
</style>
