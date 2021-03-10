<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="动森攻略" :tips="tips" :has-tip="false"></list-header>
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
            <v-card :href="'/detail/guide/' + item._id">
              <v-img :src="apiUrl + item.image_uri" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="240px">
                <v-card-title class="no-bg" v-text="item.title"></v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  <span class="cyan--text text--lighten-2 mr-1">[{{ item.platforms[0] }}]</span>{{ item.content_short | textFilter }}
                  <!-- <span class="float-right grey--text text--lighten-1">{{ item.display_time | parseTime('{y}-{m}-{d}') }}</span> -->
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
import { getGuideList } from '@api/guide'

export default {
  name: 'Guide',
  data() {
    return {
      total: 0,
      list: [],
      loading: true,
      options: {
        itemsPerPageArray: [3, 6, 9],
        page: 1,
        itemsPerPage: 6
      },
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '动森攻略',
          disabled: true,
          href: '/guide/'
        }
      ],
      tips: ''
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
      let sortBy = 'display_time'
      let sortDesc = 1
      const sortJson = {}
      if (this.options.sortDesc.length >= 1) {
        this.options.sortDesc === false ? (sortDesc = 1) : sortDesc - 1
      }
      if (this.options.sortBy.length >= 1) {
        sortBy = this.options.sortBy[0]
      }
      sortJson[sortBy] = sortDesc
      const sort = JSON.stringify(sortJson)
      console.log(sort)
      console.log(typeof sort)
      const queryInfo = {
        page: this.options.page,
        query: '',
        pageSize: this.options.itemsPerPage,
        sort,
        status: 'published'
      }
      getGuideList(queryInfo).then(response => {
        this.list = response.data.list
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
