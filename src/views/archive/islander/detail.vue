<template>
  <v-container class="bgWht picList" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header :title="info.name" :has-tip="false"></list-header>
    <v-card class="detail">
      <v-list dense class="py-16">
        <v-row>
          <v-col cols="4" class="py-8">
            <v-list-item>
              <v-list-item-content>
                <v-img :src="apiUrl + info.photoSrc" height="300" contain></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="8">
            <v-row>
              <v-col cols="12" class="py-2">
                <v-list-item>
                  <v-list-item-content class="cute-title white--text rounded text-h5 px-8"
                    >{{ info.name + '     （amiibo序号：' + (info.amiibo ? info.amiibo : '暂无') + ')' }}<span></span
                  ></v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">英文名：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.engName ? info.engName : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">日文名：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.jpnName ? info.jpnName : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">生日：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.birth }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">性别：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.sex === 1 ? '♂' : '♀' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">种族：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.breed }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">性格：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.character + (info.subtype ? info.subtype : '暂无') }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">爱好：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.hobby ? info.hobby : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">音高：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.voice ? info.voice : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">初始口头禅：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.petPhrase ? info.petPhrase : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col v-if="info.motto" cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">座右铭：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.motto ? info.motto : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col v-if="info.ideal" cols="6" class="py-2">
                <v-list-item>
                  <v-list-item-content class="label">目标：</v-list-item-content>
                  <v-list-item-content class="align-end">{{ info.ideal ? info.ideal : '暂无' }}</v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getIslander } from '@api/islander'

export default {
  name: 'IslanderDetail',
  data() {
    return {
      id: this.$route.params.id,
      info: {},
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '岛民',
          href: '/archive/islander'
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
      getIslander(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/islander' + this.id
        })
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
