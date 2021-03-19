<template>
  <section class="security settings">
    <h3 class="q-mt-none q-mb-md">{{ $t('settings.security.name') }}</h3>
    <q-form @submit.prevent="updatePassword">
      <q-input
        v-model="oldPassword"
        autocomplete="password"
        class="q-mb-md"
        ref="oldPassword"
        outlined
        :rules="fieldRules.oldPassword"
        :type="showOldPassword ? 'text' : 'password'"
        :label="$t('settings.security.old-password')"
        :maxlength="passwordMaxLegth"
      >
        <template #append>
          <q-icon
            :name="showOldPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showOldPassword = !showOldPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="newPassword"
        class="q-mb-md"
        autocomplete="new-password"
        ref="newPassword"
        outlined
        :rules="fieldRules.newPassword"
        :type="showNewPassword ? 'text' : 'password'"
        :label="$t('settings.security.new-password')"
        :maxlength="passwordMaxLegth"
      >
        <template #append>
          <q-icon
            :name="showNewPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showNewPassword = !showNewPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="newPasswordConfirmation"
        autocomplete="new-password"
        ref="newPasswordConfirmation"
        outlined
        :rules="fieldRules.newPasswordConfirmation"
        :type="showNewPasswordConfirmation ? 'text' : 'password'"
        :label="$t('settings.security.new-password-confirmation')"
        :maxlength="passwordMaxLegth"
      >
        <template #append>
          <q-icon
            :name="showNewPasswordConfirmation ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showNewPasswordConfirmation = !showNewPasswordConfirmation"
          />
        </template>
      </q-input>

      <q-btn
        color="deep-purple-4"
        class="q-mt-lg"
        type="submit"
        :label="$t('update')"
        :disable="hasAnyError"
        :loading="updateButtonLoading"
        @click="updatePassword"
      />
    </q-form>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { FIELD_LENGTH, passwordRegexp } from '@xbeat/toolkit';
import { TranslateResult } from 'vue-i18n';
import { UserModule } from '@/store/modules/user';
import { ERROR_NOTIFICATION_OPTIONS, SUCCESS_NOTIFICATION_OPTIONS } from '@/common/constants/constants';

type ValidatorFunction = (v: string) => boolean | TranslateResult;
type Validators = 'NOT_EMPTY' | 'MIN_LENGTH' | 'MAX_LENGTH' | 'PASSWORD_PATTERN' | 'SHOULD_EQUAL_PASSWORD';
type PasswordFields = 'oldPassword' | 'newPassword' | 'newPasswordConfirmation';

@Component
export default class SecuritySettings extends Vue {
  $refs!: { oldPassword: any; newPassword: any; newPasswordConfirmation: any };
  oldPassword = '';
  newPassword = '';
  newPasswordConfirmation = '';
  showOldPassword = false;
  showNewPassword = false;
  showNewPasswordConfirmation = false;
  passwordMaxLegth = FIELD_LENGTH.PASSWORD.MAX;
  updateButtonLoading = false;

  get RULES(): { [k in Validators]: ValidatorFunction } {
    return {
      NOT_EMPTY: (v: string) => !!v.length || this.$t('errors.not-empty'),
      MIN_LENGTH: (v: string) =>
        v.length > FIELD_LENGTH.PASSWORD.MIN || this.$t('errors.min-length', { length: FIELD_LENGTH.PASSWORD.MIN }),
      MAX_LENGTH: (v: string) =>
        v.length < FIELD_LENGTH.PASSWORD.MAX || this.$t('errors.max-length', { length: FIELD_LENGTH.PASSWORD.MAX }),
      PASSWORD_PATTERN: (v: string) => passwordRegexp().test(v) || this.$t('settings.errors.password-pattern'),
      SHOULD_EQUAL_PASSWORD: (v: string) => v === this.newPassword || this.$t('settings.errors.password-confirmation')
    };
  }

  get fieldRules(): { [k in PasswordFields]: ValidatorFunction[] } {
    return {
      oldPassword: [this.RULES.NOT_EMPTY],
      newPassword: [this.RULES.NOT_EMPTY, this.RULES.MIN_LENGTH, this.RULES.MAX_LENGTH, this.RULES.PASSWORD_PATTERN],
      newPasswordConfirmation: [this.RULES.NOT_EMPTY, this.RULES.SHOULD_EQUAL_PASSWORD]
    };
  }

  private validate(value: string, validators: ValidatorFunction[]): boolean {
    return !validators.every(validator => validator(value) === true);
  }

  get hasError(): { [k in PasswordFields]: boolean } {
    return {
      oldPassword: this.validate(this.oldPassword, this.fieldRules.oldPassword),
      newPassword: this.validate(this.newPassword, this.fieldRules.newPassword),
      newPasswordConfirmation: this.validate(this.newPasswordConfirmation, this.fieldRules.newPasswordConfirmation)
    };
  }

  get hasAnyError(): boolean {
    return Object.values(this.hasError).some(v => v === true);
  }

  triggerFieldValidation(): void {
    Object.values(this.$refs).forEach(ref => ref.validate());
  }

  resetFieldsValidation(): void {
    Object.values(this.$refs).forEach(ref => {
      ref.resetValidation();
    });
  }

  resetFields() {
    this.oldPassword = this.newPassword = this.newPasswordConfirmation = '';
    this.showOldPassword = this.showNewPassword = this.showNewPasswordConfirmation = false;
    this.$nextTick(() => this.resetFieldsValidation());
  }

  async updatePassword() {
    this.triggerFieldValidation();

    if (this.hasAnyError) {
      return;
    }

    if (this.oldPassword === this.newPassword) {
      this.$q.notify({
        ...ERROR_NOTIFICATION_OPTIONS,
        message: this.$t('settings.errors.password-same') as string
      });
      return;
    }

    this.updateButtonLoading = true;
    try {
      const response = await UserModule.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPasswordConfirmation: this.newPasswordConfirmation
      });

      if (response.graphQLErrors) {
        throw response.graphQLErrors;
      }

      this.$q.notify({
        ...SUCCESS_NOTIFICATION_OPTIONS,
        message: this.$t('settings.security.password-updated') as string
      });

      this.resetFields();
    } catch (e) {
      const [{ message }] = e;
      if (message === 'Old password is wrong') {
        this.$q.notify({
          ...ERROR_NOTIFICATION_OPTIONS,
          message: this.$t('settings.errors.wrong-old-password') as string
        });
      }
    } finally {
      this.updateButtonLoading = false;
    }
  }
}
</script>

<style lang="less" scoped>
.security {
  width: 350px;

  @media all and (max-width: 1100px) {
    widows: 100%;
  }
}
</style>
