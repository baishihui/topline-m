<template>
  <div id="app">
    <!-- 根路由出口 -->
    <router-view></router-view>
    <!-- <i class="iconfont icon-apple1"></i>
     <i class="iconfont icon-apple"></i>
     <van-icon name="like-o" />
     <van-icon class-prefix="icon" name="apple1" />
    <div class="box">hello</div>
     <van-button type="default">默认按钮</van-button>
<van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button> -->
  </div>
</template>

<script>
export default {
  name: 'App'

}
</script>

<style lang="less" scoped>
@import url("~@/styles/variables.less");
.box{
  color: @color-primary
}

</style>
