<template>
  <div class="mb-16">
    <div class="mt-16 mb-2 text-h5 grey--text text--darken-3 d-flex justify-lg-space-between">
      评论
    </div>
    <v-divider class="primary mb-4"></v-divider>
    <v-form ref="addForm" v-model="valid" lazy-validation>
      <v-textarea v-model="comment.content" height="100" :hint="hint" :placeholder="placeText" :disabled="!isLogin" filled></v-textarea>
    </v-form>
    <div class="form-btns d-flex justify-lg-space-between mt-2 mx-auto">
      <v-btn color="primary" class="mr-4" large @click="submit" :disabled="!isLogin">
        提交
      </v-btn>
      <v-btn color="secondary" large @click="reset" :disabled="!isLogin">
        重置
      </v-btn>
    </div>
    <div class="my-2 text-h5">评论列表</div>
    <v-divider class="primary mb-4"></v-divider>
    <div class="comment-container">
      <div v-for="(item, i) in list" :key="item._id" class="comment-thread">
        <div class="comment-post py-4">
          <div class="comment-avatar">
            <v-img :src="apiUrl + item.uid.avatar" width="50" height="50"></v-img>
          </div>
          <div class="comment-body">
            <div class="comment-user">
              <div class="comment-user-name">
                <a href="https://space.bilibili.com/179053982">{{ item.uid.nickname }}</a>
              </div>
              <div class="reply-name" style="display: none;"></div>
              <div class="comment-floor">{{ i + 1 }}楼</div>
            </div>
            <div class="comment-text" style="cursor: auto;">
              {{ item.content }}
            </div>
            <div class="comment-footer">
              <span class="comment-time">{{ item.created_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              <span class="comment-like pl-4" @click="addLike(item._id, item.like)"
                ><v-icon x-small class="mr-1">mdi-thumb-up</v-icon>{{ item.like }}</span
              >
              <span class="comment-report pl-4"><v-icon small class="mr-1">mdi-flag</v-icon>举报</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-pagination v-if="total > 5" v-model="currentPage" :length="pageLength" @input="updatePage"> </v-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserId } from '@/utils/auth'
import { getComments, addComment } from '@/api/comment'
import { addGuide } from '@/api/guide'
import { addBoard } from '@/api/board'
import { addTurnip } from '@/api/turnip'
import { addTrade } from '@/api/trade'
import { timestamp, parseTime } from '@/utils'
export default {
  name: 'Comment',
  props: {
    type: { type: String, default: 'guide' },
    hint: { type: String, default: '有什么想说的，尽情留下吧' },
    defaultText: { type: String, default: '请输入' }
  },
  data() {
    return {
      valid: false,
      list: [],
      total: 0,
      currentPage: 1,
      queryInfo: {
        page: 1,
        pageSize: 5,
        aid: ''
      },
      comment: {
        aid: '', // 文章id
        uid: '', // 登录用户id
        content: ''
      }
    }
  },
  watch: {
    queryInfo: {
      deep: true,
      handler(newV) {
        this.getList()
      }
    }
  },
  computed: {
    ...mapGetters(['userId', 'apiUrl']),
    isLogin() {
      let userId = getUserId()
      let bl = false
      userId ? (bl = true) : (bl = false)
      return bl
    },
    placeText() {
      let text = ''
      if (getUserId()) {
        text = this.defaultText
      } else {
        text = '请先登陆后再发表评论( · ω · )'
      }
      return text
    },
    aid() {
      return this.$route.params.id
    },
    pageLength() {
      return parseInt(this.total / this.queryInfo.pageSize) + 1
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.queryInfo.aid = this.aid
      getComments(this.type, this.queryInfo).then(response => {
        this.list = response.data.records
        this.total = response.data.total || 0
        switch (this.type) {
          case 'guide':
            addGuide({ _id: this.aid, comments: this.total }).then(res => {})
          case 'board':
            addBoard({ _id: this.aid, comments: this.total }).then(res => {})
          case 'turnip':
            addTurnip({ _id: this.aid, comments: this.total }).then(res => {})
          case 'trade':
            addTrade({ _id: this.aid, comments: this.total }).then(res => {})
        }
      })
    },
    updatePage() {
      this.queryInfo.page = this.currentPage
    },
    addLike(id, like) {
      this.comment._id = id
      this.comment.like = like + 1
      delete this.comment.content
      addComment(this.type, this.comment).then(res => {
        this.$root.$dialogLoader.showSnackbar(res.message, { color: 'success' })
        this.reset()
        this.getList()
      })
    },
    submit() {
      if (this.$refs.addForm.validate()) {
        this.comment.aid = this.aid
        this.comment.uid = this.userId
        delete this.comment._id
        delete this.comment.like
        addComment(this.type, this.comment).then(res => {
          this.$root.$dialogLoader.showSnackbar(res.message, { color: 'success' })
          this.reset()
          this.getList()
        })
      } else {
        this.valid = false
        this.$root.$dialogLoader.showSnackbar('信息有误，请重新填写！', { color: 'error' })
      }
    },
    reset() {
      this.$refs.addForm.reset()
      this.$refs.addForm.resetValidation()
    }
  }
}
</script>

<style scoped>
.form-btns {
  width: 300px;
}
.form-btns .v-btn {
  width: 150px;
}

.comment-container-top:not([disabled]) + .comment-container > div:first-child {
  border-top: 0;
}
.comment-thread {
  border-top: 1px solid rgba(0, 0, 0, 0.13);
}
.comment-avatar {
  float: left;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  overflow: hidden;
}
.comment-body {
  padding-left: 74px;
}
.comment-user {
  position: relative;
  color: #777;
  display: flex;
  align-items: center;
}
.comment-user a {
  color: #777 !important;
  font-size: 14px;
}
.comment-user-name {
  font-family: MicrosoftYaHei-Bold;
  font-size: 14px;
  color: #6d757a;
  font-weight: bold;
}
.comment-user-name a {
  color: #6d757a;
}
.comment-user .comment-floor {
  position: absolute;
  right: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
}
.comment-text {
  font-size: 14px;
  line-height: 1.5em;
  margin-top: 8px;
  word-wrap: break-word;
  position: relative;
  overflow: hidden;
  min-height: 1em;
  color: rgba(0, 0, 0, 0.85);
}
.comment-text-mobile {
  display: none;
  font-size: 14px;
  line-height: 1.5em;
  margin-top: 8px;
  word-wrap: break-word;
  position: relative;
  overflow: hidden;
  min-height: 1em;
  color: rgba(0, 0, 0, 0.85);
}
.comment-footer {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  line-height: 20px;
  padding-top: 12px;
}
.comment-footer > span .v-icon {
  color: rgba(0, 0, 0, 0.35);
  opacity: 0.6;
  transition: opacity 0.15s linear 0s;
  cursor: pointer;
}
.comment-footer > span .v-icon:hover {
  opacity: 1;
}
.comment-post .comment-report,
.comment-post .comment-delete {
  display: none;
}
.comment-post:hover .comment-report,
.comment-report[reported],
.comment-post:hover .comment-delete {
  display: initial;
  opacity: 1;
}
</style>
