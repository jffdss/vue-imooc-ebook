<template>
  <div class="ebook" ref="ebook">
      <ebook-bookmark></ebook-bookmark>
      <ebook-header></ebook-header>
      <ebook-title></ebook-title>
      <ebook-footer></ebook-footer>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookHeader from '../../components/ebook/EbookHeader.vue'
import EbookFooter from '../../components/ebook/EbookFooter.vue'
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import { getReadTime, saveReadTime } from '../../utills/localStorage'
import { ebookMixin } from '../../utills/mixin'
export default {
  components: {
      EbookReader,
      EbookTitle,
      EbookMenu,
      EbookBookmark,
      EbookHeader,
      EbookFooter
  },
  mixins: [ebookMixin],
  watch: {
      offsetY (v) {
        if (!this.menuVisible && this.bookAvailable) {
            if (v > 0) {
                this.move(v)
            } else if (v === 0) {
                this.restore()
              }
        }
      }
  },
  methods: {
    restore () {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move (v) {
      // this.$refs.ebook.style.transition = ''
      this.$refs.ebook.style.top = v + 'px'
    },
    // 计算阅读时间并cache
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style scoped lang="scss">
 @import '../../assets/styles/global';
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
