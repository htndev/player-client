<template>
  <container class="general settings" size="half" align="left">
    <settings-confirmation-field v-model="username" />
  </container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SettingsConfirmationField from '@/components/Settings/SettingsConfirmationField.vue';
import Container from '@/components/Common/Container.vue';
import { UserModule } from '@/store/modules/user';
import { Nullable, User } from '@/common/types';

@Component({ components: { SettingsConfirmationField, Container } })
export default class GeneralSettings extends Vue {
  get user(): Nullable<User> {
    return UserModule.user;
  }

  get username(): string {
    return this.user ? this.user.username : '';
  }

  get email(): string {
    return this.user ? this.user.email : '';
  }
}
</script>

<style lang="less" scoped></style>
