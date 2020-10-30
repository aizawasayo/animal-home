<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="服饰图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark prominent>
      <v-select v-model="filters.color" flat solo-inverted hide-details multiple clearable :items="colorList" label="筛选颜色"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.style" flat solo-inverted hide-details multiple clearable :items="styleList" label="筛选风格"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.theme" flat solo-inverted hide-details multiple clearable :items="themeList" label="筛选主题"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.activity" flat solo-inverted hide-details clearable :items="activityList" label="所属活动"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.channels" flat solo-inverted hide-details multiple clearable :items="channelList" label="购买渠道"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.orderType" flat solo-inverted hide-details clearable :items="orderTypeList" label="所属活动"></v-select>
      <v-spacer></v-spacer>
      <v-btn large depressed color="primary" @click="clearFilters">
        重置全部筛选
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="搜索服饰名称关键字"
        clearable
        single-line
        hide-details
        prepend-inner-icon="mdi-magnify"
        style="width:450px"
        @input="getList"
      ></v-text-field>
    </v-toolbar>

    <v-tabs v-model="tab" background-color="transparent" class="elevation-0 table-tab">
      <v-tab v-for="(item, i) in tabOptions" :key="item + i" :href="`#${item}`" @click="tabClick($event, item)">
        {{ item }}
      </v-tab>
      <v-tab-item v-for="(item, i) in tabOptions" :key="'clothingTab' + i" :value="item">
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
          <template v-slot:item.douPrice="{ item }">
            {{ item.price * 0.25 }}
          </template>
          <template v-slot:item.boxPrice="{ item }">
            {{ item.price * 0.2 }}
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getClothingList } from '@api/clothing'
import { getOptionList } from '@api/option'
import getOption from '@/utils/get-option'

export default {
  name: 'Clothing',
  data() {
    return {
      total: 0,
      tab: '上衣',
      tabOptions: [],
      list: [],
      search: '',
      loading: true,
      options: {},
      filters: {
        color: [], // 颜色
        style: [], // 风格
        theme: [], // 主题
        orderType: '',
        activity: '',
        channels: []
      },
      colorList: [],
      styleList: [],
      themeList: [],
      channelList: [],
      activityList: [],
      orderTypeList: [
        { text: '订购', value: '订购' },
        { text: '不可订购', value: '不可订购' },
        { text: '里数兑换', value: '里数兑换' },
        { text: '非卖品', value: '非卖品' }
      ],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '13%', sortable: false },
        { text: '名称', value: 'name', width: '20%' },
        { text: '颜色', value: 'color', sortable: false, width: '25%' },
        { text: '价格', value: 'price', align: 'center', width: '10%' },
        { text: '豆狸回收', value: 'douPrice', align: 'center', width: '10%', sortable: false },
        { text: '箱子回收', value: 'boxPrice', align: 'center', width: '10%', sortable: false },
        { text: '订购类型', value: 'orderType', align: 'center', width: '12%', sortable: false }
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
          text: '服饰图鉴',
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
        this.getList()
      },
      deep: true
    }
  },
  created() {
    // this.getList()
    getOptionList({ type: 'clothingType' }).then(res => {
      res.data.forEach(item => this.tabOptions.push(item.name))
    })
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
        type: this.tab,
        pageSize: this.options.itemsPerPage,
        sort,
        ...this.filters
      }
      getClothingList(queryInfo).then(response => {
        this.list = response.data.records
        this.total = response.data.total || 0
        this.options.pageStop = Math.ceil(this.total / this.options.itemsPerPage)
        this.loading = false
      })
    },
    getOptions() {
      getOption('clothingChannels', list => {
        this.channelList = list
      })
      getOption('clothingColor', list => {
        this.colorList = list
      })
      getOption('clothingStyle', list => {
        this.styleList = list
      })
      getOption('clothingTheme', list => {
        this.themeList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
    },
    clearFilters() {
      this.filters = {
        color: [], // 颜色
        style: [], // 风格
        theme: [], // 主题
        orderType: '',
        activity: '',
        channels: []
      }
    },
    goDetail(item) {
      this.$router.push('/detail/clothing/' + item._id)
    },
    tabClick(e, type) {
      console.log(type)
    }
  }
}
</script>

<style scoped>
.card-search .v-select {
}
</style>
