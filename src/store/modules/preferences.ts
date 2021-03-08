import { passport } from '@/common/apollo/passport';
import { Language, LanguageName, LanguageWithName } from '@/common/constants/language';
import { Preferences as PreferencesType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import AvailableLanguages from '@/graphql/AvailableLanguages.gql';
import GetPreferences from '@/graphql/GetPreferences.gql';
import ChangeLanguage from '@/graphql/ChangeLanguage.gql';
import i18n from '@/plugins/i18n';
import store from '@/store';
import Vue from 'vue';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'preferences', namespaced: true })
export class Preferences extends VuexModule implements InitializeStore {
  language = Language.EN;
  _availableLanguages: Language[] = [];

  loading = {
    language: false
  };

  get availableLanguages(): Language[] {
    return this._availableLanguages;
  }

  get currentLanguage(): LanguageWithName {
    return {
      value: this.language,
      label: LanguageName[this.language]
    };
  }

  get languages(): LanguageWithName[] {
    return Object.values(Language).map((key: Language) => ({
      value: key,
      label: LanguageName[key]
    }));
  }

  @Mutation
  SET_AVAILABLE_LANGUAGES(languages: Language[]) {
    this._availableLanguages = languages;
  }

  @Mutation
  SET_CURRENT_LANGUAGE(language: Language) {
    i18n.locale = language;
    this.language = language;
  }

  @Mutation
  LANGUAGE_LOADING_STARTED() {
    Vue.set(this.loading, 'language', true);
  }

  @Mutation
  LANGUAGE_LOADING_FINISHED() {
    Vue.set(this.loading, 'language', false);
  }

  @Action
  async initialize() {
    const {
      data: {
        availableLanguages: { languages }
      }
    } = await passport.query<{ availableLanguages: { languages: Language[] } }>({
      query: AvailableLanguages
    });

    this.SET_AVAILABLE_LANGUAGES(languages);

    const {
      data: { getPreferences: preferences }
    } = await passport.query<{ getPreferences: PreferencesType }>({
      query: GetPreferences
    });

    this.SET_CURRENT_LANGUAGE(preferences.language);
  }

  @Action
  async changeLanguage(language: Language) {
    this.LANGUAGE_LOADING_STARTED();

    await passport.mutate({
      mutation: ChangeLanguage,
      variables: {
        language
      }
    });

    this.LANGUAGE_LOADING_FINISHED();
    this.SET_CURRENT_LANGUAGE(language);
  }
}

export const PreferencesModule = getModule(Preferences);
