<template>
  <div class="article-list">
      <!--
      v-model="isLoading" 控制下拉刷新的 loading 状态
      @refresh 下拉刷新触发的事件
       -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">

      <van-list v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad">
        <van-cell
        v-for="(article,index) in list"
        :key="index"
        :title="article.title" />
      </van-list>

    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesByChannel } from '@/api/article'
export default {
  name: 'ArticleList',
  components: {},
  props: {
    channel: {
      type: Object, // 必须是对象
      required: true // 必须传递该数据
    }
  },
  data () {
    // 这里存放数据
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      isLoading: false // 控制下拉刷新的 loading 状态
    }
  },

  computed: {},

  watch: {},

  // 方法集合
  methods: {
    //   下拉刷新
    async onRefresh () {
      // 下拉刷新组件会自动开启 loading
      // 1. 请求数据
      const { data } = await getArticlesByChannel({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      // 2. 将数据放到列表的顶部
      const { results } = data.data
      this.list.unshift(...results)
      // 3. 关闭下拉刷新的 loading
      this.isLoading = false

      this.$toast(`更新了${results.length}条数据`)
    },
    async onLoad () {
      //  1、请求获取数据
      const { data } = await getArticlesByChannel({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })

      //  2、将数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      // 3. 停止本次的 loading
      this.loading = false
      //  4. 判断数据是否加载结束
      if (results.length) {
        this.timestamp = data.data.pre_timestamp // 更新获取下一页的时间戳
      } else {
        this.finished = true // 没有数据了，设置加载结束
      }
    }
  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},

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
