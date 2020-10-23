<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.name" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="pt-8 pb-16">
        <v-row>
          <v-col cols="12" class="py-8">
            <v-list-item>
              <v-list-item-content v-if="info.photoSrc">
                <v-img
                  v-if="info.photoSrc.length > 0 && info.photoSrc[0].src"
                  class="mx-auto"
                  :src="apiUrl + info.photoSrc[0].src"
                  height="180"
                  contain
                />
                <v-img v-else-if="info.photoSrc.length > 0 && info.photoSrc[0]" class="mx-auto" :src="apiUrl + info.photoSrc" height="180" contain />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">英文名：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.engName }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.jpnName" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">日文名：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.jpnName }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">类型：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.type }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">豆狸回收价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price * 0.25 }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">箱子回收价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price * 0.2 }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="8" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">颜色：</v-list-item-content>
              <v-list-item-content class="align-end"> {{ info.colorInfo }} </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">风格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.styleInfo }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">主题：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.themeInfo }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">订购类型：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.orderType }}</v-list-item-content>
            </v-list-item>
          </v-col>

          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">售卖时间：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.saleTime }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">获取途径：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.channelInfo }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">途径详情：</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" class="pt-2 pb-8">
            <v-list-item>
              <v-list-item-content class="align-end">{{ info.channelDetail ? info.channelDetail : '暂无' }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="morePhoto" cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">颜色款式：</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="morePhoto" cols="12" class="py-2 d-flex photoList">
            <v-list-item v-for="(photo, i) in info.photoSrc" :key="photo + i">
              <v-img :src="apiUrl + photo.src" height="128" contain></v-img>
              <p class="mb-2">{{ photo.name.replace('.png', '') }}</p>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getClothing } from '@/api/clothing'

export default {
  name: 'ClothingDetail',
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
          text: '服饰图鉴',
          href: '/archive/clothing'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
    morePhoto() {
      let bl = false
      if (this.info.photoSrc) {
        bl = this.info.photoSrc.length > 1
      }
      return bl
    }
  },
  watch: {},
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getClothing(this.id).then(response => {
        this.info = response.data
        const colorData = this.info.color
        const styleData = this.info.style
        const themeData = this.info.theme
        const channelsData = this.info.channels
        this.info.colorInfo = colorData.join('、')
        this.info.styleInfo = styleData.join('、')
        this.info.themeInfo = themeData.join('、')
        const activity = this.info.activity ? '[' + this.info.activity + '期间] ' : ''
        this.info.channelInfo = activity + channelsData.join('/')
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/clothing/' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
