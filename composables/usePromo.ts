import {
  reactive,
  ref,
  useContext,
  useRoute
} from '@nuxtjs/composition-api'
import useJson from '~/composables/useJson'
import { LandingPage as GeneralLandingPage } from '~/types/misteraladin/api/generals/landing-pages'

export interface Promo {
  code: string;
  dateFrom: string;
  dateTo: string;
  description: string;
  imageUrl: string;
  slug: string;
  title: string;
}

export default () => {
  const {
    $axios,
    $config,
    i18n
  } = useContext()
  const json = useJson()
  const $route = useRoute()

  const state = reactive({
    filter: {
      types: ref<string[]>([])
    },
    loading: ref(false),
    promos: ref<Promo[]>([])
  })

  const generalLandingPageToPromo = (glp: GeneralLandingPage): Promo => {
    let description = glp.description_en
    const slug = glp.name.replace(/\W/g, '').toLowerCase()

    if (i18n.locale === 'id') {
      description = glp.description
    }

    return {
      code: String(glp.id),
      dateFrom: glp.periode.from,
      dateTo: glp.periode.to,
      description: description ?? '',
      imageUrl: glp.banner_mobile,
      slug: slug + '-' + glp.id,
      title: glp.name
    }
  }

  const getPromoBySlug = (slug: string) => new Promise<Promo>((resolve, reject) => {
    $axios.get($config.generalApiUrl + '/landing-pages/' + slug.split('-').slice(0, -1).join('-'), {
      headers: {
        'X-Platform': 'mobile-web'
      }
    }).then(r => {
      resolve(
        generalLandingPageToPromo(r.data.data as GeneralLandingPage)
      )
    }).catch(e => {
      reject(e)
    })
  })

  const getPromos = () => {
    state.loading = true

    $axios.get($config.generalApiUrl + '/landing-pages', {
      headers: {
        'X-Platform': 'mobile-web'
      },
      params: stateToGeneralLandingPagesRequestQuery()
    }).then(r => {
      state.promos = [];
      (r.data.data as GeneralLandingPage[]).forEach(lp => {
        state.promos.push(generalLandingPageToPromo(lp))
      });
    }).finally(() => {
      state.loading = false
    })
  }

  const queryToStateFilter = () => {
    state.filter.types = $route.value.query.type ? String($route.value.query.type).split(',') : []
  }

  const stateToGeneralLandingPagesRequestQuery = () => {
    const requestQuery = {
      product_type: state.filter.types.join(',')
    }

    return json.pickBy(requestQuery)
  }

  const stateToQuery = () => {
    const query = {
      types: state.filter.types.join(',')
    }

    return json.pickBy(query)
  }

  return {
    getPromoBySlug,
    getPromos,
    queryToStateFilter,
    state,
    stateToQuery
  }
}
