<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import { ebookMixin } from '../../utills/mixin'
import EbookSlide from './EbookSlide.vue'
import EbookSettingFont from './EbookSettingFont.vue'
import EbookSettingFontPopup from './EbookSettingFontPopup.vue'
import EbookSettingTheme from './EbookSettingTheme.vue'
import EbookSettingProgress from './EbookSettingProgress.vue'
export default {
  data () {
    return {

    }
  },
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  mixins: [ebookMixin],
  methods: {
      showSetting (key) {
        this.setSettingVisible(key)
      }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/global';
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(20);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, .8);
  }
}
</style>
