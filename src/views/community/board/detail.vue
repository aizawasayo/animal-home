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
            <div class="line-40 subtitle-2  px-4 grey--text text--lighten-1">{{ info.updated_time | formatTime }}发布</div>
          </v-col>
          <v-col cols="12" class="py-2">
            <div class="mx-auto px-10">
              <v-chip :color="info.color ? info.color : 'secondary'" outlined class="mr-2">
                <v-avatar left>
                  <v-icon v-if="info.icon"> {{ 'mdi-' + info.icon }}</v-icon>
                  <v-icon v-else>mdi-sprout</v-icon>
                </v-avatar>
                {{ info.topic }}
              </v-chip>
              {{ info.content }}
            </div>
          </v-col>
          <v-col v-for="(photo, i) in info.photoSrc" :key="photo + i" cols="12" class="py-8">
            <v-list-item>
              <v-list-item-content>
                <v-img :src="apiUrl + photo.src" height="450" contain></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
    <comment type="board" default-text="可以留下你的想法和意见～"></comment>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBoard } from '@/api/board'

export default {
  name: 'BoardDetail',
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
          text: '森友墙',
          href: '/community/board/'
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
      getBoard(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: '森友墙详情',
          disabled: true,
          href: '/detail/board' + this.id
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
