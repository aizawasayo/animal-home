<template>
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
    <template v-slot:header>
      <v-toolbar class="card-search mb-1" dark color="secondary">
        <v-select v-model="filters.hasFake" flat solo-inverted hide-details clearable :items="fakeList" label="是否有赝品"></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="搜索艺术品名称关键字"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          style="width:400px"
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
          <v-card :href="'/detail/artwork/' + item._id">
            <v-card-title class="subheading font-weight-bold white--text">{{ item.name }}</v-card-title>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-img :src="apiUrl + item.photoSrc[0].src" height="100" contain></v-img>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="5" class="py-0">
                    <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'price' }">价格：</v-list-item-content>
                  </v-col>
                  <v-col cols="7" class="py-0">
                    <v-list-item-content class="align-end">{{ item.price }}</v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="5" class="py-0">
                    <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'salePrice' }">售出价格：</v-list-item-content>
                  </v-col>
                  <v-col cols="7" class="py-0">
                    <v-list-item-content class="align-end">{{ item.salePrice }}(赝品为0)</v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="5" class="py-0">
                    <v-list-item-content>真名：</v-list-item-content>
                  </v-col>
                  <v-col cols="7" class="py-0">
                    <v-list-item-content class="align-end"> {{ item.realName | textFilter(8) }}</v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="5" class="py-0">
                    <v-list-item-content :class="{ 'cyan--text text--lighten-2': options.sortBy === 'size' }">尺寸：</v-list-item-content>
                  </v-col>
                  <v-col cols="7" class="py-0">
                    <v-list-item-content class="align-end">{{ item.size }}</v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="5" class="py-0">
                    <v-list-item-content>有无赝品：</v-list-item-content>
                  </v-col>
                  <v-col cols="7" class="py-0">
                    <v-list-item-content class="align-end">{{ item.hasFake === true ? '有' : '无' }}</v-list-item-content>
                  </v-col>
                </v-row>
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
            <v-list-item v-for="(number, index) in options.itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
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
</template>

<script>
import { mapGetters } from 'vuex'
import { getArtworkList } from '@api/artwork'
import getOption from '@/utils/get-option'

export default {
  name: 'Artwork',
  data() {
    return {
      loading: true,
      total: 0,
      search: '',
      filters: {
        hasFake: ''
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
        // { text: '价格', value: 'price' },
        // { text: '售出价格', value: 'salePrice' },
        { text: '尺寸', value: 'size' }
      ],
      list: [],
      fakeList: [
        { text: '有赝品', value: 'true' },
        { text: '无赝品', value: 'false' }
      ],
      sizeList: []
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
        query,
        page: this.options.page,
        pageSize: this.options.itemsPerPage,
        sort,
        ...this.filters
      }
      getArtworkList(queryInfo).then(response => {
        this.list = response.data.records
        this.total = response.data.total || 0
        this.loading = false
      })
    },
    getOptions() {
      getOption('size', list => {
        this.sizeList = list
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
    clearFilters() {
      this.filters = {
        hasFake: null
      }
    }
  }
}
</script>

<style scoped></style>
