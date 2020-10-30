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
           <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">种类：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.type && info.type.join('、')}}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">价格：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.price }}</v-list-item-content>
            </v-list-item>
          </v-col>
         
           <v-col v-if="hasGrowStage"  cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">来源：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.channel }}</v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="isSeed" cols="4" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">种子名称：</v-list-item-content>
              <v-list-item-content class="align-end d-flex py-0">
                <v-img :src="apiUrl+info.seed.photoSrc" height="40" contain style="flex: none; width:50px"></v-img>
                <span style="flex:1; line-height:40px;">{{ info.seed.name }}</span>
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="isMix" cols="6" class="py-2">
            <v-list-item>
              <v-list-item-content class="label">杂交来源品种：</v-list-item-content>
              <v-list-item-content class="align-end d-flex py-0"> 
                <span v-for="(mix,i) in info.mixPlant" class="d-flex" style="flex: 1 0 50%;">
                  <v-img :src="apiUrl + mix.photoSrc" height="40" contain style="flex: none; width:50px"></v-img>
                  <span style="flex:1; line-height:40px;">{{mix.name}}</span>
                </span> 
              </v-list-item-content>
            </v-list-item>
          </v-col>

          <v-col v-if="hasGrowStage" cols="6" class="pt-2 pb-8">
            <v-list-item>
              <v-list-item-content class="label">成长阶段：</v-list-item-content>
              <v-list-item-content class="align-end">{{ info.growStage && info.growStage[0] ? info.growStage.join('-') : '' }}</span>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPlant } from '@api/plant'

export default {
  name: 'PlantDetail',
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
          text: '植物图鉴',
          href: '/archive/plant'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['apiUrl']),
    isSeed(){
      return this.info.channel === '种子'
    },
    isMix(){
      return this.info.channel === '花卉杂交'
    },
    hasGrowStage() {
      return !(this.info.type.includes('种子') || this.info.type.includes('树苗'))
    }
  },
  watch: {},
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getPlant(this.id).then(response => {
        this.info = response.data
        this.breadNav.push({
          text: this.info.name,
          disabled: true,
          href: '/detail/plant/' + this.id
        })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
