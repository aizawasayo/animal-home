<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.title" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="py-16 px-16">
        <v-row>
          <v-col v-for="(photo, i) in info.photoSrc" :key="photo + i" cols="12" class="py-8">
            <v-list-item>
              <v-list-item-content>
                <v-img :src="apiUrl + photo.src" height="450" contain></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">分类：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.type }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">来源平台：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.platforms ? info.platforms.join('/') : '' }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">发布时间：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.created_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">作者：</v-list-item-content>
              <v-list-item-content class="align-end d-flex py-0">
                <v-avatar class="mr-2" style="flex: none;" width="40" height="40">
                  <img v-if="info.author" :src="apiUrl + info.author.avatar" />
                </v-avatar>
                <span v-if="info.author" style="flex:1; line-height:40px;">{{ info.author.nickname }}</span>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.source_uri" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">原文地址：</v-list-item-content>
              <v-list-item-content class="align-end">
                <a :href="info.source_uri">{{ info.source_uri }}</a>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
      <div class="mx-auto px-10 mb-16" v-html="info.content"></div>
    </v-card>
    <comment v-if="!info.comment_disabled"></comment>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGuide } from '@api/guide'

export default {
  name: 'GuideDetail',
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
          text: '攻略',
          href: '/guide/'
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
      getGuide(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: '攻略详情',
          disabled: true,
          href: '/detail/guide' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.detail .v-list-item__content.align-end {
  border-bottom: none;
}
/* .cute-title {
  background: url(/static/img/title-bag.26400741.jpg) repeat;
} */
</style>
