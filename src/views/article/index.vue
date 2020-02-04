<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 -->
    <van-loading
      v-if="loading"
      class="loading"
      color="#1989fa"
      vertical
    >
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->

    <!-- 文章详情 -->
    <div v-else-if="article.title" class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div class="text">
            <p class="name">{{ article.aut_name }}</p>
             <p class="time">{{ article.pubdate | relativeTime }}</p>
          </div>
        </div>
        <van-button
        @click="onFollow"
        v-if="!user || article.aut_id !== user.id"
        class="follow-btn"
        :type="article.is_followed ? 'default' : 'info'"
        size="small"
        :loading="isFollowLoading"
        round>{{article.is_followed ? '已关注' : '+ 关注'}}</van-button>
      </div>
      <div class="markdown-body" v-html="article.content"></div>
      <!-- 文章评论 -->
       <article-comment
       :article-id="articleId"
       ref="article-comment"
       @click-reply="onReplyShow"
        />
         <!-- /文章评论 -->
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败提示 -->
    <div v-else class="error">
      <img src="./no-network.png" alt="no-network">
      <p class="text">亲，网络不给力哦~</p>
      <van-button
        class="btn"
        type="default"
        size="small"
        @click="loadArticle"
      >点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->

    <!-- 底部区域 -->
    <div class="footer">
      <van-button
      @click="isPostShow=true"
        class="write-btn"
        type="default"
        round
        size="small"
      >写评论</van-button>
      <van-icon
        class="comment-icon"
        name="comment-o"
        info="9"
      />
      <van-icon
        color="orange"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        color="#e5645f"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->
    <!-- 发布文章评论 -->
      <van-popup
        v-model="isPostShow"
        position="bottom"
        :style="{ height: '20%' }"
        >
         <!--
        在组件上使用 v-model
          :value="postMessage"
          @input="postMessage = 事件参数"
        本质还是父子通信
       -->
        <post-comment v-model="postMessage" @click-post="onPost"/>
        </van-popup>
    <!-- /发布文章评论 -->
     <!-- 回复文章评论 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        :style="{ height: '80%' }">
       <comment-reply :comment="currentComment" :article-id="articleId" />
        </van-popup>
    <!-- /回复文章评论 -->
  </div>
</template>

<script>
import {
  getArticlesById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import ArticleComment from './components/article-comment'

import PostComment from './components/post-comment'
import { addComments } from '@/api/comment'
import CommentReply from './components/comment-reply'
// vuex 模块提供了一些辅助方法，专门用来让我们更方便的获取容器中的数据
// mapState：映射获取 state 数据
// mapMutation：映射获取 mutation 数据
// maoAction：映射获取 action 数据
import { mapState } from 'vuex'
export default {
  name: 'ArticlePage',
  components: {
    ArticleComment,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 文章加载中的 loading 状态
      isFollowLoading: false, // 关注按钮的 loading 状态
      isPostShow: false, // 发布评论的弹层显示状态
      postMessage: '', // 发布评论内容
      isReplyShow: false, // 回复文章的弹层显示
      currentComment: {} // 点击回复对象
    }
  },
  computed: {
    // mapState 方法返回一个对象，对象中就是映射过来的容器中的数据成员
    // ... 操作符就是把一个对象展开，混入当前对象中
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticlesById(this.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 收藏文章
    async  onCollect () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 如果收藏，就取消收藏
        if (this.article.is_collected) {
          await deleteCollect(this.articleId)
          this.article.is_collected = false
          this.$toast.success('取消收藏')
        } else {
        // 添加收藏
          await addCollect(this.articleId)
          this.article.is_collected = true
          this.$toast.success('收藏成功')
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    // 点赞文章
    async onLike () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
      // 如果点赞了，就取消
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('取消点赞')
        } else {
          // 点赞
          await addLike(this.articleId)
          this.article.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    // 关注文章
    async onFollow () {
      this.isFollowLoading = true
      try {
        const authorId = this.article.aut_id
        // 如果已关注，则取消关注
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 添加关注
          await addFollow(authorId)
        }
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    },
    // 发布评论
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })

      try {
        const { data } = await addComments({
          target: this.articleId,
          content: this.postMessage
        })
        console.log(data)

        // 清空文本框
        this.postMessage = ''
        // 关闭弹层
        this.isPostShow = false
        // 将数据添加到顶部
        this.$refs['article-comment'].list.unshift(data.data.new_obj)
        this.$toast.success('留言成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('留言失败')
      }
    },
    // 回复评论
    async onReplyShow (comment) {
      // 将点击回复的对象存起来
      this.currentComment = comment
      // 开启弹层
      this.isReplyShow = true
    }

  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  padding: 46px 20px 100px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3A3A3A;
    }
    .author-wrap {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 35px;
          height: 35px;
          margin-right: 5px;
        }
        .text {
          .name {
            margin: 0;
            font-size: 12px;
          }
          .time {
            margin: 0;
            font-size: 10px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
</style>
