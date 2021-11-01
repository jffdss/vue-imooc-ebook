import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { getBookmark, saveLocation } from './localStorage'

export const storeHomeMixin = {
    computed: {
        ...mapGetters([
            'offsetY',
            'hotSearchOffsetY',
            'flapCardVisible'])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible'
        ]),
        showBookDetail (book) {
            console.log('fdsfds')
        }
    }
}

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark'
            // 'speakingIconBottom'
        ]),
        themeList () {
            return themeList(this)
        },
        // 获取章节名称
        getSectionName () {
            // 有多级目录无法读取子目录
            // if (this.section) {
            //     const sectionInfo = this.currentBook.section(this.section)
            //     if (sectionInfo && sectionInfo.href &&
            //         this.currentBook && this.currentBook.navigation) {
            //         return this.currentBook.navigation.get(sectionInfo.href).label
            //     }
            // }
            // return ''
            return this.section ? this.navigation[this.section].label : ''
         }
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark'
            // 'setSpeakingIconBottom'
        ]),
        // 根据defaultTheme 设置主题
        initGlobalStyle () {
            removeAllCss()
            switch (this.defaultTheme) {
                case 'Default':
                addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
                case 'Eye':
                addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
                    break
                case 'Gold':
                addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
                    break
                case 'Night':
                addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
                    break
            }
        },
        // 获取当前进度百分比
        refreshLocation () {
            const currentLocation = this.currentBook.rendition.currentLocation()
            if (currentLocation && currentLocation.start) {
                const startCfi = currentLocation.start.cfi
                const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                this.setProgress(Math.floor(progress * 100))
                this.setSection(currentLocation.start.index)
                saveLocation(this.fileName, startCfi)
                // 判断当前页是否书签
                const bookmark = getBookmark(this.fileName)
                if (bookmark) {
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setIsBookmark(true)
                    } else {
                        this.setIsBookmark(false)
                    }
                } else {
                    this.setIsBookmark(false)
                }
            }
            if (this.pagelist) {
                const totalPage = this.pagelist.length
                const currentPage = currentLocation.start.location
                if (currentPage && currentPage > 0) {
                    this.setPaginate(currentPage + '/' + totalPage)
                } else {
                    this.setPaginate('')
                }
            } else {
                this.setPaginate('')
            }
        },
        // 根据cfi跳转阅读进度
        display (target, cb) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            }
        },
        // 隐藏 菜单 设置 字体设置窗口
        hideTitleAndMenu () {
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        // book.haveRead中$1替换为当前阅读时间
        getReadTimeText () {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
        }
    }
}
