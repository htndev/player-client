import { passport } from '@/common/apollo/passport';
import { studio } from '@/common/apollo/studio';
import { ApiEndpoint } from '@xbeat/toolkit';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

export const createProvider = () => {
  return new VueApollo({
    clients: {
      [ApiEndpoint.Passport]: passport,
      [ApiEndpoint.Studio]: studio
    },
    defaultClient: passport
  });
};
