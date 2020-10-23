<template>
  <v-card>
    <v-card-title class="white--text">
      <v-icon left>
        mdi-television-guide
      </v-icon>
      <span class="title font-weight-bold">动森攻略</span>
      <v-btn large text class="btn-more" color="white" href="/guide">更多<v-icon small right>mdi-more</v-icon></v-btn>
    </v-card-title>
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="6" class="py-0">
          <v-row dense>
            <v-col :class="guide.flex === 12 ? 'pt-0' : ''" v-for="(guide, i) in picGuide" :key="guide.title + i" :cols="guide.flex">
              <v-card>
                <v-img
                  :src="apiUrl + guide.image_uri"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200px"
                >
                  <v-card-title class="no-bg" v-text="guide.title"></v-card-title>
                </v-img>
                <v-card-text class="text--primary">
                  <div>{{ guide.content_short | textFilter(15) }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-card tile>
            <v-list>
              <v-list-item-group color="info">
                <v-list-item v-for="(item, i) in guideList" :key="'guideList' + i" color="anchor" link :href="item.src" :selectable="true">
                  <span class="cyan--text text--lighten-2 mr-1">[{{ item.platforms[0] }}]</span>
                  <!-- <v-list-item-avatar v-if="avatar">
                          <v-img :src="item.avatar"></v-img>
                         </v-list-item-avatar> -->
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGuideList } from '@/api/guide'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        page: 1, // 当前的页数
        pageSize: 10 // 当前每页显示多少条数据
      },
      guideList: []
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
    picGuide() {
      return this.guideList.filter(item => item.flex)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getGuideList(this.queryInfo).then(response => {
        this.guideList = response.data.records
        this.guideList[0].flex = 12
        this.guideList[1].flex = 6
        this.guideList[2].flex = 6
      })
    }
  }
}
</script>
