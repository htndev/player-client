<template>
  <container class="general settings" size="half" align="left">
    <settings-confirmation-field
      v-model="username"
      :label="$t('username')"
      :rules="usernameRules"
      :max-length="maxLegth.username"
      @update="updateUsername"
    />
  </container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SettingsConfirmationField from '@/components/Settings/SettingsConfirmationField.vue';
import Container from '@/components/Common/Container.vue';
import { UserModule } from '@/store/modules/user';
import { ExistsType, Nullable, User } from '@/common/types';
import { TranslateResult } from 'vue-i18n';
import { usernameRegexp, FIELD_LENGTH } from '@xbeat/toolkit';

@Component({ components: { SettingsConfirmationField, Container } })
export default class GeneralSettings extends Vue {
  private rules = {
    notEmpty: (v: string) => !!v.length || this.$t('errors.not-empty'),
    minLength: (length: number) => (v: string) => v.length >= length || this.$t('errors.min-length', { length }),
    maxLength: (length: number) => (v: string) => v.length <= length || this.$t('errors.max-length', { length }),
    fitPattern: (pattern: () => RegExp) => (v: string) =>
      pattern().test(v) || this.$t('settings.errors.username-pattern'),
    userExists: (field: 'username' | 'email') => async (v: string) => {
      const {
        data: {
          userExists: { exists }
        }
      } = await this.$apollo.query<{ userExists: ExistsType }>({
        query: require('@/graphql/UserExists.gql'),
        variables: {
          search: { [field]: v }
        }
      });

      return exists || this[field] !== v || this.$t('settings.errors.username');
    }
  };

  maxLegth = {
    username: FIELD_LENGTH.USERNAME.MAX
  };

  get user(): Nullable<User> {
    return UserModule.user;
  }

  get username(): string {
    return this.user ? this.user.username : '';
  }

  get email(): string {
    return this.user ? this.user.email : '';
  }

  get usernameRules(): ((value: string) => true | TranslateResult | Promise<boolean | TranslateResult>)[] {
    return [
      this.rules.notEmpty,
      this.rules.minLength(FIELD_LENGTH.USERNAME.MIN),
      this.rules.maxLength(FIELD_LENGTH.USERNAME.MAX),
      this.rules.fitPattern(usernameRegexp),
      this.rules.userExists('username')
    ];
  }

  async updateUsername(value: string) {
    console.log(value);
  }
}
</script>

<style lang="less" scoped></style>
