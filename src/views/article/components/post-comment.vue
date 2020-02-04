<template>
  <!--
      模板中的 $event 表示事件参数
     -->
<div class='post-comment'>
   <van-field
    :value="value"
    @input="$emit('input', $event)"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
/>
<van-button
@click="$emit('click-post')"
type="primary"
size="small"
>发布</van-button>
</div>
</template>

<script>

export default {
  name: 'PostComment',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      message: ''

    }
  },

  computed: {},

  // 监控data中的数据变化
  watch: {},

  methods: {
    // onInput (value) {
    //   this.$emit('input', value)
    // }
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
<style scoped lang='less'>
.post-comment{
    display: flex;
    padding: 20px;
    align-items: center
}
</style>
