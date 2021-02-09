import { redirect } from '@/common/redirect';
import { HttpStatus, CLIENTS } from '@/common/constants';
import { passport } from '@/common/apollo-clients';
import { Tokens, GraphQLTypename, Nullable, GraphQLError, User as UserType } from '@/common/types';
import { excludeTypename } from '@/common/object';
import store from '@/store';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule {
  private identity: Nullable<UserType> = null;

  tokens: Tokens = {
    passport: '',
    studio: ''
  };

  get user(): Nullable<UserType> {
    return this.identity;
  }

  @Mutation
  SET_TOKENS(tokens: Tokens) {
    this.tokens = tokens;
  }

  @Mutation
  SET_USER(user: UserType) {
    this.identity = { ...user };
  }

  @Action
  async initUser() {
    await this.fetchTokens();
    await this.identify();
  }

  @Action
  async fetchTokens() {
    try {
      const { data, errors } = await passport.query<{ tokens: Tokens & GraphQLTypename }>({
        query: require('@/graphql/Tokens.gql')
      });

      if (errors) {
        throw errors;
      }

      const tokens = excludeTypename(data.tokens);

      this.SET_TOKENS(tokens);
    } catch (e) {
      const [
        {
          extensions: {
            exception: { status }
          }
        }
      ] = e as GraphQLError[];

      if (status === HttpStatus.Unauthorized) {
        redirect(CLIENTS.ID);
        return;
      }
    }

    // const tokens = excludeTypename(response);

    // this.SET_TOKENS(tokens);
  }

  @Action
  async identify() {
    try {
      const { data, errors } = await passport.query({
        query: require('@/graphql/Me.gql')
      });
      console.log(data);
      console.log(errors);
    } catch (e) {
      console.log(e);
    }
  }
}

export const UserModule = getModule(User);
