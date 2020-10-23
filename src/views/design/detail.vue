<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.name" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="py-16">
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
              <v-list-item-content class="label">设计名称：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.name }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">上传时间：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.created_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">作者：</v-list-item-content>
              <v-list-item-content v-if="info.user" class="align-end d-flex py-0">
                <v-avatar class="mr-2" style="flex: none;" width="40" height="40">
                  <img :src="apiUrl + info.user.avatar" :alt="info.user.username" />
                </v-avatar>
                <span style="flex:1; line-height:40px;">{{ info.user.username }}</span>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">详细说明：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.content }}</v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDesign } from '@/api/design'

export default {
  name: 'DesignDetail',
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
          text: '设计分享',
          href: '/design/'
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
      getDesign(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/design' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.cute-title {
  background: url(/static/img/title-bag.26400741.jpg) repeat;
}
</style>
