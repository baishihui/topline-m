<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <!-- 通过插槽把面包按钮放进去 -->
      <van-icon name="wap-nav"
      slot="nav-right"
      class="wap-nav"
      @click="isPopupShow=true"
      />
      <van-tab :title="channel.name" v-for="channel in userChannels" :key="channel.id">
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 编辑频道 -->
    <van-popup v-model="isPopupShow"
    position="bottom"
    :style="{ height: '100%' }"
    round
    closeable
    close-icon-position="top-left"
    >
      <channel-edit
      :user-channels="userChannels"
      :active="active"
      @switch="onChannelsSwitch"
      />
    </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getUserChannels } from '@/api/channel'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  data () {
    return {
      active: 0, // 控制标签页的激活项
      userChannels: [], // 接收用户频道列表
      isPopupShow: false
    }
  },
  methods: {
    async loadUserChannels () {
      try {
        // 1. 声明变量存储频道数据
        let channels = []

        // 2. 获取本地存储的频道列表
        const localUserChannels = getItem('user-channels')

        // 3. 如果有本地存储的则使用本地存储逇
        if (localUserChannels) {
          channels = localUserChannels
        } else {
          // 4. 如果没有本地存储的，则使用接口的
          const { data } = await getUserChannels()
          channels = data.data.channels
        }

        // 5. 将数据赋值给当前组件数据
        this.userChannels = channels
      } catch (err) {
        console.log(err)
        this.$toast('获取频道数据失败')
      }
    },
    onChannelsSwitch (index) {
      this.isPopupShow = false // 关闭弹层
      this.active = index // 切换激活频道
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadUserChannels()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 90px;
  padding-bottom: 50px;
}
.wap-nav{
 position: fixed;
 right: 0;
 background: #fff;
 line-height: 44px;
 opacity: .9;
}

/deep/ .van-tabs__wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
