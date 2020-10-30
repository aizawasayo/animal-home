<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="森友墙" :tips="tips" :has-tip="true">
      <template v-slot:btn>
        <v-btn class="primary mt-1" href="/community/board/add">发布我的信息</v-btn>
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
            <v-card :href="'/detail/board/' + item._id">
              <v-card-title class="no-bg d-block">
                <div class="d-flex mb-2">
                  <v-avatar class="mr-2" style="flex: none;" width="40" height="40">
                    <img :src="apiUrl + item.user.avatar" />
                  </v-avatar>
                  <span class="line-40" style="flex:1;">{{ item.user.nickname }}</span>
                </div>
                <div class="subtitle-2 grey--text text--darken-1">
                  {{ item.user.position === 'north' ? '北半球' : '南半球' }} | {{ item.user.gameId }}
                </div>
                <div class="subtitle-2 grey--text text--lighten-1">{{ item.updated_time | formatTime }}发布</div>
              </v-card-title>
              <v-card-text class="text--primary">
                <div>
                  <v-chip :color="item.color ? item.color : 'secondary'" outlined small class="mr-2">
                    <v-avatar left>
                      <v-icon v-if="item.icon"> {{ 'mdi-' + item.icon }}</v-icon>
                      <v-icon v-else>mdi-sprout</v-icon>
                    </v-avatar>
                    {{ item.topic }}
                  </v-chip>
                  {{ item.content | textFilter(20) }}
                  <!-- <span class="cyan--text text--lighten-2 mr-1">[{{ item.topic }}]</span>{{ item.content | textFilter }} -->
                </div>
                <v-img
                  :src="apiUrl + item.photoSrc[0].src"
                  class="white--text mt-2 rounded"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200px"
                />
                <div class="d-flex justify-space-between">
                  <v-btn class="cyan--text text--lighten-2" text><v-icon class="mr-1" small>mdi-thumb-up</v-icon>赞</v-btn>
                  <v-btn class="cyan--text text--lighten-2" text
                    ><v-icon class="mr-1" small>mdi-comment-processing</v-icon>评论 {{ item.comments ? item.comments : '0' }}</v-btn
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
import { getBoardList } from '@api/board'
import { getOptionList } from '@api/option'

export default {
  name: 'Board',
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
          text: '森友墙',
          disabled: true,
          href: '/community/board'
        }
      ],
      tips: '森友墙用于村民们讨论游戏日常，留下对森友之家的建设意见等等。禁止现金交易，拉私群，违规者永久封禁账号。望发布信息的各位森友遵守规则。'
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
  created() {
    getOptionList({ type: 'topic' }).then(response => {
      this.topicOption = response.data
    })
    // this.getList()
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
      getBoardList(queryInfo).then(response => {
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
