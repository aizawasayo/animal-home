<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="DIY配方图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-toolbar class="card-search mb-4" color="secondary" dark prominent>
      <v-select v-model="filters.size" flat solo-inverted hide-details clearable :items="sizeList" label="尺寸"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.activity" flat solo-inverted hide-details clearable :items="activityList" label="所属活动"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.channels" flat solo-inverted hide-details multiple clearable :items="channelList" label="获取来源"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.npc" flat solo-inverted hide-details clearable :items="npcList" label="来源NPC"></v-select>
      <v-spacer></v-spacer>
      <v-select v-model="filters.character" flat solo-inverted hide-details clearable :items="characterList" label="来源岛民性格"></v-select>
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
        label="搜索DIY配方名称关键字"
        @input="getList"
      ></v-text-field>
    </v-toolbar>

    <v-tabs v-model="tab" background-color="transparent" class="elevation-0 table-tab">
      <v-tab v-for="(item, i) in tabOptions" :key="item + i" :href="`#${item}`">
        {{ item }}
      </v-tab>
      <v-tab-item v-for="(item, i) in tabOptions" :key="'recipeTab' + i" :value="item">
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
          <template v-slot:item.materials="{ item }">
            <span v-for="(m, index) in item.materials" :key="'materials' + index">{{
              index === item.materials.length - 1 ? m.name + '*' + m.num : m.name + '*' + m.num + '+'
            }}</span>
          </template>
          <template v-slot:item.unlockCondition="{ item }">
            <span v-if="item.unlockCondition">总DIY数量满{{ item.unlockCondition }}次</span>
            <span v-else>无要求</span>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRecipes } from '@api/recipe'
import { getOptionList } from '@api/option'
import getOption from '@/utils/get-option'

export default {
  name: 'Recipe',
  data() {
    return {
      total: 0,
      tab: '工具',
      tabOptions: [],
      list: [],
      search: '',
      loading: true,
      options: {},
      filters: {
        size: '', // 尺寸
        season: [], // 所属系列
        activity: '',
        character: '', // 来源村民性格
        npc: '',
        channels: [], // 获取途径
        unlockCondition: ''
      },
      seasonList: [],
      sizeList: [],
      channelList: [],
      activityList: [],
      characterList: [],
      npcList: [
        { text: '狸克', value: '狸克' },
        { text: '西施惠', value: '西施惠' },
        { text: '傅珂', value: '傅珂' },
        { text: '傅达', value: '傅达' },
        { text: '雪人', value: '雪人' },
        { text: '巴猎', value: '巴猎' },
        { text: '蹦蹦', value: '蹦蹦' },
        { text: '健兆', value: '健兆' },
        { text: '阿獭', value: '阿獭' }
      ],
      headers: [
        { text: '主图', value: 'photoSrc', align: 'center', width: '12%', sortable: false },
        { text: '名称', value: 'name', width: '12%' },
        { text: '尺寸', value: 'size', align: 'center', width: '8%' },
        { text: '来源', value: 'channels', align: 'center', width: '25%', sortable: false },
        { text: '合成材料', value: 'materials', align: 'center', width: '28%', sortable: false },
        { text: '解锁条件', value: 'unlockCondition', align: 'center', width: '12%' }
      ],
      footer: {
        itemsPerPageText: '每页条数',
        showFirstLastPage: true,
        showCurrentPage: true,
        itemsPerPageOptions: [10, 20]
        // pageText:''
      },
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: 'DIY配方图鉴',
          disabled: true,
          href: '/archive/recipe'
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
    getOptionList({ type: 'diyType' }).then(res => {
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
      getRecipes(queryInfo).then(response => {
        this.list = response.data.list
        this.list.forEach(item => {
          let channels = ''
          const season = item.season ? item.season + '/' : ''
          const activity = item.activity ? item.activity + '/' : ''
          const character = item.character ? `(${item.character}性格)` : ''
          const channelData = item.channels
          const npc = item.npc ? `(${item.npc})` : ''

          channelData.forEach((c, i) => {
            if (c === '岛民' || c === 'NPC') {
              c = c + '赠送'
            }
            if (i === channelData.length - 1) {
              channels += c
            } else {
              channels += c + '/'
            }
          })
          item.channels = season + activity + character + channels + npc
        })
        this.total = response.data.total || 0
        this.options.pageStop = Math.ceil(this.total / this.options.itemsPerPage)
        this.loading = false
      })
    },
    getOptions() {
      getOption('diyChannels', list => {
        this.channelList = list
      })
      getOption('diyUnlock', list => {
        this.unlockConditionList = list.map(item => ({ text: '总DIY数量满' + item.text + '次', value: '总DIY数量满' + item.value + '次' }))
      })
      getOption('season', list => {
        this.seasonList = list
      })
      getOption('character', list => {
        this.characterList = list
      })
      getOption('activity', list => {
        this.activityList = list
      })
      getOption('size', list => {
        this.sizeList = list
      })
    },
    clearFilters() {
      this.filters = {
        size: '',
        season: [],
        activity: '',
        character: '',
        npc: '',
        channels: [],
        unlockCondition: ''
      }
    },
    goDetail(item) {
      this.$router.push('/detail/recipe/' + item._id)
    }
  }
}
</script>

<style scoped>
.card-search .v-select {
  width: 250px;
}
</style>
