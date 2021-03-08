<template>
  <container class="general settings" size="half" align="left">
    <settings-confirmation-field
      v-model="username"
      :label="$t('username')"
      :rules="usernameRules"
      :loading="loading.username"
      :max-length="maxLegth.username"
      @update="updateUsername"
    />
    <settings-confirmation-field
      v-model="email"
      :label="$t('email')"
      :rules="emailRules"
      :loading="loading.email"
      :max-length="maxLegth.email"
      @update="updateEmail"
    />
    <q-select
      outlined
      v-model="currentLanguage"
      :options="languages"
      :loading="languageLoading"
      :label="$t('settings.language')"
    >
      <template #prepend>
        <q-icon name="language" />
      </template>
    </q-select>
  </container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SettingsConfirmationField from '@/components/Settings/SettingsConfirmationField.vue';
import Container from '@/components/Common/Container.vue';
import { UserModule } from '@/store/modules/user';
import { User } from '@/common/types';
import { TranslateResult } from 'vue-i18n';
import { usernameRegexp, FIELD_LENGTH } from '@xbeat/toolkit';
import UserExistsQuery from '@/graphql/UserExists.gql';
import { ExistsType } from '@xbeat/client-toolkit';
import { Nullable } from '@xbeat/toolkit';
import { isEmail } from '@/common/utils/is-email';
import { LanguageWithName } from '@/common/constants/language';
import { PreferencesModule } from '@/store/modules/preferences';

type Rule = (value: string) => true | TranslateResult | Promise<boolean | TranslateResult>;

@Component({ components: { SettingsConfirmationField, Container } })
export default class GeneralSettings extends Vue {
  loading = {
    username: false,
    email: false
  };
  private rules = {
    notEmpty: (v: string) => !!v.length || this.$t('errors.not-empty'),
    minLength: (length: number) => (v: string) => v.length >= length || this.$t('errors.min-length', { length }),
    maxLength: (length: number) => (v: string) => v.length <= length || this.$t('errors.max-length', { length }),
    fitPattern: (pattern: () => RegExp) => (v: string) =>
      pattern().test(v) || this.$t('settings.errors.username-pattern'),
    userExists: (field: 'username' | 'email') => async (value: string) => {
      const currentUsername = this[field];

      if (currentUsername === value) {
        return true;
      }

      this.loading[field] = true;

      const {
        data: {
          userExists: { exists }
        }
      } = await this.$apollo.query<{ userExists: ExistsType }>({
        query: UserExistsQuery,
        variables: {
          search: { [field]: value }
        }
      });

      this.loading[field] = false;

      return !exists || this.$t(`settings.errors.${field}`);
    }
  };

  maxLegth = {
    username: FIELD_LENGTH.USERNAME.MAX,
    email: FIELD_LENGTH.EMAIL.MAX
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

  get languages() {
    return PreferencesModule.languages;
  }

  get languageLoading(): boolean {
    return PreferencesModule.loading.language;
  }

  get currentLanguage(): LanguageWithName {
    return PreferencesModule.currentLanguage;
  }

  set currentLanguage({ value }: LanguageWithName) {
    PreferencesModule.changeLanguage(value);
  }

  get usernameRules(): Rule[] {
    return [
      this.rules.notEmpty,
      this.rules.minLength(FIELD_LENGTH.USERNAME.MIN),
      this.rules.maxLength(FIELD_LENGTH.USERNAME.MAX),
      this.rules.fitPattern(usernameRegexp),
      this.rules.userExists('username')
    ];
  }

  get emailRules(): Rule[] {
    return [
      this.rules.notEmpty,
      this.rules.minLength(FIELD_LENGTH.EMAIL.MIN),
      this.rules.maxLength(FIELD_LENGTH.EMAIL.MAX),
      (v: string) => isEmail(v) || this.$t('settings.errors.email-pattern'),
      this.rules.userExists('email')
    ];
  }

  async updateUsername(username: string) {
    this.loading.username = true;
    await UserModule.updateUsername(username);
    this.loading.username = false;
  }

  async updateEmail(email: string) {
    this.loading.email = true;
    await UserModule.updateEmail(email);
    this.loading.email = false;
  }
}
</script>

<style lang="less" scoped></style>
