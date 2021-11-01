<template>
  <div class="store-home">
      <search-bar></search-bar>
      <flap-card :data="random"></flap-card>
      <scroll :top="scrollTop"
      @onScroll="onScroll"
      ref="scroll">
        <div class="banner-wrapper">
            <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
        </div>
      </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import FlapCard from '../../components/home/FlapCard.vue'
import { storeHomeMixin } from '../../utills/mixin'
import { home } from '../../api/store'
export default {
  data () {
    return {
        scrollTop: 94,
        random: null,
        banner: 'http://img.daimg.com/uploads/allimg/190228/3-1Z22Q15139.jpg'
    }
  },
  components: {
      SearchBar,
      Scroll,
      FlapCard
  },
  mixins: [storeHomeMixin],
  methods: {
      onScroll (offsetY) {
          this.setOffsetY(offsetY)
          if (offsetY > 0) {
              this.scrollTop = 52
          } else {
              this.scrollTop = 94
          }
          // 刷新组件top
          this.$refs.scroll.refresh()
      }
  },
  mounted () {
      home().then(response => {
         if (response && response.status === 200) {
             const data = response.data
             const randomIndex = Math.floor(Math.random() * data.random.length)
             this.random = data.random[randomIndex]
         }
      })
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/global';
    .store-home {
        width: 100%;
        height: 100%;
        .banner-wrapper {
            padding: px2rem(10);
            box-sizing: border-box;
            .banner-img {
                width: 100%;
                height: px2rem(150);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>
