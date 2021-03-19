import { passport } from '@/common/apollo/passport';
import { CLIENTS, EMPTY_TOKENS, PLAYER_REDIRECT_QUERY_PARAM } from '@/common/constants/constants';
import { InitializeStore } from '@/common/utils/initialize-store';
import { redirect } from '@/common/utils/redirect';
import { Tokens, User as UserType } from '@/common/types';
import LogoutMutation from '@/graphql/Logout.gql';
import MeQuery from '@/graphql/Me.gql';
import TokensQuery from '@/graphql/Tokens.gql';
import UpdateUserInfoMutation from '@/graphql/UpdateUserInfo.gql';
import UpdateAvatar from '@/graphql/UpdateAvatar.gql';
import ChangePassword from '@/graphql/ChangePassword.gql';
import store from '@/store';
import { GraphQLError, StatusType } from '@xbeat/client-toolkit';
import { HttpStatus, isNil, isNull, Nullable } from '@xbeat/toolkit';
import Vue from 'vue';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import MediaEndpoint from '@/common/endpoints/media';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule implements InitializeStore {
  private isUserFetching = false;
  private identity: Nullable<UserType> = null;

  tokens: Tokens = { ...EMPTY_TOKENS };

  get user(): Nullable<UserType> {
    return this.identity;
  }

  get hasAvatar(): boolean {
    return this.isUserInitialized ? !isNil(this.user?.avatar) : false;
  }

  get avatar(): Nullable<string> {
    return this.hasAvatar ? (this.user as UserType).avatar : null;
  }

  get isUserInitialized(): boolean {
    return !isNull(this.user);
  }

  @Mutation
  SET_TOKENS(tokens: Tokens) {
    this.tokens = tokens;
  }

  @Mutation
  SET_USER(user: UserType) {
    this.identity = { ...user };
  }

  @Mutation
  SET_AVATAR(avatar: Nullable<string>) {
    Vue.set(this.identity as UserType, 'avatar', avatar);
  }

  @Mutation
  LOGOUT() {
    this.identity = null;
    this.tokens = { ...EMPTY_TOKENS };
  }

  @Mutation
  SET_USERNAME(username: string) {
    Vue.set(this.identity as UserType, 'username', username);
  }

  @Mutation
  SET_EMAIL(email: string) {
    Vue.set(this.identity as UserType, 'email', email);
  }

  @Mutation
  USER_FETCHING_STARTED() {
    this.isUserFetching = true;
  }

  @Mutation
  USER_FETCHING_COMPLETED() {
    this.isUserFetching = false;
  }

  @Mutation
  USER_FETCHING_FAILED() {
    this.isUserFetching = false;
  }

  @Action
  async initialize() {
    await this.fetchTokens();
    await this.identify();
  }

  @Action
  async fetchTokens() {
    try {
      const { data, errors } = await passport.query<{ tokens: Tokens }>({
        query: TokensQuery
      });

      if (errors) {
        throw errors;
      }

      this.SET_TOKENS(data.tokens);
    } catch (e) {
      const [
        {
          extensions: {
            exception: { status }
          }
        }
      ] = e as GraphQLError[];

      if (status === HttpStatus.Unauthorized) {
        redirect(`${CLIENTS.ID}/${PLAYER_REDIRECT_QUERY_PARAM}`);
        return;
      }
    }
  }

  @Action
  async identify() {
    try {
      this.USER_FETCHING_STARTED();

      const { data, errors } = await passport.query<{ me: UserType }>({
        query: MeQuery
      });

      if (errors) {
        throw errors;
      }
      this.USER_FETCHING_COMPLETED();

      this.SET_USER(data.me);
    } catch (e) {
      this.USER_FETCHING_FAILED();
    }
  }

  @Action
  async updateUsername(username: string): Promise<void> {
    try {
      await passport.mutate<{ updateUserInfo: StatusType }>({
        mutation: UpdateUserInfoMutation,
        variables: {
          userInfo: {
            username
          }
        }
      });

      this.SET_USERNAME(username);
      await this.fetchTokens();
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async updateEmail(email: string): Promise<void> {
    try {
      await passport.mutate<{ updateUserInfo: StatusType }>({
        mutation: UpdateUserInfoMutation,
        variables: {
          userInfo: {
            email
          }
        }
      });

      this.SET_EMAIL(email);
      await this.fetchTokens();
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async updateAvatar(image: Nullable<Blob>) {
    try {
      let avatar = null;

      if (!isNull(image)) {
        const {
          data: {
            files: [avatarUrl]
          }
        } = await MediaEndpoint.uploadImage(image);
        avatar = avatarUrl;
      }

      await passport.mutate({ mutation: UpdateAvatar, variables: { avatar } });

      this.SET_AVATAR(avatar);
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async changePassword(passwordInput: { oldPassword: string; newPassword: string; newPasswordConfirmation: string }) {
    try {
      return await passport.mutate({ mutation: ChangePassword, variables: { passwordInput } });
    } catch (e) {
      return e;
    }
  }

  @Action
  async logout() {
    try {
      const { errors } = await passport.mutate<{ logout: StatusType }>({
        mutation: LogoutMutation
      });

      if (errors) {
        throw errors;
      }

      redirect(`${CLIENTS.ID}/${PLAYER_REDIRECT_QUERY_PARAM}`);
    } catch (e) {
      console.log(e);
    }
  }
}

export const UserModule = getModule(User);
