<template>
<div class='search-result'>
    <!-- 搜索结果 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
    <!-- /搜索结果 -->
</div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 默认第一页
      per_page: 20// 每页数量

    }
  },

  computed: {},

  // 监控data中的数据变化
  watch: {},

  methods: {
    async onLoad () {
    // 1.请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数
        per_page: this.per_page, // 每页数量
        q: this.q
      })
      // 2.将数据添加到列表
      const { results } = data.data
      this.list.push(...results)

      // 3.关闭loading
      this.loading = false
      // 4.判断是否还有数据
      if (results.lenght) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了
      }
      // 5.模板绑定
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
