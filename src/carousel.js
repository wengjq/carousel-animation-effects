import {
    _extend,
    checkBrowser,
    addAnimationEndEvent,
    removeAnimationEndEvent,
    _css,
    _cssList,
    _vendorCss,
    _getElementWidth,
    _getElementHeight,
    parseDom,
    insertAfter
} from './utils/index.js';

export default class Carousel {
    constructor(el, options) {
        if (!(el && el.nodeType && el.nodeType === 1)) {
            throw 'Carousel-animation-effects: `el` must be HTMLElement, and not ' + {}.toString.call(el);
        }

        if (!checkBrowser()) {
            throw 'Your browser does not support css3';
        }

        this.el = el; // root element
        this.options = options = _extend({}, options);

        let defaults = {
            'autoPlay': true, // 自动播放
            'currentIndex': 0, // 开始的帧数
            'speed': 1500, // 切换的速度
            'duration': 4000, // 停留的时间
            'effectIndex': 1, // 切换的效果
            'dots': true,
            'arrows': true,
            'prevArrow': '<button></button>',
            'nextArrow': '<button></button>',
            'dotsClass': 'carousel-dots'
        };

        for (var name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }

        this.container = el.querySelector('.carousel-wrap');
        this.items = this.container.children;
        this.itemsLen = this.container.children.length;

        if (this.itemsLen < 2) {
            throw 'the number of child nodes must be greater than 1';
        }

        this.timer;
        this.animating = false; // 是否在动画中

        this.autoPlay = this.options.autoPlay;
        this.speed = this.options.speed;
        this.duration = this.options.duration;
        this.effectIndex = this.options.effectIndex;
        this.currentIndex = this.options.currentIndex;
        this.dots = this.options.dots;
        this.dotsClass = this.options.dotsClass;
        this.arrows = this.options.arrows;
        this.prevArrow = this.options.prevArrow;
        this.nextArrow = this.options.nextArrow;

        this.oldIndex = -1;
        this.newIndex = -1;

        this.itemMaxWidth = _getElementWidth(el);
        this.itemMaxHeight = _getElementHeight(el);

        this._initEvent();
        this._initCarouselDom();
        this._initArrowsDom();
        this._initDotsDom();
        this._initView();
        this._initPlay(); // 开始动画
    }

    _initEvent() {
        this.animating = false;
        clearTimeout(this.timer);

        for (var i = 0; i < this.itemsLen; i++) {
            removeAnimationEndEvent(this.items[i], this._eventAnimationEnd.bind(this));
        }
    }

