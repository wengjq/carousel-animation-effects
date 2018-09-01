(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.library = factory());
}(this, (function () { 'use strict';

  /* global document:true */
  /* eslint no-undef: "error" */
  function extend(dst, src) {
    if (dst && src) {
      for (const key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
          dst[key] = src[key];
        }
      }
    }
    return dst;
  }

  function getElementWidth(el) {
    return el.getBoundingClientRect().width || el.offsetWidth;
  }

  function getElementHeight(el) {
    return el.getBoundingClientRect().height || el.offsetHeight;
  }

  function css(el, prop, val) {
    const style = el && el.style;

    if (style) {
      if (typeof val === 'undefined') {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return (typeof prop === 'undefined') ? val : val[prop];
      }

      if (!(prop in style)) {
        prop = `-webkit-${prop}`;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }

    return undefined;
  }

  function vendorCss(el, prop, val) {
    css(el, `Webkit${prop}`, val);
    css(el, `Moz${prop}`, val);
    css(el, `ms${prop}`, val);
    css(el, `O${prop}`, val);

    css(el, prop, val);
  }

  function cssList(elements, prop, val) {
    [...elements].forEach((item) => {
      css(item, prop, val);
    });
  }


  function addAnimationEndEvent(elem, endEvent) {
    elem.addEventListener('animationend', endEvent, false);
    elem.addEventListener('webkitAnimationEnd', endEvent, false);
    elem.addEventListener('oAnimationEnd', endEvent, false);
    elem.addEventListener('oanimationend', endEvent, false);
    elem.addEventListener('msAnimationEnd', endEvent, false);

    return true;
  }

  function removeAnimationEndEvent(elem, endEvent) {
    elem.removeEventListener('animationend', endEvent, false);
    elem.removeEventListener('webkitAnimationEnd', endEvent, false);
    elem.removeEventListener('oAnimationEnd', endEvent, false);
    elem.removeEventListener('oanimationend', endEvent, false);
    elem.removeEventListener('msAnimationEnd', endEvent, false);

    return true;
  }

  const checkBrowser = (function() {
    const animationProperties = ['animation', 'MozAnimation', 'webkitAnimation', 'msAnimation', 'OAnimation'];
    const transformProperties = ['transform', 'MozTransform', 'webkitTransform', 'msTransform', 'OTransform'];
    const opacityProperties = ['opacity', 'MozOpacity', 'webkitOpacity', 'msOpacity', 'OOpacity'];
    const div = document.createElement('div');
    let props;
    const result = {};

    return function(flag) {
      if (typeof result[flag] === 'boolean') {
        return result[flag];
      }

      switch (flag) {
        case 'animation':
          props = animationProperties;
          break;
        case 'transform':
          props = transformProperties;
          break;
        case 'opacity':
          props = opacityProperties;
          break;
        default:
          props = animationProperties;
      }

      for (let i = 0, len = props.length; i < len; i += 1) {
        if (div.style[props[i]] !== undefined) {
          result[flag] = true;

          return result[flag];
        }
      }

      result[flag] = false;

      return result[flag];
    };
  }());

  function parseDom(nodelist) {
    const $div = document.createElement('div');

    $div.innerHTML = nodelist;

    return $div.childNodes[0];
  }

  function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;

    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }

  /* global document */

  class Carousel {
    constructor(el, options) {
      if (!(el && el.nodeType && el.nodeType === 1)) {
        throw new Error(`Carousel-animation-effects: \`el\` must be HTMLElement, and not ${{}.toString.call(el)}`);
      }

      if (!checkBrowser()) {
        throw new Error('Your browser does not support css3');
      }

      const defaults = {
        autoPlay: true, // 自动播放
        currentIndex: 0, // 开始的帧数
        speed: 1500, // 切换的速度
        duration: 4000, // 停留的时间
        effectIndex: 1, // 切换的效果
        dots: true,
        arrows: true,
        prevArrow: '<button></button>',
        nextArrow: '<button></button>',
        dotsClass: 'carousel-dots',
      };

      for (const name in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, name)) {
          if (!(name in options)) {
            options[name] = defaults[name];
          }
        }
      }
      this.el = el; // root element
      this.options = extend({}, options);

      this.container = el.querySelector('.carousel-wrap');
      this.items = this.container.children;
      this.itemsLen = this.container.children.length;

      if (this.itemsLen < 2) {
        throw new Error('the number of child nodes must be greater than 1');
      }

      this.timer = null;
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

      this.itemMaxWidth = getElementWidth(el);
      this.itemMaxHeight = getElementHeight(el);

      this.initEvent();
      this.initCarouselDom();
      this.initArrowsDom();
      this.initDotsDom();
      this.initView();
      this.initPlay(); // 开始动画
    }

    initEvent() {
      this.animating = false;
      clearTimeout(this.timer);

      for (var i = 0; i < this.itemsLen; i += 1) {
        removeAnimationEndEvent(this.items[i], this.eventAnimationEnd.bind(this));
      }
    }

    initCarouselDom() {
      let item;
      const { effectIndex } = this;

      css(this.container, 'height', this.itemMaxHeight);
      this.container.classList.add(`billboard${effectIndex}`, 'billboard');

      for (let i = 0; i < this.itemsLen; i += 1) {
        item = this.items[i];

        item.classList.add(`billboardItem_${effectIndex}`, 'billboardAnim', 'billboard_item');

        css(item, 'width', '100%');
        css(item, 'height', this.itemMaxHeight);

        if (effectIndex === 6) {
          vendorCss(item, 'transformOrigin', `50% 50% ${-this.itemMaxWidth / 2}px`);
        } else if (effectIndex === 7) {
          vendorCss(item, 'transformOrigin', `50% 50% ${-this.itemMaxHeight / 2}px`);
        } else if (effectIndex === 9 || effectIndex === 10) {
          const newItem = document.createElement('div');

          newItem.classList.add(`billboardItem_${this.effectIndex}`, `billboardItem_${effectIndex}_${i + 1}`, 'billboard_item');

          for (let j = 1; j <= 3; j += 1) {
            const itemTile = document.createElement('div');

            itemTile.classList.add(`billboardTile_${j}`, 'billboardAnim', 'billboardTile');

            vendorCss(itemTile, 'animationDuration', `${this.speed}ms`);

            if (effectIndex === 8) {
              vendorCss(itemTile, 'transformOrigin', `50% 50% ${-this.itemMaxWidth / 2}px`);
            } else {
              vendorCss(itemTile, 'transformOrigin', `50% 50% ${-this.itemMaxHeight / 2}px`);
            }

            const itemCopy = item.cloneNode(true);

            itemCopy.setAttribute('class', 'billboardImg');
            itemCopy.removeAttribute('style');

            itemCopy.children[0].classList.add('billboardImgInner');

            itemTile.appendChild(itemCopy);
            newItem.appendChild(itemTile);
          }

          item.parentNode.insertBefore(newItem, item);
          item.parentNode.removeChild(item);
        } else if (effectIndex === 12 || effectIndex === 13 || effectIndex === 14) {
          const newItem = document.createElement('div');

          newItem.classList.add('billboard_item', `billboardItem_${effectIndex}`, `billboardItem_${effectIndex}_${i + 1}`);

          css(newItem, 'width', '100%');
          css(newItem, 'height', this.itemMaxHeight);

          for (let j = 1; j <= 4; j += 1) {
            const itemTile = document.createElement('div');

            itemTile.classList.add('billboardTile', `billboardTile_${j}`);

            const itemTileImg = document.createElement('div');

            itemTileImg.classList.add('billboardAnim', 'billboardTileImg');

            vendorCss(itemTileImg, 'animationDuration', `${this.speed}ms`);

            itemTile.appendChild(itemTileImg);

            const itemCopy = item.cloneNode(true);

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

      if (effectIndex === 9 || effectIndex === 10 || effectIndex === 12
        || effectIndex === 13 || effectIndex === 14) {
        this.items = this.container.children;
        this.itemsLen = this.items.length;
      }
    }

    initDotsDom() {
      if (this.dots) {
        const fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');

        ul.classList.add(`${this.dotsClass}`);

        for (let i = 0; i < this.itemsLen; i += 1) {
          const li = document.createElement('li');

          li.setAttribute('index', i);

          if (this.currentIndex === i) {
            li.classList.add('carousel-active');
          } else {
            li.classList.remove('carousel-active');
          }

          ul.appendChild(li);
        }

        ul.addEventListener('click', (e) => {
          let { target } = e;
          while (target !== ul) {
            if (target.tagName.toLowerCase() === 'li') {
              const index = parseInt(target.getAttribute('index'), 10);

              this.goTo(index);
              break;
            }
            target = target.parentNode;
          }
        }, false);

        fragment.appendChild(ul);
        this.el.appendChild(fragment);
      }
    }

    initArrowsDom() {
      if (this.arrows) {
        const $prevArrow = parseDom(this.prevArrow);
        const $nextArrow = parseDom(this.nextArrow);

        $prevArrow.addEventListener('click', () => {
          this.prev();
        }, false);

        $nextArrow.addEventListener('click', () => {
          this.next();
        }, false);

        $prevArrow.classList.add('carousel-arrow', 'carousel-prev');
        $nextArrow.classList.add('carousel-arrow', 'carousel-next');

        this.el.insertBefore($prevArrow, this.container);
        insertAfter($nextArrow, this.container);
      }
    }

    updateDotsDom() {
      const $liList = this.el.querySelector(`.${this.dotsClass}`).children;

      $liList[this.oldIndex].classList.remove('carousel-active');
      $liList[this.currentIndex].classList.add('carousel-active');
    }

    initView() {
      let item;

      for (let i = 0; i < this.items.length; i += 1) {
        item = this.items[i];

        vendorCss(item, 'animationDuration', `${this.speed}ms`);
      }

      const currentItem = this.items[this.currentIndex];

      currentItem.classList.add(`billboardItem_${this.effectIndex}_start`);

      cssList(this.items, 'display', 'none');
      css(currentItem, 'display', 'block');
    }

    initPlay() {
      if (this.autoPlay) {
        this.play();
      }
    }

    play() {
      if (!this.animating) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.next.bind(this), this.duration);
      }
    }

    autoPlay() {
      this.autoPlay = true;
      this.play();
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
      if (index >= this.itemsLen || index < 0 || index === this.currentIndex) {
        return;
      }

      if (this.animating) {
        return;
      }

      this.newIndex = index; // 下一个帧

      if (typeof reverseAnim === 'undefined') {
        reverseAnim = (!(this.newIndex > this.currentIndex));
      }

      const currentItem = this.items[this.currentIndex];
      const newItem = this.items[this.newIndex];

      css(newItem, 'display', 'block');

      if (this.effectIndex === 11) {
        // 每次聚焦时，随机选取一个作为 transform-origin
        const origins = ['15% 15%', '85% 85%', '15% 85%', '85% 15%'];
        // 每次聚焦时，随机选取 zoomOut 或 zoomIn 模式
        const zoomModes = ['billboardItem_11_on_zoomOut', 'billboardItem_11_on_zoomIn'];
        const origin = origins[Math.floor(Math.random() * origins.length)];
        const zoomMode = zoomModes[Math.floor(Math.random() * zoomModes.length)];

        newItem.classList.add(zoomMode);
        newItem.classList.remove('billboardItem_11_off');

        vendorCss(newItem, 'transformOrigin', origin);

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

      this.updateDotsDom();

      addAnimationEndEvent(newItem, this.eventAnimationEnd.bind(this));
    }

    eventAnimationEnd() {
      if (removeAnimationEndEvent(this.items[this.newIndex], this.eventAnimationEnd.bind(this))) {
        this.animating = false;

        css(this.items[this.oldIndex], 'display', 'none');

        if (this.autoPlay) {
          clearTimeout(this.timer);

          this.timer = setTimeout(() => {
            this.next();
          }, this.duration);
        }
      }
    }
  }

  return Carousel;

})));
//# sourceMappingURL=library.js.map
