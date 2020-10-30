<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.name" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="pt-8 pb-16">
        <v-row>
          <v-col :cols="info.hasFake ? 6 : 12" class="py-8">
            <v-list-item>
              <v-list-item-content v-if="info.hasFake" class="label">真品图片：</v-list-item-content>
              <v-list-item-content>
                <v-img :src="apiUrl + info.photoSrc[0].src" height="160" contain></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.hasFake" cols="6" class="py-8">
            <v-list-item>
              <v-list-item-content class="label">赝品图片：</v-list-item-content>
              <v-list-item-content>
                <v-img :src="apiUrl + info.photoSrc[1].src" height="160" contain></v-img>
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
              <v-list-item-content class="label">真实名字：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.realName }}</v-list-item-content>
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
              <v-list-item-content class="label">售出价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.salePrice }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">尺寸：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.size }}</v-list-item-content>
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
          <v-col v-if="info.hasFake" cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">赝品鉴别方法：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.fakeCharacter }}</v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArtwork } from '@api/artwork'

export default {
  name: 'ArtworkDetail',
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
          text: '艺术品',
          href: '/archive/museum/artwork'
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
      getArtwork(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/artwork/' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
