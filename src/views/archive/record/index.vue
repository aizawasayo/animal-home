<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="唱片图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark>
      <v-select v-model="filters.channel" flat solo-inverted hide-details multiple clearable :items="channelList" label="筛选唱片来源"></v-select>
      <v-spacer></v-spacer>
      <v-btn large depressed color="primary" @click="clearFilters">
        重置筛选
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="搜索唱片名称关键字"
        clearable
        single-line
        hide-details
        prepend-inner-icon="mdi-magnify"
        style="width:350px"
        @input="getList"
      ></v-text-field>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="list"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      :loading-text="preset.dataIterator.loadingText"
      :no-results-text="preset.dataIterator.noResultsText"
      :no-data-text="preset.noDataText"
      :footer-props="footer"
      class="elevation-1"
      @click:row="goDetail"
    >
      <template v-slot:item.photoSrc="{ item }">
        <v-img
          v-if="item.photoSrc.length > 0 && item.photoSrc[0].src"
          class="mx-auto"
          :src="apiUrl + item.photoSrc[0].src"
          height="128"
          width="128"
          contain
        />
        <span v-else>未上传</span>
      </template>
      <template v-slot:item.channel="{ item }">
        {{ item.channel && item.channel.join('/') }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRecords } from '@/api/record'
import getOption from '@/utils/get-option'

export default {
  name: 'Record',
  data() {
    return {
      total: 0,
      list: [],
      search: '',
      loading: true,
      options: {},
      filters: {
        channel: []
      },
      channelList: [
        { text: 'Nook购物', value: 'Nook购物' },
        { text: 'KK赠送', value: 'KK赠送' },
        { text: '第一次KK演唱会后', value: '第一次KK演唱会后' },
        { text: '生日当天KK赠送', value: '生日当天KK赠送' },
        { text: '隐藏歌曲', value: '隐藏歌曲' }
      ],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '18%', sortable: false },
        { text: '名称', value: 'name', width: '15%' },
        { text: '英文名', value: 'engName', width: '14%', sortable: false },
        { text: '日文名', value: 'jpnName', width: '15%', sortable: false },
        { text: '买入价格', value: 'price', align: 'center', width: '10%' },
        { text: '售出价格', value: 'salePrice', align: 'center', width: '10%' },
        { text: '来源', value: 'channel', align: 'center', width: '18%', sortable: false }
      ],
      footer: {
        itemsPerPageText: '每页条数',
        showFirstLastPage: true,
        showCurrentPage: true,
        itemsPerPageOptions: [10, 20]
      },
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '唱片图鉴',
          disabled: true,
          href: '/archive/record'
        }
      ],
      tips: '鼠标移到列表表头的列名上如果出现箭头，就说明该项可以排序。向上箭头是顺序（从小到大），向下箭头是倒序（从大到小）。'
    }
  },
  computed: {
    ...mapGetters(['preset', 'apiUrl'])
  },
  watch: {
    options: {
      handler() {
        this.getList()
      },
      deep: true
    },
    filters: {
      handler(val) {
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.getList()
    this.getOptions()
  },
  methods: {
    getList() {
      this.loading = true
      let sortBy = 'name'
      let sortDesc = 1
      const sortJson = {}
      if (this.options.sortDesc.length >= 1) {
        this.options.sortDesc[0] === false ? (sortDesc = 1) : (sortDesc = -1)
      }
      if (this.options.sortBy.length >= 1) {
        sortBy = this.options.sortBy[0]
      }
      sortJson[sortBy] = sortDesc
      const sort = JSON.stringify(sortJson)
      let query = ''
      this.search === null ? (query = '') : (query = this.search)

      const queryInfo = {
        page: this.options.page,
        query,
        pageSize: this.options.itemsPerPage,
        sort,
        ...this.filters
      }
      getRecords(queryInfo).then(response => {
        this.list = response.data.records
        this.total = response.data.total || 0
        // this.options.pageStop = Math.ceil(this.total / pageSize)
        this.loading = false
      })
    },
    getOptions() {
      getOption('activity', list => {
        this.activityList = list
      })
      getOption('season', list => {
        this.seasonList = list
      })
    },
    clearFilters() {
      this.filters = {
        channel: []
      }
    },
    goDetail(item) {
      // this.$router.push('/detail/record/' + item._id)
    }
  }
}
</script>
