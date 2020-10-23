<template>
  <v-container>
    <v-row>
      <v-col cols="12"> <banner /></v-col>
      <v-col cols="8">
        <archive />
      </v-col>
      <v-col cols="4">
        <birthday />
      </v-col>
      <v-col cols="12">
        <guide />
      </v-col>
      <v-col cols="7">
        <community />
      </v-col>
      <v-col cols="5">
        <activity />
      </v-col>
    </v-row>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    Banner: () => import('@/components/home/Banner'),
    Archive: () => import('@/components/home/Archive'),
    Birthday: () => import('@/components/home/Birthday'),
    Guide: () => import('@/components/home/Guide'),
    Community: () => import('@/components/home/Community'),
    Activity: () => import('@/components/home/Activity')
  }
}
</script>
