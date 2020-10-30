<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="植物图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark>
      <v-select v-model="filters.type" flat solo-inverted hide-details multiple clearable :items="typeList" label="筛选种类"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.channel" flat solo-inverted hide-details clearable :items="channelList" label="筛选来源"></v-select>
      <v-spacer></v-spacer>
      <v-btn large depressed color="primary" @click="clearFilters">
        重置全部筛选
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        clearable
        single-line
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="搜索植物名称关键字"
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
          height="50"
          width="50"
          contain
        />
        <v-img
          v-else-if="item.photoSrc.length > 0 && item.photoSrc[0]"
          class="mx-auto"
          :src="apiUrl + item.photoSrc"
          height="50"
          width="50"
          contain
        />
        <span v-else>未上传</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPlants } from '@api/plant'
import getOption from '@/utils/get-option'

export default {
  name: 'Plant',
  data() {
    return {
      total: 0,
      desserts: [],
      list: [],
      search: '',
      season: [],
      loading: true,
      options: {},
      filters: {
        type: [],
        channel: ''
      },
      typeList: [
        { text: '种子', value: '种子' },
        { text: '水果', value: '水果' },
        { text: '树苗', value: '树苗' },
        { text: '树', value: '树' },
        { text: '花', value: '花' },
        { text: '蘑菇', value: '蘑菇' },
        { text: '灌木', value: '灌木' },
        { text: '其他', value: '其他' }
      ],
      channelList: [
        { text: '种子', value: '种子' },
        { text: '花卉杂交', value: '花卉杂交' }
      ],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '20%', sortable: false },
        { text: '名称', value: 'name', width: '18%' },
        { text: '价格', value: 'price', align: 'center', width: '10%' },
        { text: '种类', value: 'type', align: 'center', width: '10%', sortable: false },
        { text: '来源', value: 'channel', align: 'center', width: '12%', sortable: false },
        { text: '成长阶段', value: 'growStage', align: 'center', width: '30%', sortable: false }
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
          text: '植物图鉴',
          disabled: true,
          href: '/archive/plant'
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
      getPlants(queryInfo).then(response => {
        this.list = response.data.records
        this.list.forEach(item => {
          const typeData = item.type
          const growData = item.growStage
          item.type = typeData.join('/')
          item.growStage = growData.join('-')
        })
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
      // getOption('channels', list => {
      //   this.channelList = list
      // })
    },
    clearFilters() {
      this.filters = {
        type: [],
        channel: ''
      }
    },
    goDetail(item) {
      this.$router.push('/detail/plant/' + item._id)
    }
  }
}
</script>
