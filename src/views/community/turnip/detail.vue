<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.title" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="py-16 px-16">
        <v-row>
          <v-col cols="12 d-flex justify-space-between">
            <div v-if="info.user" class="d-flex mb-2">
              <v-avatar class="mr-2" width="40" height="40">
                <img :src="apiUrl + info.user.avatar" />
              </v-avatar>
              <span style="flex:1; line-height:40px;">{{ info.user.nickname }}</span>
              <div class="line-40 subtitle-2 px-4 grey--text text--darken-1">
                {{ info.user.position === 'north' ? '北半球' : '南半球' }} | {{ info.user.gameId }} | {{ info.user.islandName }}
              </div>
            </div>
            <div class="line-40 subtitle-2  px-4 grey--text text--lighten-1">剩余时间：{{ info.validTime | formatTime }}</div>
          </v-col>
          <v-col cols="12" class="py-10">
            <div class="mx-auto px-10">
              <v-chip :color="info.exchangeType === '我有菜' ? 'primary' : 'secondary'" text-color="white">
                <v-avatar left>
                  <v-icon v-if="info.exchangeType === '我有价'">mdi-currency-usd-circle</v-icon>
                  <v-icon v-else>mdi-sprout</v-icon>
                </v-avatar>
                {{ info.exchangeType }}
              </v-chip>
              {{ info.detail }}
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex justify-space-between">
              <div class="line-40"><span class="grey--text text--lighten-1 mr-2">菜价：</span>{{ info.price }}</div>
              <div class="line-40"><span class="grey--text text--lighten-1 mr-2">登岛人数限制：</span>{{ info.maxPeople }}</div>
              <div class="line-40"><span class="grey--text text--lighten-1 mr-2">登岛最长时间（分钟）：</span>{{ info.maxTime }}</div>
            </div>
            <div class="d-flex justify-start line-40">
              <div v-if="info.contactDetail" class="">
                <span class="grey--text text--lighten-1 mr-2">联系方式:</span>{{ info.contact + '---' + info.contactDetail }}
              </div>
              <div v-if="info.psw">
                <span class="grey--text text--lighten-1 mr-2">开岛密码:</span>
                {{ info.psw }}
              </div>
              <v-btn class="cyan--text text--lighten-2 line-40 ml-2" text>
                <v-icon class="mr-1" small>mdi-contactless-payment-circle</v-icon>{{ info.isLineup ? '立即上岛' : '立即联系' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
    <comment type="turnip" default-text="想进行大头菜交易可以留言哦～"></comment>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTurnip } from '@/api/turnip'

export default {
  name: 'TurnipDetail',
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
          text: '菜市场',
          href: '/community/turnip/'
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
      getTurnip(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: '菜市场详情',
          disabled: true,
          href: '/detail/turnip' + this.id
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
</style>
