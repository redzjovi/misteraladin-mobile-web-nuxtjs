import { Context } from '@nuxt/types'

export default function ({
  $axios,
  i18n
}: Context
) {
  $axios.onRequest(config => {
    config.headers.common['Accept-Language'] = i18n.locale
  })
  $axios.interceptors.response.use(async (response) => {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    return response;
  });
}
