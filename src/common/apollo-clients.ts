import { ENDPOINTS } from '@/common/constants';
import { UserModule } from '@/store/modules/user';
import { ApiEndpoint, createApolloClient } from '@xbeat/toolkit';

const passport = createApolloClient(`${ENDPOINTS.PASSPORT}/v1/graphql`, ApiEndpoint.Passport, UserModule);

export { passport };
