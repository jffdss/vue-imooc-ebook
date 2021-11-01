<template>
  <div class="ebook-reader">
      <div id="read"></div>
      <div class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseup="onMouseEnd"></div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utills/mixin'
import { flatten } from '../../utills/book'
import Epub from 'epubjs'
import {
         saveFontFamily, getFontFamily,
         saveFontSize, getFontSize,
         saveTheme, getTheme, getLocation
         } from '../../utills/localStorage'
// 全局添加ePub
global.ePub = Epub
export default {
  data () {
    return {

    }
  },
  mixins: [ebookMixin],
  methods: {
    //   设置默认主题
      initTheme () {
          let defaultTheme = getTheme(this.fileName)
          if (!defaultTheme) {
           defaultTheme = this.themeList[0].name
           saveTheme(this.fileName, defaultTheme)
          }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
            this.rendition.themes.register(theme.name, theme.style)
          })
            this.rendition.themes.select(defaultTheme)
      },
    //   设置默认字体
      initFontFamily () {
                const font = getFontFamily(this.fileName)
                if (!font) {
                    saveFontFamily(this.fileName, this.defaultFontFamily)
                } else {
                    this.rendition.themes.font(font)
                    this.setDefaultFontFamily(font)
                }
      },
    //   设置默认字体大小
      initFontSize () {
              const fontSize = getFontSize(this.fileName)
              if (!fontSize) {
                  saveFontSize(this.fileName, this.defaultFontSize)
              } else {
                  this.currentBook.rendition.themes.fontSize(fontSize + 'px')
                  this.setDefaultFontSize(fontSize)
              }
      },
    //   翻页
      prevPage () {
          if (this.rendition) {
              this.rendition.prev().then(() => { this.refreshLocation() })
              this.hideTitleAndMenu()
          }
      },
      nextPage () {
          if (this.rendition) {
              this.rendition.next().then(() => { this.refreshLocation() })
              this.hideTitleAndMenu()
          }
      },
    //   显示菜单栏功能
      toggleTitleAndMenu () {
          if (this.menuVisible) {
              this.setSettingVisible(-1)
              this.setFontFamilyVisible(false)
          }
          this.setMenuVisible(!this.menuVisible)
      },
    //   触控事件
      move (e) {
          let offsetY = 0
          if (this.firstOffsetY) {
              offsetY = e.changedTouches[0].clientY - this.firstOffsetY
              this.setOffsetY(offsetY)
          } else {
              this.firstOffsetY = e.changedTouches[0].clientY
          }
          e.preventDefault()
          e.stopPropagation()
      },
      moveEnd (e) {
          this.setOffsetY(0)
          this.firstOffsetY = null
      },
    //   鼠标事件
      onMouseEnter (e) {
          this.mouseState = 1
          this.mouseStartTime = e.timeStamp
          e.preventDefault()
          e.stopPropagation()
      },
      onMouseMove (e) {
          if (this.mouseState === 1) {
              this.mouseState = 2
            } else if (this.mouseState === 2) {
                    let offsetY = 0
                    if (this.firstOffsetY) {
                        offsetY = e.clientY - this.firstOffsetY
                        this.setOffsetY(offsetY)
                    } else {
                        this.firstOffsetY = e.clientY
                    }
                }
         e.preventDefault()
         e.stopPropagation()
      },
      onMouseEnd (e) {
          if (this.mouseState === 2) {
              this.setOffsetY(0)
              this.firstOffsetY = null
              this.mouseState = 3
          } else {
              this.mouseState = 4
          }
          const time = e.timeStamp - this.mouseStartTime
          if (time < 100) {
              this.mouseState = 4
          }
          e.preventDefault()
          e.stopPropagation()
      },
    //   点击事件
      onMaskClick (e) {
          if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
              return
          }
          const offsetX = e.offsetX
          const width = window.innerWidth
          if (offsetX > 0 && offsetX < width * 0.3) {
              this.prevPage()
          } else if (offsetX > 0 && offsetX > width * 0.7) {
              this.nextPage()
          } else {
              this.toggleTitleAndMenu()
          }
      },
    //   Rendition 渲染图书功能
      initRendition () {
          this.rendition = this.book.renderTo('read', {
              with: innerWidth,
              height: innerHeight
          })
          const location = getLocation(this.fileName)
          this.display(location, () => {
              this.initFontFamily()
              this.initFontSize()
              this.initTheme()
              this.initGlobalStyle()
              this.refreshLocation()
          })
          // 注入字体
          this.rendition.hooks.content.register(contents => {
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        })
      },
    //   全局手势
    //   initGesture () {
    //       this.rendition.on('touchstart', event => {
    //         this.touchStartX = event.changedTouches[0].clientX
    //         this.touchStartTime = event.timeStamp
    //     })
    //     this.rendition.on('touchend', event => {
    //         const offsetX = event.changedTouches[0].clientX - this.touchStartX
    //         const time = event.timeStamp - this.touchStartTime
    //         if (time < 500 && offsetX > 40) {
    //             this.prevPage()
    //         } else if (time < 500 && offsetX < -40) {
    //             this.nextPage()
    //         } else {
    //             this.toggleTitleAndMenu()
    //         }
    //         // event.preventDefault()// 禁止事件默认方法调用
    //         event.stopPropagation()// 禁止传播
    //     })
    //   },
      // new book 之后
      parseBook () {
          //   获取书籍封面url 和 metadata
          this.book.loaded.cover.then(cover => {
              this.book.archive.createUrl(cover).then(url => {
                  this.setCover(url)
              })
          })
          this.book.loaded.metadata.then(metadata => {
              this.setMetadata(metadata)
          })
        //   二维数组目录转一维数组目录
          this.book.loaded.navigation.then(nav => {
              const navItem = flatten(nav.toc)
              function find (item, level = 0) {
                  return !item.parent ? level : find(navItem.filter(parentItem =>
                  parentItem.id === item.parent)[0], ++level)
              }
              navItem.forEach(item => {
                  item.level = find(item)
              })
              this.setNavigation(navItem)
          })
      },
    //   拼接图书url 并渲染图书
      initEpub () {
          const url = process.env.VUE_APP_RES_URL + /epub/ + this.fileName + '.epub'
          console.log(url)
          this.book = new Epub(url)
          console.log(this.book)
          this.setCurrentBook(this.book)
          this.initRendition()
        //   this.initGesture()
          this.parseBook()
          // 图书渲染完成后
          this.book.ready.then(() => {
            //   分页算法
              return this.book.locations.generate(750 * (window.innerWidth / 375) *
              (getFontSize(this.fileName) / 16)).then(locations => {
                  this.navigation.forEach(nav => {
                      nav.pagelist = []
                  })
                  locations.forEach(item => {
                      const loc = item.match(/\[(.*)\]!/)[1]
                      this.navigation.forEach(nav => {
                          if (nav.href) {
                              const href = nav.href.match(/^(.*)\.html$/)[1]
                              if (href === loc) {
                                  nav.pagelist.push(item)
                              }
                          }
                      })
                      let currentPage = 1
                      this.navigation.forEach((nav, index) => {
                          if (index === 0) {
                              nav.page = 1
                          } else {
                              nav.page = currentPage
                          }
                          currentPage += nav.pagelist.length + 1
                      })
                  })
                this.setPagelist(locations)
                this.setBookAvailable(true)
                this.refreshLocation()
              })
          })
      }
  },
  mounted () {
    //   获取图书url
      this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => { this.initEpub() })
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/global';
.ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: orange;
    .ebook-reader-mask {
        position: absolute;
        top: 0;
        left: 0;
        background: transparent;
        z-index: 101;
        width: 100%;
        height: 100%;
    }
}
</style>
