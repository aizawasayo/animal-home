<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="工具图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark>
      <v-select v-model="filters.activity" flat solo-inverted hide-details clearable :items="activityList" label="所属活动"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.channels" flat solo-inverted hide-details multiple clearable :items="channelList" label="购买渠道"></v-select>
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
        label="搜索工具名称关键字"
        @input="getList"
      ></v-text-field>
    </v-toolbar>

    <v-tabs v-model="tab" background-color="transparent" class="elevation-0 table-tab">
      <v-tab v-for="(item, i) in tabOptions" :key="item + i" :href="`#${item}`">
        {{ item }}
      </v-tab>
      <v-tab-item v-for="(item, i) in tabOptions" :key="'toolTap' + i" :value="item">
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
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTools } from '@/api/tool'
import getOption from '@/utils/get-option'

export default {
  name: 'Tool',
  data() {
    return {
      total: 0,
      tab: '可以DIY制作',
      tabOptions: ['可以DIY制作', '不可以DIY制作'],
      list: [],
      search: '',
      loading: true,
      options: {},
      filters: {
        activity: '',
        channels: []
      },
      channelList: [],
      activityList: [],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '12%', sortable: false },
        { text: '名称', value: 'name', width: '14%' },
        { text: '英文名', value: 'engName', align: 'center', width: '16%', sortable: false },
        { text: '日文名', value: 'jpnName', align: 'center', width: '18%', sortable: false },
        { text: '价格', value: 'price', align: 'center', width: '10%' },
        { text: '耐久度', value: 'durability', align: 'center', width: '10%' },
        { text: '来源', value: 'channels', align: 'center', width: '20%', sortable: false }
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
          text: '工具图鉴',
          disabled: true,
          href: '/archive/clothing'
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
        this.options.page = 1
        this.getList()
      },
      deep: true
    },
    tab(val) {
      this.options.page = 1
      this.getList()
    }
  },
  created() {
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

      let isDIY = true
      this.tab === '可以DIY制作' ? (isDIY = true) : (isDIY = false)

      const queryInfo = {
        page: this.options.page,
        query,
        isDIY,
        pageSize: this.options.itemsPerPage,
        sort,
        ...this.filters
      }
      getTools(queryInfo).then(response => {
        this.list = response.data.records
        this.list.forEach(item => {
          let activity = ''
          const channelsData = item.channels
          const activityData = item.activity
          activityData ? (activity = activityData + '/') : ''
          item.channels = activity + channelsData.join('/')
        })
        this.total = response.data.total || 0
        this.options.pageStop = Math.ceil(this.total / this.options.itemsPerPage)
        this.loading = false
      })
    },
    getOptions() {
      getOption('toolChannels', list => {
        this.channelList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
    },
    clearFilters() {
      this.filters = {
        activity: '',
        channels: []
      }
    },
    goDetail(item) {
      this.$router.push('/detail/tool/' + item._id)
    }
  }
}
</script>

<style scoped></style>
