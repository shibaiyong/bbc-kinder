/** 
 * @Desc: demo演示首页
 */
<template>
  <div class="demo-home">
    <v-header></v-header>
    <!-- 数据展示区域 -->
    <div class="data-box">
      <div class="data-box-inner">
        <section class="show-section clear-float">
          <li 
            class="float-left li-section" 
            :class="{'clickable': country.useNum !== 0}"
            @click.stop="_countryItemClick(country)"
            v-for="(country, index) in countryList" 
            :key="index">
            <div 
              class="li-header no-wrap"
              :class="{'li-used': country.useNum !== 0, 'li-noused': country.useNum ===0 }"
              :title="country.name">
              {{country.name}}
            </div>
            <div class="li-content" v-if="country.useNum !== 0" style="font-size: 14px">
              <p style="font-size: 32px; color: #ff9999">{{country.useNum}}/{{country.total}}</p>
              <p style="margin-top: 10px; font-size: 18px; color: #dbc7a9">已使用 / 总数</p>
            </div>
            <div class="li-content" style="margin-top: 30px;font-size: 32px; color: #6bd99d" v-if="country.useNum === 0">
              待接入
            </div>
          </li>
        </section>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'demo-home',
    data: function() {
      return {
        countryList: [
          {name: '城关区', total: 19, useNum: 1},
          {name: '堆龙德庆区', total: 0, useNum: 0},
          {name: '达孜区', total: 0, useNum: 0},
          {name: '林周县', total: 0, useNum: 0},
          {name: '当雄县', total: 0, useNum: 0},
          {name: '尼木县', total: 0, useNum: 0},
          {name: '曲水县', total: 0, useNum: 0},
          {name: '墨竹工卡县', total: 0, useNum: 0}
        ]
      }
    },
    methods: {
      /** 
       * 点击
      */
      _countryItemClick: function(item) {
        if (item.useNum !== 0) {
          this.$router.push('/gardens-info')
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .demo-home
    position relative
    width 100%
    height 100%
    .data-box
      position absolute
      padding 20px
      top 104px
      right 20px
      bottom 20px
      left 20px
      overflow-y auto
      border-radius 10px
      background-color rgb(255, 249, 235)
      box-shadow 0px 0px 15px 0px rgba(0, 0, 0, 0.2),inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
      .data-box-inner
        position relative
        width 100%
        height 100%
        border-radius 5px
        background-color white
        box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
        .show-section
          position absolute
          top 22px
          left 100px
          bottom 10px
          right 10px
          padding 20px
          overflow-y auto
          .li-section
            position relative
            float left
            width 217px
            height 200px
            margin 20px 22px 30px 22px
            list-style none
            border-radius 10px
            background-color #fff9eb
            border 1px solid #f7edd5
            box-shadow 0 0 1px 1px #e7d4a8 inset , -2px 2px 1px  rgba(0, 0, 0, .2), 0 -2px 1px  white, 2px 2px 1px  rgba(0, 0, 0, .2)
            .li-header
              width 130px
              height 75px
              line-height 60px
              text-align center
              font-size 22px
              margin -3px auto 0
              color white
            .li-used  
              background url(./img/first.png) no-repeat 100%
            .li-noused
              background url(./img/three.png) no-repeat 100%  
            .li-content
              width 120px
              margin 20px auto 0
              text-align center
              p
               height 35px
               line-height 35px

  @media screen and (max-width: 1700px)
    .demo-home
      .data-box
        top 94px
        right 10px
        bottom 10px
        left 10px
        padding 10px    
</style>
