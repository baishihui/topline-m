<template>
<div class='channel-edit'>
 <van-cell title="我的频道" :border="false">
     <van-button type="danger"
      size="mini"
      round
      plain
      @click="isEditShow=!isEditShow"
      >{{isEditShow ? '完成' : '编辑'}}</van-button>
 </van-cell>
 <van-grid :gutter="10">
  <van-grid-item
    v-for="(channel,index) in userChannels"
    :key="channel.id"
    @click="onUserChannelClick(index)"
  >
  <span :class="{
      active:index === active}
      "
  class="text"
  slot="text"
  >
  {{channel.name}}
  </span>
  <van-icon v-show="isEditShow && index !==0" name="close" slot="icon"/>
  </van-grid-item>
</van-grid>

 <van-cell title="频道推荐" :border="false">
 </van-cell>
 <van-grid :gutter="10">
  <van-grid-item
    v-for="channel in remainingChannels"
    :key="channel.id"
    :text="channel.name"
    @click="onAdd(channel)"
  >

  </van-grid-item>
</van-grid>

</div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }

  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEditShow: false
    }
  },

  computed: {
    //   封装 获取剩余频道
    remainingChannels () {
      const channels = []
      const { userChannels, allChannels } = this
      //   遍历所有频道
      allChannels.forEach(item => {
        // 如果我的频道中 不包含所有频道 则要放到 chanels中
        if (!userChannels.find(c => c.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }

  },

  // 监控data中的数据变化
  watch: {
    // 当 userChannels 发生变化，会调用该函数
    userChannels (newVal) {
      // 同步到本地存储
      setItem('user-channels', newVal)
    }
  },

  methods: {
    //   添加频道
    onAdd (channel) {
      // 将点击的频道项添加到我的频道列表中
      this.userChannels.push(channel)

      // 不需要删除，我的频道改变，计算属性 recommendChannels 重新调用求值
    },
    // 获取全部频道列表
    async loadAllchannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    onUserChannelClick (index) {
      if (this.isEditShow && index !== 0) {
        // 如果是编辑状态 删除
        this.userChannels.splice(index, 1)
      } else {
        // 如果是完成状态 切换
        this.$emit('switch', index)
      }
    }

  },

  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.loadAllchannels()
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
<style scoped lang="less">
.channel-edit {
  padding-top: 40px;
  .channel-header {
    font-size: 16px;
    color: #333;
  }
  /deep/ .van-grid-item {
    width: 80px;
    height: 43px;
    position: relative;
    .van-grid-item__icon-wrapper {
      position: absolute;
      top: -24px;
      right: -5px;
      .van-icon-close {
        font-size: 14px;
      }
    }
    .van-grid-item__content {
      background: #f4f5f6;
    }
    .van-grid-item__text, .text {
      font-size: 14px;
      color: #222;
    }
    .active {
      color: red;
    }
  }

}
</style>
