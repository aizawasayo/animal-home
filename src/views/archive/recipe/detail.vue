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
                <v-img :src="apiUrl + info.photoSrc" height="160" contain></v-img>
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
              <v-list-item-content class="align-end">{{ info.type.join('/') }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">占地尺寸：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.size }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="info.unlockCondition" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">解锁条件：</v-list-item-content>
              <v-list-item-content class="align-end">{{ '总DIY数量满' + info.unlockCondition + '次' }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">合成材料：</v-list-item-content>
              <v-list-item-content class="align-end d-flex py-0">
                <span v-for="(m, i) in info.materials" class="d-flex" style="flex: 1 0 auto;">
                  <v-img :src="apiUrl + m.photoSrc" height="40" contain style="flex: none; width:50px"></v-img>
                  <span style="flex:1; line-height:40px;">{{ m.name + '×' + m.num }}</span>
                </span>
              </v-list-item-content>
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
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRecipe } from '@/api/recipe'

export default {
  name: 'RecipeDetail',
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
          text: 'DIY配方图鉴',
          href: '/archive/recipe'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
    morePhoto() {
      return this.info.photoSrc.length > 1
    }
  },
  watch: {},
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getRecipe(this.id).then(response => {
        this.info = response.data
        let channels = ''
        const season = this.info.season ? this.info.season + '/' : ''
        const activity = this.info.activity ? this.info.activity + '/' : ''
        const character = this.info.character ? `(${this.info.character}性格)` : ''
        const channelData = this.info.channels
        const npc = this.info.npc ? `(${this.info.npc})` : ''
        channelData.forEach((c, i) => {
          if (c === '岛民' || c === 'NPC') {
            c = c + '赠送'
          }
          if (i === channelData.length - 1) {
            channels += c
          } else {
            channels += c + '/'
          }
        })
        this.info.channelInfo = season + activity + character + channels + npc
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/recipe/' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
