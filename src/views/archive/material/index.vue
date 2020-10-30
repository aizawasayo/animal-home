<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="素材图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark>
      <v-select v-model="filters.season" flat solo-inverted hide-details multiple clearable :items="seasonList" label="筛选所属季节"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.activity" flat solo-inverted hide-details clearable :items="activityList" label="筛选所属活动"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.channels" flat solo-inverted hide-details multiple clearable :items="channelList" label="筛选材料来源"></v-select>
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
        label="搜索素材名称关键字"
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
import { getMaterials } from '@api/material'
import getOption from '@/utils/get-option'

export default {
  name: 'Material',
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
        activity: '',
        season: [],
        channels: []
      },
      activityList: [],
      seasonList: [],
      channelList: [
        { text: '商店购买', value: '商店购买' },
        { text: '狸端机订购', value: '狸端机订购' },
        { text: '岛民赠送', value: '岛民赠送' },
        { text: 'npc赠送', value: 'npc赠送' },
        { text: '素材岛挖掘', value: '素材岛挖掘' },
        { text: '花卉杂交', value: '花卉杂交' },
        { text: '星座当月许愿', value: '星座当月许愿' },
        { text: '对流星许愿次日', value: '对流星许愿次日' },
        { text: '海滩拾取', value: '海滩拾取' },
        { text: '海滩喷水处挖掘', value: '海滩喷水处挖掘' },
        { text: '树边采集', value: '树边采集' },
        { text: '砍树掉落', value: '砍树掉落' },
        { text: '摇晃树干', value: '摇晃树干' },
        { text: '砍竹子', value: '砍竹子' },
        { text: '敲石头', value: '敲石头' },
        { text: '钓鱼', value: '钓鱼' },
        { text: '挖掘地面', value: '挖掘地面' },
        { text: '打落气球', value: '打落气球' },
        { text: '果树掉落', value: '果树掉落' },
        { text: '非果树掉落', value: '非果树掉落' },
        { text: '针叶树掉落', value: '针叶树掉落' },
        { text: '阔叶树掉落', value: '阔叶树掉落' },
        { text: '打落蓝色气球', value: '打落蓝色气球' },
        { text: '捕虫网捕捉', value: '捕虫网捕捉' },
        { text: '潜水打捞', value: '潜水打捞' },
        { text: '与阿獭交换帆立贝随机获得', value: '与阿獭交换帆立贝随机获得' }
      ],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '20%', sortable: false },
        { text: '名称', value: 'name', width: '20%' },
        { text: '价格', value: 'price', align: 'center', width: '15%' },
        { text: '最大堆叠数量', value: 'maxNum', align: 'center', width: '15%' },
        { text: '获取来源', value: 'source', align: 'center', width: '30%', sortable: false }
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
          text: '素材图鉴',
          disabled: true,
          href: '/archive/material'
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
        if (val.season.includes('全年')) {
          this.filters.season = []
        }
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
      getMaterials(queryInfo).then(response => {
        this.list = response.data.records
        this.list.forEach(item => {
          const seasonData = item.season
          const activity = item.activity ? item.activity + '/' : ''
          const channelData = item.channels
          item.source = seasonData.join('/') + activity + channelData.join('/')
        })
        this.total = response.data.total || 0
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
        activity: '',
        season: [],
        channels: []
      }
    },
    goDetail(item) {
      this.$router.push('/detail/material/' + item._id)
    }
  }
}
</script>
