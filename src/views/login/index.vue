<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"></van-nav-bar>
     <!--
      表单验证
      1、使用 ValidationObserver 组件把需要验证的整个表单包起来
      2、使用 ValidationProvider 组件把具体的表单元素包起来，例如 input
         name   配置字段的提示名称
         rules  配置校验规则
         v-slot="{ errors }" 获取校验失败的错误提示消息
     -->
    <!-- 表单 -->
    <ValidationObserver ref="form">
      <ValidationProvider name="手机号" rules='required|mobile' immediate>
          <van-field v-model="user.mobile" placeholder="请输入手机号" >
        <i class="icon icon-phone" slot="left-icon"></i>
      </van-field>
      </ValidationProvider>
     <ValidationProvider name="验证码" rules='required|code' immediate>
        <van-field v-model="user.code" placeholder="请输入验证码" >
        <i class="icon icon-iconfontmima1" slot="left-icon"></i>
         <!-- 倒计时 -->
         <van-count-down
         @finish="isCountDown=false"
         v-if="isCountDown"
         slot="button"
         :time="1000*60"
         format="ss 秒"
          />
          <!-- 验证码 -->
          <van-button @click="onSendSmsCode" v-else slot="button" round  size="small" type="primary">发送验证码</van-button>
      </van-field>
     </ValidationProvider>

    </ValidationObserver>

    <!-- 按钮 -->
    <div class="login-btn-box">
       <van-button  type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user'
import { validate } from 'vee-validate'
export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: ''// 短信验证码
      },
      isCountDown: false
    }
  },
  methods: {
    // 登录请求数据
    async onLogin () {
      // 获取表单数据
      const user = this.user
      // 表单验证
      const success = await this.$refs.form.validate()
      if (!success) {
        // 注意：如果你需要在 JS 验证中能马上获取到错误消息
        // 必须给每一个 ValidationProvider 配置 immediate 初始验证
        const items = this.$refs.form.errors
        for (let key in items) {
          const item = items[key]
          if (item[0]) {
            this.$toast(item[0])

            // 找到第1个有错误的消息，给出提示，停止遍历
            return
          }
        }

        return
      }
      // 开启登陆中。。。
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '登录中...',
        forbidClick: true
      })
      // 发请求
      try {
        let { data } = await login(user)
        console.log(data)
        // 将登录成功获取到的用户 token 相关数据存储到 Vuex 容器
        this.$store.commit('setUser', data.data)

        // 成功提示
        this.$toast.success('登录成功')
        // 回到首页
        this.$router.push('/')
      } catch (error) {
        console.log('登录失败', error)
        // 失败提示
        this.$toast.fail('登录失败,手机号或验证码不正确')
      }
    },
    // 发送验证码
    async onSendSmsCode () {
      try {
        let { mobile } = this.user
        // 1、校验
        const validateResult = await validate(mobile, 'required|mobile', {
          name: '手机号'
        })

        // 如果验证失败，提示错误消息，停止发送验证码
        if (!validateResult.valid) {
          this.$toast(validateResult.errors[0])
          return
        }

        // 2、显示倒计时
        this.isCountDown = true

        // 3、请求发送短信验证码
        let res = await getSmsCode(mobile)
        console.log(res)
      } catch (error) {
        console.log(error)
        // 关闭验证码显示
        this.isCountDownShow = false
        this.$toast('请勿频繁操作')
      }
    }

  }
}
</script>

<style lang="less" scoped>

.login{
  .login-btn-box{
    padding: 27px 16px;
    .van-button{
      width: 100%;
      background-color:#6db4fb;
    }
  }
  .van-cell{
     height: 45px;
     align-items: center;
  }
}
</style>
