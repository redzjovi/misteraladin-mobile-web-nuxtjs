import {
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import {
  Banner as GeneralBanner,
  Response
} from '~/types/misteraladin/api/generals/banners'

export interface Banner {
  code: string
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

  const state = reactive({
    banners: ref<Banner[]>([]),
    loading: ref(false)
  })

  const generalBannerToBanner = (gb: GeneralBanner): Banner => {
    let description = gb.description_en
    let imageUrl = gb.image_url_en
    let title = gb.title_en

    if (i18n.locale === 'id') {
      description = gb.description
      imageUrl = gb.image_url
      title = gb.title
    }

    const slug = (title === null ? '' : title.replace(/\W/g, '').toLowerCase())

    return {
      code: String(gb.id),
      description: description ?? '',
      imageUrl,
      slug: slug + '-' + gb.id,
      title,
    }
  }

  const getBanners = () => {
    state.loading = true

    $axios.get($config.generalApiUrl + '/banners', {
      params: {
        domain: 'mobile',
        filter: 'active',
        position: 'landingpage',
      },
    }).then(r => {
      (r.data as Response).data.forEach(b => {
        state.banners.push(
          generalBannerToBanner(b)
        )
      })
    }).finally(() => {
      state.loading = false
    })
  }

  return {
    getBanners,
    state
  }
}
