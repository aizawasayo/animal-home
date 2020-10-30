<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.name" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="pt-8 pb-16">
        <v-row>
          <v-col cols="12" class="py-8">
            <v-list-item>
              <v-list-item-content>
                <v-img :src="apiUrl + info.photoSrc" height="128" contain></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">英文名：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.engName }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">日文名：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.jpnName }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">北半球月份：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.north }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">南半球月份：</v-list-item-content>
              <v-list-item-content class="align-end"> {{ info.south }} </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">出现场所：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.locale }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.unlockCondition" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">解锁条件：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.unlockCondition }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">稀有度：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.rarity }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="3" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">出现时间段：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.period === '1点-24点' ? '全天' : info.period }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.weatherCondition" cols="3" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">天气条件：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.weatherCondition }}</v-list-item-content>
            </v-list-item>
          </v-col>

          <v-col cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">简介：</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" class="pt-2 pb-8">
            <v-list-item>
              <v-list-item-content class="align-end">{{ info.introduction ? info.introduction : '暂无' }}</v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInsect } from '@api/insect'

export default {
  name: 'InsectDetail',

  data() {
    return {
      loading: true,
      id: this.$route.params.id,
      info: {},
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '博物馆图鉴',
          href: '/archive/museum'
        },
        {
          text: '昆虫',
          href: '/archive/museum/insect'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['apiUrl'])
  },
  watch: {},
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getInsect(this.id).then(response => {
        this.info = response.data
        const northData = this.info.activeTime.north
        const southData = this.info.activeTime.south
        let northText = ''
        let southText = ''
        if (northData.includes('全年')) {
          northText = '全年'
        } else {
          northText = northData.join()
        }
        if (southData.includes('全年')) {
          southText = '全年'
        } else {
          southText = southData.join()
        }
        this.info.north = northText
        this.info.south = southText

        let elseData = ''
        const localeData = this.info.locale
        const elseCondition = this.info.elseCondition
        elseCondition.forEach((e, i) => {
          elseData += '(' + e + ')'
        })
        this.info.locale = localeData.join('、') + elseData
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/insect/' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
