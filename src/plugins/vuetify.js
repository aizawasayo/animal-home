import Vue from "vue";
import Vuetify from "vuetify/lib";

// import {
//   VuetifyPreset
// } from 'vuetify/types/services/presets'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);
// console.log(VuetifyPreset)

const options = {
  theme: {
    themes: {
      light: {
        primary: colors.teal, // 组件按钮等主色调
        secondary: colors.green.lighten2, //背景色
        accent: colors.amber, //强调
        // error: '#FF5252',
        info: colors.cyan.lighten3,
        // success: '#4CAF50',
        // warning: '#FB8C00',
        // error: colors.red.accent3,
        anchor: colors.cyan.lighten2 //链接锚点等
      },
      dark: {
        primary: colors.blue.lighten3,
      },
    },
  }
}
export default new Vuetify({
  //preset: {
  noDataText: '没有相关数据',
  dataIterator: {
    loadingText: '请稍候，数据加载中',
    noResultsText: '没有符合条件的数据'
  },
  //},
  // User options are then merged, overwriting defaults and the global preset
  ...options,
});