<template>
  <v-card>
    <v-card-title class="white--text">
      <v-icon left>
        mdi-cake-variant
      </v-icon>
      <span class="title font-weight-bold">今天是比利的生日</span>
    </v-card-title>
    <v-card-text justify="center" class="pa-4 mx-auto">
      <v-img :src="require(`@assets/ia_100000019.png`)" height="280" contain class=""></v-img>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {}
}
</script>
