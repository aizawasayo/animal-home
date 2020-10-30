<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="菜市场" :tips="tips" :has-tip="true">
      <template v-slot:btn>
        <v-btn class="primary mt-1" href="/community/turnip/add">发布我的大头菜信息</v-btn>
      </template>
    </list-header>
    <v-data-iterator
      :items="list"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
      :loading-text="preset.dataIterator.loadingText"
      :no-results-text="preset.dataIterator.noResultsText"
      :no-data-text="preset.noDataText"
      hide-default-footer
      class="mt-4"
    >
      <template v-slot:header> </template>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="4">
            <v-card :href="'/detail/turnip/' + item._id">
              <v-card-title class="no-bg d-block">
                <div class="d-flex mb-2">
                  <v-avatar class="mr-2" style="flex: none;" width="40" height="40">
                    <img :src="apiUrl + item.user.avatar" />
                  </v-avatar>
                  <span style="flex:1;" class="line-40">{{ item.user.nickname }}</span>
                </div>
                <div class="subtitle-2 grey--text text--darken-1">
                  {{ item.user.position === 'north' ? '北半球' : '南半球' }} | {{ item.user.gameId }}
                </div>
                <div class="subtitle-2 grey--text text--lighten-1">剩余时间：{{ item.validTime | formatTime }}</div>
              </v-card-title>
              <v-card-text class="text--primary">
                <div class="d-flex justify-lg-space-between">
                  <v-chip :color="item.exchangeType === '我有菜' ? 'primary' : 'secondary'" text-color="white">
                    <v-avatar left>
                      <v-icon v-if="item.exchangeType === '我有价'">mdi-currency-usd-circle</v-icon>
                      <v-icon v-else>mdi-sprout</v-icon>
                    </v-avatar>
                    {{ item.exchangeType }}
                  </v-chip>
                  <div class="subtitle-1 grey--text text--darken-1 line-40">菜价：{{ item.price }}</div>
                </div>
                <div class="my-2">{{ item.detail | textFilter(25) }}</div>
                <div v-if="item.contactDetail" class="">
                  <span class="grey--text text--lighten-1 mr-2">联系方式:</span>{{ item.contact + '---' + item.contactDetail }}
                </div>
                <div v-if="item.psw"><span class="grey--text text--lighten-1 mr-2">开岛密码:</span>{{ item.psw }}</div>
                <div class="d-flex justify-space-between">
                  <v-btn class="cyan--text text--lighten-2" text
                    ><v-icon class="mr-1" small>mdi-contactless-payment-circle</v-icon>{{ item.isLineup ? '立即上岛' : '立即联系' }}</v-btn
                  >
                  <v-btn class="cyan--text text--lighten-2" text
                    ><v-icon class="mr-1" small>mdi-comment-processing</v-icon>留言 {{ item.comments ? item.comments : '0' }}</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row class="mt-2 px-3" align="center" justify="center">
          <span class="grey--text">每页显示</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
                {{ options.itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in options.itemsPerPageArray" :key="'pageArray' + index" @click="updateItemsPerPage(number)">
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <span
            class="mr-4
            grey--text"
          >
            页码 {{ options.page }} / {{ numberOfPages }}
          </span>
          <v-btn fab depressed dark color="primary" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab depressed dark color="primary" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTurnipList } from '@api/turnip'

export default {
  name: 'Turnip',
  data() {
    return {
      total: 0,
      list: [],
      loading: true,
      options: {
        itemsPerPageArray: [6, 12],
        page: 1,
        itemsPerPage: 6
      },
      topicOption: [],
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '社区',
          disabled: true,
          href: '/community'
        },
        {
          text: '菜市场',
          disabled: true,
          href: '/community/turnip'
        }
      ],
      tips: '菜市场用于村民们互助卖菜，大家可以留下自己的商店菜价等相关信息。禁止现金交易，拉私群，违规者永久封禁账号。望发布信息的各位森友遵守规则。'
    }
  },
  computed: {
    ...mapGetters(['preset', 'apiUrl']),
    numberOfPages() {
      return Math.ceil(this.total / this.options.itemsPerPage)
    }
  },
  watch: {
    options: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    getList() {
      this.loading = true
      let sortBy = 'updated_time'
      let sortDesc = -1
      const sortJson = {}
      if (this.options.sortDesc.length >= 1) {
        this.options.sortDesc === false ? (sortDesc = 1) : sortDesc - 1
      }
      if (this.options.sortBy.length >= 1) {
        sortBy = this.options.sortBy[0]
      }
      sortJson[sortBy] = sortDesc
      const sort = JSON.stringify(sortJson)
      const queryInfo = {
        page: this.options.page,
        query: '',
        pageSize: this.options.itemsPerPage,
        sort
      }
      getTurnipList(queryInfo).then(response => {
        this.list = response.data.records
        this.total = response.data.total || 0
        // this.options.pageStop = Math.ceil(this.total / pageSize)
        this.loading = false
      })
    },
    nextPage() {
      if (this.options.page + 1 <= this.numberOfPages) this.options.page += 1
    },
    formerPage() {
      if (this.options.page - 1 >= 1) this.options.page -= 1
    },
    updateItemsPerPage(number) {
      this.options.itemsPerPage = number
    }
  }
}
</script>
