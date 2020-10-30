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
          <v-col v-if="info.engName" cols="4" class="py-2">
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
              <v-list-item-content class="label">价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price ? info.price : '暂无' }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.maxNum" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">最大堆叠数量：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.maxNum }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">来源渠道：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.source }}</v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMaterial } from '@api/material'

export default {
  name: 'MaterialDetail',
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
          text: '素材',
          href: '/archive/material'
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
      getMaterial(this.id).then(response => {
        this.info = response.data
        const seasonData = this.info.season
        const activity = this.info.activity ? this.info.activity + '/' : ''
        const channelData = this.info.channels
        this.info.source = seasonData.join('/') + activity + channelData.join('/')
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/material' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
