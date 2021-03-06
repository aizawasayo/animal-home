<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="发布我的设计" :tips="tips" :has-tip="true"> </list-header>
    <v-form ref="addForm" v-model="valid" lazy-validation class="pa-16">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="newDesign.name"
            :counter="20"
            :rules="formRules.require"
            label="设计名称"
            placeholder="请输入"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="newDesign.type"
            :items="typeList"
            label="类型"
            placeholder="请选择"
            item-text="label"
            item-value="key"
            :rules="formRules.require"
          >
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-file-input
            v-model="uploadList"
            accept="image/*"
            label="图片"
            placeholder="请上传"
            multiple
            prepend-icon="mdi-camera"
            :rules="formRules.require"
            @change="handleUpload"
            @click:clear="clearFiles"
          ></v-file-input>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="newDesign.content" height="100" label="说明" hint="灵感来源，设计思路等等，畅所欲言" placeholder="请输入"></v-textarea>
        </v-col>
      </v-row>
      <div class="form-btns d-flex justify-lg-space-between mt-4 mx-auto">
        <v-btn :disabled="!valid" color="primary" class="mr-4" large @click="submit">
          提交
        </v-btn>
        <v-btn color="secondary" large @click="reset">
          重置
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { addDesign } from '@api/design'
import { uploadMult } from '@api/upload'

export default {
  name: 'DesignAdd',
  data() {
    return {
      valid: false,
      newDesign: {
        name: '',
        type: '',
        photoSrc: [],
        content: ''
      },
      typeList: [
        { label: '衣服', key: 'clothingDesign', icon: 'theme' },
        { label: '帽子', key: 'hatDesign', icon: 'hat' },
        { label: '图案', key: 'patternDesign', icon: 'pattern' }
      ],
      formRules: {
        require: [v => !!v || '不能为空！']
      },
      uploadList: [],
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '设计分享',
          disabled: false,
          href: '/design'
        },
        {
          text: '发布我的设计',
          disabled: true,
          href: '/design/add'
        }
      ],
      tips: '本页面用于动森玩家分享DIY设计(服装/帽子/图案均可)，图片格式接受jpg或png。'
    }
  },
  computed: {
    ...mapGetters(['userId']) // 推荐这种
  },
  methods: {
    submit() {
      if (this.$refs.addForm.validate()) {
        this.newDesign.user = this.userId
        addDesign(this.newDesign).then(res => {
          this.$root.$dialogLoader.showSnackbar(res.message, { color: 'success' })
          this.reset()
          this.$router.push('/design')
        })
      } else {
        this.valid = false
        this.$root.$dialogLoader.showSnackbar('信息有误，请重新填写！', { color: 'error' })
      }
    },
    reset() {
      this.$refs.addForm.reset()
      this.$refs.addForm.resetValidation()
    },
    handleUpload() {
      // 图片上传成功后把临时地址保存到临时图片列表中
      const formData = new FormData()
      for (const file of this.uploadList) {
        formData.append('photoSrc', file, file.name)
      }
      uploadMult(formData).then(res => {
        if (res.code === 200) {
          this.$root.$dialogLoader.showSnackbar(res.message, { color: 'success' })
          const files = res.data
          files.forEach(pic => {
            let src = pic.path
            const name = pic.name
            src = src.replace('/public', '')
            const newPic = { name: name, src: src }
            this.newDesign.photoSrc.push(newPic)
          })
        }
      })
    },
    clearFiles() {
      this.uploadList = []
      this.newDesign.photoSrc = []
    }
  }
}
</script>

<style scoped>
.form-btns {
  width: 400px;
}
.form-btns .v-btn {
  width: 150px;
}
</style>
