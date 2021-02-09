import { ENDPOINTS } from '@/common/constants';
import { UserModule } from '@/store/modules/user';
import { setContext } from '@apollo/client/link/context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink as createApolloHttpLink } from 'apollo-link-http';

import { ApiEndpoint } from './constants';

const HTTP_LINKS_OPTIONS = {
  credentials: 'include'
};

const appendAuthToken = (token: ApiEndpoint): ApolloLink => {
  const context = setContext((_, { headers }) => {
    const authToken = UserModule.tokens[token];

    return {
      headers: {
        ...headers,
        ...(!!authToken && { authorization: `Bearer ${authToken}` })
      }
    };
  });

  return context as never;
};

const createApolloClient = (link: ApolloLink, endpoint: ApiEndpoint) =>
  new ApolloClient({
    link: appendAuthToken(endpoint).concat(link),
    connectToDevTools: true,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  });

const createHttpLink = (uri: string) => createApolloHttpLink({ ...HTTP_LINKS_OPTIONS, uri });

const passport = createApolloClient(createHttpLink(`${ENDPOINTS.PASSPORT}/v1/graphql`), ApiEndpoint.Passport);

export { passport };
