<template>
<div class='article-comments'>
  <!-- 列表组件 -->
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>

  <comment-item
  v-for="(item,index) in list"
  :key="index"
  :comment="item"
  @click-reply="$emit('click-reply',$event)"
  />
</van-list>
</div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'ArticleComment',
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20

    }
  },

  computed: {},

  // 监控data中的数据变化
  watch: {},

  methods: {
    async onLoad () {
    // 1.请求获取数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      // 2.将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 3.加载状态结束 关闭loading
      this.loading = false
      // 4.判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },

  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},

  // 生命周期 - 创建之前
  beforeCreate () {},

  // 生命周期 - 挂载之前
  beforeMount () {},

  // 生命周期 - 更新之前
  beforeUpdate () {},

  // 生命周期 - 更新之后
  updated () {},

  // 生命周期 - 销毁之前
  beforeDestroy () {},

  // 生命周期 - 销毁完成
  destroyed () {},

  // 如果页面有keep-alive缓存功能，这个函数会触发
  activated () {}
}
</script>
<style scoped>
</style>
