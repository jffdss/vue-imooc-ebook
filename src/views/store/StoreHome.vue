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
        <guess-you-like :data="guessYouLike"></guess-you-like>
        <recommend :data="recommend" class="recommend"></recommend>
        <featured :data="featured" class="featured" :titleText="$t('home.featured')"
                                                    :btnText="$t('home.seeAll')">
                                                    </featured>
        <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
            <category-book :data="item"></category-book>
        </div>
        <Category class="categories" :data="categories"></Category>
      </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import FlapCard from '../../components/home/FlapCard.vue'
import GuessYouLike from '../../components/home/GuessYouLike.vue'
import Recommend from '../../components/home/Recommend.vue'
import Featured from '../../components/home/Featured.vue'
import CategoryBook from '../../components/home/CategoryBook.vue'
import Category from '../../components/home/Category.vue'
import { storeHomeMixin } from '../../utills/mixin'
import { home } from '../../api/store'
export default {
  data () {
    return {
        scrollTop: 94,
        random: null,
        banner: null,
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
    }
  },
  components: {
      SearchBar,
      Scroll,
      FlapCard,
      GuessYouLike,
      Recommend,
      Featured,
      CategoryBook,
      Category
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
             this.banner = data.banner
             this.guessYouLike = data.guessYouLike
             this.recommend = data.recommend
             this.featured = data.featured
             this.categoryList = data.categoryList
             this.categories = data.categories
             console.log(this.categories)
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
        .recommend {
            margin-top: px2rem(20);
        }
        .featured {
            margin-top: px2rem(20);
        }
        .category-list-wrapper {
            margin-top: px2rem(20);
        }
        .categories {
            margin-top: px2rem(20);
        }
    }
</style>
