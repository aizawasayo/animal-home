<template>
  <v-container class="bgWht" elevation-4>
    <bread-crumbs :bread-nav="breadNav"></bread-crumbs>
    <list-header title="发布我的信息" :tips="tips" :has-tip="true"> </list-header>
    <v-form ref="addForm" v-model="valid" lazy-validation class="pa-16">
      <v-row>
        <v-col cols="4">
          <v-select v-model="newBoard.topic" :items="topicList" label="话题" placeholder="请选择" :rules="formRules.require"> </v-select>
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
          <v-textarea v-model="newBoard.content" height="100" label="说明" hint="灵感来源，设计思路等等，畅所欲言" placeholder="请输入"></v-textarea>
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
import { addBoard } from '@api/board'
import { uploadMult } from '@api/upload'
import { getOptionList } from '@api/option'
import getOption from '@/utils/get-option'
import { timestamp, parseTime } from '@/utils'

export default {
  name: 'BoardAdd',
  data() {
    return {
      valid: false,
      newBoard: {
        user: '',
        topic: '', // 话题
        content: '', // 详细内容
        photoSrc: [],
        icon: '',
        color: '',
        updated_time: null
      },
      formRules: {
        require: [v => !!v || '不能为空！']
      },
      topicList: [],
      topicOption: [],
      uploadList: [],
      breadNav: [
        {
          text: '首页',
          disabled: false,
          href: '/'
        },
        {
          text: '社区',
          disabled: true,
          href: '/community'
        },
        {
          text: '森友墙',
          disabled: false,
          href: '/community/board'
        },
        {
          text: '发布我的信息',
          disabled: true,
          href: '/community/board/add'
        }
      ],
      tips: '森友墙用于村民们讨论游戏日常，留下对森友之家的建设意见等等。禁止现金交易，拉私群，违规者永久封禁账号。望发布信息的各位森友遵守规则。'
    }
  },
  computed: {
    ...mapGetters(['userId']),
    apiUrl() {
      return process.env.VUE_APP_BASE_API
    }
  },
  created() {
    getOption('topic', list => {
      this.topicList = list
    })
    getOptionList({ type: 'topic' }).then(response => {
      this.topicOption = response.data
    })
  },
  methods: {
    submit() {
      if (this.$refs.addForm.validate()) {
        // this.newBoard.photoSrc = this.newBoard.photoSrc.concat(this.uploadList)
        this.addTopicInfo()
        this.getTimeVal()
        this.uploadList = []
        this.newBoard.user = this.userId
        addBoard(this.newBoard).then(res => {
          this.$root.$dialogLoader.showSnackbar(res.message, { color: 'success' })
          this.reset()
          this.$router.push('/community/board')
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
    addTopicInfo() {
      const topicName = this.newBoard.topic
      const topicInfo = this.topicOption.filter(item => item.name === topicName)
      this.newBoard.icon = topicInfo[0].icon
      this.newBoard.color = topicInfo[0].color
    },
    handleUpload() {
      // 图片上传成功后把临时地址保存到临时图片列表中
      const formData = new FormData()
      for (let file of this.uploadList) {
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
            this.newBoard.photoSrc.push(newPic)
          })
        }
      })
    },
    clearFiles() {
      this.uploadList = []
      this.newBoard.photoSrc = []
    },
    getTimeVal() {
      const today = new Date()
      const todayString = parseTime(today)
      this.newBoard.updated_time = timestamp(todayString)
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