    _initCarouselDom() {
        let item;
        let pureItem;
        let effectIndex = this.effectIndex;

        _css(this.container, 'height', this.itemMaxHeight);
        this.container.classList.add(`billboard${this.effectIndex}`, 'billboard');

        for (let i = 0; i < this.itemsLen; i++) {
            item = this.items[i];

            item.classList.add(`billboardItem_${this.effectIndex}`, 'billboardAnim', 'billboard_item');

            _css(item, 'width', '100%');
            _css(item, 'height', this.itemMaxHeight);

            if (effectIndex === 6) {
                _vendorCss(item, 'transformOrigin', `50% 50% ${-this.itemMaxWidth / 2}px`);
            } else if (effectIndex === 7) {
                _vendorCss(item, 'transformOrigin', `50% 50% ${-this.itemMaxHeight / 2}px`);
            } else if (effectIndex === 9 || effectIndex === 10) {
                let newItem = document.createElement('div');

                newItem.classList.add(`billboardItem_${this.effectIndex}`, `billboardItem_${effectIndex}_${i + 1}`, 'billboard_item');

                for (let j = 1; j <= 3; j++) {
                    let itemTile = document.createElement('div');

                    itemTile.classList.add(`billboardTile_${j}`, 'billboardAnim', 'billboardTile');

                    _vendorCss(itemTile, 'animationDuration', `${this.speed}ms`);

                    if (effectIndex === 8) {
                        _vendorCss(itemTile, 'transformOrigin', `50% 50% ${-this.itemMaxWidth / 2}px`);
                    } else {
                        _vendorCss(itemTile, 'transformOrigin', `50% 50% ${-this.itemMaxHeight / 2}px`);
                    }

                    let itemCopy = item.cloneNode(true);

                    itemCopy.setAttribute('class', 'billboardImg');
                    itemCopy.removeAttribute('style');

                    itemCopy.children[0].classList.add('billboardImgInner');

                    itemTile.appendChild(itemCopy);
                    newItem.appendChild(itemTile);
                }

                item.parentNode.insertBefore(newItem, item);
                item.parentNode.removeChild(item);
            } else if (effectIndex === 12 || effectIndex === 13 || effectIndex === 14) {
                let newItem = document.createElement('div');

                newItem.classList.add('billboard_item', `billboardItem_${effectIndex}`, `billboardItem_${effectIndex}_${i + 1}`);

                _css(newItem, 'width', '100%');
                _css(newItem, 'height', this.itemMaxHeight);

                for (let j = 1; j <= 4; j++) {
                    let itemTile = document.createElement('div');

                    itemTile.classList.add('billboardTile', `billboardTile_${j}`);

                    let itemTileImg = document.createElement('div');

                    itemTileImg.classList.add('billboardAnim', 'billboardTileImg');

                    _vendorCss(itemTileImg, 'animationDuration', `${this.speed}ms`);

                    itemTile.appendChild(itemTileImg);

                    let itemCopy = item.cloneNode(true);

                    itemCopy.setAttribute('class', 'billboardImg');
                    itemCopy.removeAttribute('style');

                    itemCopy.children[0].classList.add('billboardImgInner');

                    itemTileImg.appendChild(itemCopy);
                    newItem.appendChild(itemTile);
                }

                item.parentNode.insertBefore(newItem, item);
                item.parentNode.removeChild(item);
            }
        }

        if (effectIndex == 9 || effectIndex == 10 || effectIndex == 12 || effectIndex == 13 || effectIndex == 14) {
            this.items = this.container.children;
            this.itemsLen = this.items.length;
        }
    }

    _initDotsDom() {
        if (this.dots) {
            let fragment = document.createDocumentFragment();
            let ul = document.createElement('ul');

            ul.classList.add(`${this.dotsClass}`);

            for (let i = 0; i < this.itemsLen; i++) {
                let li = document.createElement('li');

                li.setAttribute('index', i);
                if (this.currentIndex === i) {
                    li.classList.add('carousel-active');
                }

                ul.appendChild(li);
            }

            ul.addEventListener('click', (e) => {
                let target = e.target;

                while (target !== ul) {
                    if (target.tagName.toLowerCase() === 'li') {
                        let index = parseInt(target.getAttribute('index'));

                        this.goTo(index);
                        break;
                    }
                }
            }, false);

            fragment.appendChild(ul);
            this.el.appendChild(fragment);
        }
    }

    _initArrowsDom() {
        if (this.arrows) {
            let $prevArrow = parseDom(this.prevArrow);
            let $nextArrow = parseDom(this.nextArrow);

            $prevArrow.addEventListener('click', (e) => {
                this.prev();
            }, false);

            $nextArrow.addEventListener('click', (e) => {
                this.next();
            }, false);

            $prevArrow.classList.add('carousel-arrow', 'carousel-prev');
            $nextArrow.classList.add('carousel-arrow', 'carousel-next');

            this.el.insertBefore($prevArrow, this.container);
            insertAfter($nextArrow, this.container);
        }
    }

    _updateDotsDom() {
        let $liList = this.el.querySelector(`.${this.dotsClass}`).children;

        $liList[this.oldIndex].classList.remove('carousel-active');
        $liList[this.currentIndex].classList.add('carousel-active');
    }

    _initView() {
        let item;

        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];

