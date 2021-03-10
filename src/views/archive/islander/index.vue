<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="岛民图鉴" :tips="tips" :has-tip="true"></list-header>

    <v-data-iterator
      :items="list"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
      :loading-text="preset.dataIterator.loadingText"
      :no-results-text="preset.dataIterator.noResultsText"
      :no-data-text="preset.noDataText"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar class="card-search mb-1" dark color="secondary" prominent>
          <v-select v-model="filters.sex" flat solo-inverted hide-details clearable :items="sexList" label="性别"></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="filters.breed" flat solo-inverted hide-details clearable :items="breedList" label="种族"></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="filters.monthStr" flat solo-inverted hide-details clearable :items="monthList" label="生日月份"></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="filters.character" flat solo-inverted hide-details clearable :items="characterList" label="性格"></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="filters.voice" flat solo-inverted hide-details clearable :items="voiceList" label="音高"></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="filters.hobbyList" flat solo-inverted hide-details clearable :items="hobbyList" label="爱好"></v-select>
          <v-spacer></v-spacer>
          <v-btn large depressed color="primary" @click="clearFilters">
            重置全部筛选
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="搜索岛民名字关键字"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            @input="getList"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select v-model="options.sortBy" flat hide-details :items="sortKeys" label="按哪项排序"></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="options.sortDesc" mandatory>
              <v-btn large depressed color="primary" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="primary" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card :href="'/detail/islander/' + item._id">
              <v-card-title class="subheading font-weight-bold white--text">{{
                item.name + (item.amiibo ? '(amiibo:' + item.amiibo + ')' : '')
              }}</v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-img :src="apiUrl + item.photoSrc" height="100" contain></v-img>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'sex' }">性别：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.sex === 1 ? '♂' : '♀' }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'character' }">性格：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.character + (item.subtype ? item.subtype : '') }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'breed' }">种族：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.breed }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'birth' }">生日：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.birth }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>口头禅：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.petPhrase }}</v-list-item-content>
                </v-list-item>
              </v-list>
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
import { getIslanders } from '@api/islander'
import getOption from '@/utils/get-option'

export default {
  name: 'Islander',
  data() {
    return {
      loading: true,
      total: 0,
      search: '',
      filters: {
        sex: '',
        breed: '',
        monthStr: '',
        character: '',
        voice: '',
        hobby: ''
      },
      options: {
        itemsPerPageArray: [4, 8, 12],
        page: 1,
        itemsPerPage: 8,
        sortBy: 'name',
        sortDesc: false
      },
      sortKeys: [
        { text: '名字', value: 'name' },
        { text: '生日', value: 'birth' },
        { text: '性格', value: 'character' },
        { text: '种族', value: 'breed' }
      ],
      list: [],
      sexList: [
        { text: '♀', value: 0 },
        { text: '♂', value: 1 }
      ],
      monthList: [
        { text: '一月', value: '1月' },
        { text: '二月', value: '2月' },
        { text: '三月', value: '3月' },
        { text: '四月', value: '4月' },
        { text: '五月', value: '5月' },
        { text: '六月', value: '6月' },
        { text: '七月', value: '7月' },
        { text: '八月', value: '8月' },
        { text: '九月', value: '9月' },
        { text: '十月', value: '10月' },
        { text: '十一月', value: '11月' },
        { text: '十二月', value: '12月' }
      ],
      breedList: [],
      characterList: [],
      voiceList: [],
      hobbyList: [],
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '岛民图鉴',
          disabled: true,
          href: '/archive/islander'
        }
      ],
      tips: '下方工具栏的箭头按钮是根据左侧选择的属性对信息进行排序。向上箭头是顺序（从小到大），向下箭头是倒序（从大到小）。'
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
      if (this.options.sortDesc) {
        this.options.sortDesc === false ? (sortDesc = 1) : (sortDesc = -1)
      }
      if (this.options.sortBy) {
        sortBy = this.options.sortBy
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
      getIslanders(queryInfo).then(response => {
        this.list = response.data.list
        this.total = response.data.total || 0
        this.loading = false
      })
    },
    getOptions() {
      getOption('character', list => {
        this.characterList = list
      })
      getOption('breed', list => {
        this.breedList = list
      })
      getOption('voice', list => {
        this.voiceList = list
      })
      getOption('hobby', list => {
        this.hobbyList = list
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
    },
    filterChange(item, search) {
      this.getList()
      return this.list
    },
    sortChange(item, sortBy, sortDesc, locale) {
      console.log(item, sortBy)
    },
    clearFilters() {
      this.filters = {
        sex: '',
        breed: '',
        monthStr: '',
        character: '',
        voice: '',
        hobby: ''
      }
    },
    goDetail(item) {
      this.$router.push('/detail/islander/' + item._id)
    }
  }
}
</script>

<style scoped></style>
