<template>
  <v-app>
    <core-app-bar />

    <core-view />

    <core-footer />

    <confirm ref="confirm"></confirm>
    <dialog-loader ref="dialogLoader"></dialog-loader>
  </v-app>
</template>

<script>
import Confirm from '@components/message/Confirm'
import DialogLoader from '@components/message/DialogLoader'
export default {
  name: 'App',
  components: {
    CoreAppBar: () => import('@components/core/AppBar'),
    CoreView: () => import('@components/core/View'),
    CoreFooter: () => import('@components/core/Footer'),
    DialogLoader,
    Confirm
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open
    this.$root.$dialogLoader = this.$refs.dialogLoader
  }
}
</script>
