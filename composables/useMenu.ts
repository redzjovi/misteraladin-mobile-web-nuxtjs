import {
  computed,
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import {
  HomepageMenu,
  Status
} from '~/types/misteraladin/api/generals/homepage-menus'

export interface Menu {
  active: boolean;
  iconUrl: string;
  title: string;
  type: string;
}

export default () => {
  const {
    $axios,
    $config,
    i18n
  } = useContext()

  const state = reactive({
    loading: ref(false),
    menus: ref<Menu[]>([])
  })

  const stateActiveMenus = computed(() => state.menus.filter(m => m.active))

  const generalHomepageMenuToMenu = (hm: HomepageMenu): Menu => {
    let title = hm.caption_en

    if (i18n.locale === 'id') {
      title = hm.caption
    }

    return {
      active: hm.status === Status.Active,
      iconUrl: hm.icon_svg,
      title,
      type: hm.type
    }
  }

  const getMenus = () => {
    state.loading = true

    $axios.get($config.generalApiUrl + '/homepage-menus', {
      headers: {
        'X-Platform': 'mobile-web',
      },
    }).then(r => {
      state.menus.splice(0);
      (r.data.data as HomepageMenu[]).forEach(hm => {
        state.menus.push(
          generalHomepageMenuToMenu(hm)
        )
      })
    }).finally(() => {
      state.loading = false
    })
  }

  return {
    getMenus,
    state,
    stateActiveMenus
  }
}
