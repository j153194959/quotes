import Vue from 'vue'
import Router from 'vue-router'
import Optional from '@/components/optional/Optional'
import Edit from '@/components/optional/Edit'
import Search from '@/components/optional/Search'
import Index from '@/components/index/Index'
import Quotes from '@/components/quotes/Quotes'
import HS from '@/components/quotes/children/HS'
import Plate from '@/components/quotes/children/Plate'
import HK from '@/components/quotes/children/HK'
import HKConnect from '@/components/quotes/children/HKConnect'
import Others from '@/components/quotes/children/Others'
import ListMore from '@/components/quotes/List-More'
import PopularMore from '@/components/quotes/Popular-More'

import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default', // 默认 我的自选
      component: Optional
    },
    {
      // 当 /optional 匹配成功，
      path: '/optional',
      name: 'optional', // 自选页
      component: Optional
    },
    {
      // 当 /././search 匹配成功，
      path: '/././search',
      name: 'search',
      component: Search
    },
    {
      // 当 /./edit 匹配成功，
      path: '/./edit',
      name: 'edit', // 编辑页
      component: Edit
    },
    {
      // 当 /././index/:id 匹配成功，
      path: '/././index/:id',
      name: 'index', // 编辑页
      component: Index
    },
    {
      // 当 /./quotes 匹配成功，
      path: '/./quotes',
      name: 'quotes', // 行情页
      component: Quotes,
      children: [
        {
          // 当 /./quotes/ 匹配成功，
          path: '/./quotes', // 默认为 沪深
          name: 'quotes-hs',
          component: HS
        },
        {
          // 当 /quotes/plate 匹配成功，
          path: 'plate', // 板块
          name: 'quotes-plate',
          component: Plate
        },
        {
          // 当 /quotes/hk 匹配成功，
          path: 'hk', // 港股
          name: 'quotes-hk',
          component: HK
        },
        {
          // 当 /quotes/hk-connect 匹配成功，
          path: 'hk-connect', // 港股通
          name: 'quotes-hk-connect',
          component: HKConnect
        },
        {
          // 当 /quotes/more 匹配成功，
          path: 'others', // 其他
          name: 'quotes-others',
          component: Others
        }
      ]
    },
    {
      // 当 /list-more 匹配成功，
      path: '/list-more',
      name: 'list-more', // 列表更多页
      component: ListMore
    },
    {
      // 当 /popular-more 匹配成功，
      path: '/test',
      name: 'test', // 测试页面
      component: Test
    },
    {
      // 当 /popular-more 匹配成功，
      path: '/popular-more',
      name: 'popular-more', // 列表更多页
      component: PopularMore
    }
  ]
})