            _vendorCss(item, 'animationDuration', `${this.speed}ms`);
        }

        let currentItem = this.items[this.currentIndex];

        currentItem.classList.add(`billboardItem_${this.effectIndex}_start`);

        _cssList(this.items, 'display', 'none');
        _css(currentItem, 'display', 'block');
    }

    _initPlay() {
        if (this.autoPlay) {
            this._play();
        }
    }

    _play() {
        if (!this.animating) {
            clearTimeout(this.timer);
            this.timer = setTimeout(this.next.bind(this), this.duration);
        }
    }

    autoPlay() {
        this.autoPlay = true;
        this._play();
    }

    next() {
        var nextIndex = this.currentIndex + 1;

        if (nextIndex >= this.itemsLen) {
            nextIndex = 0;
        }

        this.goTo(nextIndex, false);
    }

    prev() {
        var prevIndex = this.currentIndex - 1;

        if (prevIndex < 0) {
            prevIndex = this.itemsLen - 1;
        }

        this.goTo(prevIndex, true);
    }

    // 停止动画（会让未执行完的动画执行完毕）
    stop() {
        if (!this.autoPlay) {
            return;
        }

        this.autoPlay = false;
        clearTimeout(this.timer);
    }

    // 跳到指定的图片
    goTo(index, reverseAnim) {
        // 参数处理
        if (isNaN(index) || index >= this.itemsLen || index < 0 || index == this.currentIndex) {
            return;
        }

        if (this.animating) {
            return;
        }

        this.newIndex = index; // 下一个帧

        if (typeof reverseAnim === 'undefined') {
            let reverseAnim = (this.newIndex > this.currentIndex ? false : true);
        }

        let currentItem = this.items[this.currentIndex];
        let newItem = this.items[this.newIndex];

        _css(newItem, 'display', 'block');

        if (this.effectIndex === 11) {
            // 每次聚焦时，随机选取一个作为 transform-origin
            let origins = ['15% 15%', '85% 85%', '15% 85%', '85% 15%'];
            // 每次聚焦时，随机选取 zoomOut 或 zoomIn 模式
            let zoomModes = ['billboardItem_11_on_zoomOut', 'billboardItem_11_on_zoomIn'];
            let origin = origins[Math.floor(Math.random() * origins.length)];
            let zoomMode = zoomModes[Math.floor(Math.random() * zoomModes.length)];

            newItem.classList.add(zoomMode);
            newItem.classList.remove('billboardItem_11_off');

            _vendorCss(newItem, 'transformOrigin', origin);

            currentItem.classList.add('billboardItem_11_off');
            currentItem.classList.remove('billboardItem_11_on_zoomIn', 'billboardItem_11_on_zoomOut', 'billboardItem_11_start');
        } else {
            currentItem.classList.remove(`billboardItem_${this.effectIndex}_on`, `billboardItem_${this.effectIndex}_on_reverse`);
            currentItem.classList.add(`billboardItem_${this.effectIndex}_off`);

            newItem.classList.remove(`billboardItem_${this.effectIndex}_off`, `billboardItem_${this.effectIndex}_off_reverse`);
            newItem.classList.add(`billboardItem_${this.effectIndex}_on`);

            if (reverseAnim) {
                currentItem.classList.add(`billboardItem_${this.effectIndex}_off_reverse`);
                newItem.classList.add(`billboardItem_${this.effectIndex}_on_reverse`);
            }
        }

        this.animating = true;

        this.oldIndex = this.currentIndex; // 上一个帧
        this.currentIndex = this.newIndex; // 当前帧

        this._updateDotsDom();

        addAnimationEndEvent(newItem, this._eventAnimationEnd.bind(this));
    }

    _eventAnimationEnd() {
        if (removeAnimationEndEvent(this.items[this.newIndex], this._eventAnimationEnd.bind(this))) {
            this.animating = false;

            _css(this.items[this.oldIndex], 'display', 'none');

            if (this.autoPlay) {
                clearTimeout(this.timer);

                this.timer = setTimeout(() => {
                    this.next();
                }, this.duration);
            }
        }
    }
}