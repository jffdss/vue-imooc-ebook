<template>
    <transition name="slide-up">
    <div class="setting-wrapper" v-show="settingVisible == 1">
        <div class="setting-theme" >
            <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index"
            @click="setTheme(index)">
            <div class="preview" :style="{background: item.style.body.background} "
            ></div>
            <div class="text" :class="{'selected': item.name  === defaultTheme}">{{item.alias}}</div>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
import { ebookMixin } from '../../utills/mixin'
import { saveTheme } from '../../utills/localStorage'
export default {
  data () {
    return {
    }
  },
  mixins: [ebookMixin],
  methods: {
      setTheme (index) {
          const theme = this.themeList[index]
          saveTheme(this.fileName, theme.name)
          this.setDefaultTheme(theme.name).then(() => {
              this.currentBook.rendition.themes.select(this.defaultTheme)
          })
          this.initGlobalStyle()
      }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/global';
    .setting-wrapper {
        position: absolute;
        bottom: px2rem(48);
        left: 0;
        z-index: 101;
        width: 100%;
        height: px2rem(60);
        background: white;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
        .setting-theme {
          display: flex;
          height: 100%;
          .setting-theme-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: px2rem(5);
            box-sizing: border-box;
            .preview {
              flex: 1;
              border: px2rem(1) solid #ccc;
            }
            .text {
              flex: 0 0 px2rem(20);
              font-size: px2rem(14);
              color: #ccc;
              @include center;
              &.selected {
                color: #333;
                box-shadow: 0 px2rem(4) px2rem(6) rgba(0, 0, 0, .1);
              }
            }
          }
        }
    }
</style>
