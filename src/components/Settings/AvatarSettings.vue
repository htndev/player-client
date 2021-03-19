<template>
  <section class="avatar settings">
    <q-avatar size="100px" class="avatar-bg" text-color="white">
      <span v-if="!avatar" class="no-select">{{ usernameCapitalLetter }}</span>
      <template v-else>
        <img :src="avatar" v-if="isAvatarLoading" />
        <q-spinner v-else />
      </template>
    </q-avatar>
    <span>{{ $t('settings.avatar.section.max-file-size', { size: '1 Mb' }) }}</span>
    <q-btn-dropdown :label="$t('settings.avatar.section.update')" class="q-mt-md" color="deep-purple-4">
      <q-list>
        <q-item clickable v-close-popup @click="uploadFile">
          <q-item-section>{{ $t('settings.avatar.section.upload') }}</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="removeAvatar">
          <q-item-section>{{ $t('settings.avatar.section.remove') }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <image-cropper-popup v-model="showCropPopup" :image="editingFile" @cropped="cropped" :loading="cropButtonLoading" />
  </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import ImageCropperPopup from '@/components/Common/ImageCropperPopup.vue';
import Avatar from '@/components/Common/Avatar.vue';
import { UserModule } from '@/store/modules/user';
import { isNil, Nullable } from '@xbeat/toolkit';

const MAX_AVATAR_SIZE = 1000000;

@Component({
  components: { Avatar, ImageCropperPopup }
})
export default class AvatarSettings extends Vue {
  isAvatarLoading = false;
  showCropPopup = false;
  cropButtonLoading = false;

  editingFile: Nullable<File> = null;

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

  async uploadFile() {
    const fileUploader = document.createElement('input');
    fileUploader.type = 'file';
    fileUploader.accept = 'image/x-png,image/gif,image/jpeg';

    fileUploader.onchange = async () => {
      const files = fileUploader.files;
      if (!files) {
        return;
      }

      const [file] = [...files];
      if (file.size > MAX_AVATAR_SIZE) {
        this.$q.notify({ message: 'File is too big.', type: 'negative', position: 'bottom-right' });
        return;
      }

      this.editingFile = file;
      this.showCropPopup = true;
      fileUploader.remove();
    };

    fileUploader.click();
  }

  async cropped(avatar: Blob) {
    this.cropButtonLoading = true;
    await UserModule.updateAvatar(avatar);
    this.cropButtonLoading = false;
    this.showCropPopup = false;
  }

  async removeAvatar() {
    await UserModule.updateAvatar(null);
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
