import { passport } from '@/common/apollo-clients';
import { CLIENTS, EMPTY_TOKENS, PLAYER_REDIRECT_QUERY_PARAM } from '@/common/constants';
import { redirect } from '@/common/redirect';
import { GraphQLError, Nullable, StatusType, Tokens, User as UserType } from '@/common/types';
import store from '@/store';
import { HttpStatus, isNil, isNull } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule {
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
  LOGOUT() {
    this.identity = null;
    this.tokens = { ...EMPTY_TOKENS };
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
  async initUser() {
    await this.fetchTokens();
    await this.identify();
  }

  @Action
  async fetchTokens() {
    try {
      const { data, errors } = await passport.query<{ tokens: Tokens }>({
        query: require(`@/graphql/Tokens.gql`)
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
        query: require(`@/graphql/Me.gql`)
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
  async logout() {
    try {
      const { errors } = await passport.mutate<{ logout: StatusType }>({
        mutation: require(`@/graphql/Logout.gql`)
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
