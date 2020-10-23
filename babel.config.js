module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ["import", {
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