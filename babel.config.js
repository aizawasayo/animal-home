module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ["import", { // 按需加载组件
      "libraryName": "view-design",
      "libraryDirectory": "src/components"
    }]
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
};