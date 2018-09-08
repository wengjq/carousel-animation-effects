(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.carousel = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /* global document:true */

  /* eslint no-undef: "error" */
  function extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
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
    var style = el && el.style;

    if (style) {
      if (typeof val === 'undefined') {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return typeof prop === 'undefined' ? val : val[prop];
      }

      if (!(prop in style)) {
        prop = "-webkit-".concat(prop);
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }

    return undefined;
  }
  function vendorCss(el, prop, val) {
    css(el, "Webkit".concat(prop), val);
    css(el, "Moz".concat(prop), val);
    css(el, "ms".concat(prop), val);
    css(el, "O".concat(prop), val);
    css(el, prop, val);
  }
  function cssList(elements, prop, val) {
    _toConsumableArray(elements).forEach(function (item) {
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
  var checkBrowser = function () {
    var animationProperties = ['animation', 'MozAnimation', 'webkitAnimation', 'msAnimation', 'OAnimation'];
    var transformProperties = ['transform', 'MozTransform', 'webkitTransform', 'msTransform', 'OTransform'];
    var opacityProperties = ['opacity', 'MozOpacity', 'webkitOpacity', 'msOpacity', 'OOpacity'];
    var div = document.createElement('div');
    var props;
    var result = {};
    return function (flag) {
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

      for (var i = 0, len = props.length; i < len; i += 1) {
        if (div.style[props[i]] !== undefined) {
          result[flag] = true;
          return result[flag];
        }
      }

      result[flag] = false;
      return result[flag];
    };
  }();
  function parseDom(nodelist) {
    var $div = document.createElement('div');
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

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(el, options) {
      _classCallCheck(this, Carousel);

      if (!(el && el.nodeType && el.nodeType === 1)) {
        throw new Error("Carousel-animation-effects: `el` must be HTMLElement, and not ".concat({}.toString.call(el)));
      }

      if (!checkBrowser()) {
        throw new Error('Your browser does not support css3');
      }

      var defaults = {
        autoPlay: true,
        // 自动播放
        currentIndex: 0,
        // 开始的帧数
        speed: 1500,
        // 切换的速度
        duration: 4000,
        // 停留的时间
        effectIndex: 1,
        // 切换的效果
        dots: true,
        arrows: true,
        prevArrow: '<button></button>',
        nextArrow: '<button></button>',
        dotsClass: 'carousel-dots'
      };

      for (var name in defaults) {
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

    _createClass(Carousel, [{
      key: "initEvent",
      value: function initEvent() {
        this.animating = false;
        clearTimeout(this.timer);

        for (var i = 0; i < this.itemsLen; i += 1) {
          removeAnimationEndEvent(this.items[i], this.eventAnimationEnd.bind(this));
        }
      }
    }, {
      key: "initCarouselDom",
      value: function initCarouselDom() {
        var item;
        var effectIndex = this.effectIndex;
        css(this.container, 'height', this.itemMaxHeight);
        this.container.classList.add("billboard".concat(effectIndex), 'billboard');

        for (var i = 0; i < this.itemsLen; i += 1) {
          item = this.items[i];
          item.classList.add("billboardItem_".concat(effectIndex), 'billboardAnim', 'billboard_item');
          css(item, 'width', '100%');
          css(item, 'height', this.itemMaxHeight);

          if (effectIndex === 6) {
            vendorCss(item, 'transformOrigin', "50% 50% ".concat(-this.itemMaxWidth / 2, "px"));
          } else if (effectIndex === 7) {
            vendorCss(item, 'transformOrigin', "50% 50% ".concat(-this.itemMaxHeight / 2, "px"));
          } else if (effectIndex === 9 || effectIndex === 10) {
            var newItem = document.createElement('div');
            newItem.classList.add("billboardItem_".concat(this.effectIndex), "billboardItem_".concat(effectIndex, "_").concat(i + 1), 'billboard_item');

            for (var j = 1; j <= 3; j += 1) {
              var itemTile = document.createElement('div');
              itemTile.classList.add("billboardTile_".concat(j), 'billboardAnim', 'billboardTile');
              vendorCss(itemTile, 'animationDuration', "".concat(this.speed, "ms"));

              if (effectIndex === 8) {
                vendorCss(itemTile, 'transformOrigin', "50% 50% ".concat(-this.itemMaxWidth / 2, "px"));
              } else {
                vendorCss(itemTile, 'transformOrigin', "50% 50% ".concat(-this.itemMaxHeight / 2, "px"));
              }

              var itemCopy = item.cloneNode(true);
              itemCopy.setAttribute('class', 'billboardImg');
              itemCopy.removeAttribute('style');
              itemCopy.children[0].classList.add('billboardImgInner');
              itemTile.appendChild(itemCopy);
              newItem.appendChild(itemTile);
            }

            item.parentNode.insertBefore(newItem, item);
            item.parentNode.removeChild(item);
          } else if (effectIndex === 12 || effectIndex === 13 || effectIndex === 14) {
            var _newItem = document.createElement('div');

            _newItem.classList.add('billboard_item', "billboardItem_".concat(effectIndex), "billboardItem_".concat(effectIndex, "_").concat(i + 1));

            css(_newItem, 'width', '100%');
            css(_newItem, 'height', this.itemMaxHeight);

            for (var _j = 1; _j <= 4; _j += 1) {
              var _itemTile = document.createElement('div');

              _itemTile.classList.add('billboardTile', "billboardTile_".concat(_j));

              var itemTileImg = document.createElement('div');
              itemTileImg.classList.add('billboardAnim', 'billboardTileImg');
              vendorCss(itemTileImg, 'animationDuration', "".concat(this.speed, "ms"));

              _itemTile.appendChild(itemTileImg);

              var _itemCopy = item.cloneNode(true);

              _itemCopy.setAttribute('class', 'billboardImg');

              _itemCopy.removeAttribute('style');

              _itemCopy.children[0].classList.add('billboardImgInner');

              itemTileImg.appendChild(_itemCopy);

              _newItem.appendChild(_itemTile);
            }

            item.parentNode.insertBefore(_newItem, item);
            item.parentNode.removeChild(item);
          }
        }

        if (effectIndex === 9 || effectIndex === 10 || effectIndex === 12 || effectIndex === 13 || effectIndex === 14) {
          this.items = this.container.children;
          this.itemsLen = this.items.length;
        }
      }
    }, {
      key: "initDotsDom",
      value: function initDotsDom() {
        var _this = this;

        if (this.dots) {
          var fragment = document.createDocumentFragment();
          var ul = document.createElement('ul');
          ul.classList.add("".concat(this.dotsClass));

          for (var i = 0; i < this.itemsLen; i += 1) {
            var li = document.createElement('li');
            li.setAttribute('index', i);

            if (this.currentIndex === i) {
              li.classList.add('carousel-active');
            } else {
              li.classList.remove('carousel-active');
            }

            ul.appendChild(li);
          }

          ul.addEventListener('click', function (e) {
            var target = e.target;

            while (target !== ul) {
              if (target.tagName.toLowerCase() === 'li') {
                var index = parseInt(target.getAttribute('index'), 10);

                _this.goTo(index);

                break;
              }

              target = target.parentNode;
            }
          }, false);
          fragment.appendChild(ul);
          this.el.appendChild(fragment);
        }
      }
    }, {
      key: "initArrowsDom",
      value: function initArrowsDom() {
        var _this2 = this;

        if (this.arrows) {
          var $prevArrow = parseDom(this.prevArrow);
          var $nextArrow = parseDom(this.nextArrow);
          $prevArrow.addEventListener('click', function () {
            _this2.prev();
          }, false);
          $nextArrow.addEventListener('click', function () {
            _this2.next();
          }, false);
          $prevArrow.classList.add('carousel-arrow', 'carousel-prev');
          $nextArrow.classList.add('carousel-arrow', 'carousel-next');
          this.el.insertBefore($prevArrow, this.container);
          insertAfter($nextArrow, this.container);
        }
      }
    }, {
      key: "updateDotsDom",
      value: function updateDotsDom() {
        var $liList = this.el.querySelector(".".concat(this.dotsClass)).children;
        $liList[this.oldIndex].classList.remove('carousel-active');
        $liList[this.currentIndex].classList.add('carousel-active');
      }
    }, {
      key: "initView",
      value: function initView() {
        var item;

        for (var i = 0; i < this.items.length; i += 1) {
          item = this.items[i];
          vendorCss(item, 'animationDuration', "".concat(this.speed, "ms"));
        }

        var currentItem = this.items[this.currentIndex];
        currentItem.classList.add("billboardItem_".concat(this.effectIndex, "_start"));
        cssList(this.items, 'display', 'none');
        css(currentItem, 'display', 'block');
      }
    }, {
      key: "initPlay",
      value: function initPlay() {
        if (this.autoPlay) {
          this.play();
        }
      }
    }, {
      key: "play",
      value: function play() {
        if (!this.animating) {
          clearTimeout(this.timer);
          this.timer = setTimeout(this.next.bind(this), this.duration);
        }
      }
    }, {
      key: "autoPlay",
      value: function autoPlay() {
        this.autoPlay = true;
        this.play();
      }
    }, {
      key: "next",
      value: function next() {
        var nextIndex = this.currentIndex + 1;

        if (nextIndex >= this.itemsLen) {
          nextIndex = 0;
        }

        this.goTo(nextIndex, false);
      }
    }, {
      key: "prev",
      value: function prev() {
        var prevIndex = this.currentIndex - 1;

        if (prevIndex < 0) {
          prevIndex = this.itemsLen - 1;
        }

        this.goTo(prevIndex, true);
      } // 停止动画（会让未执行完的动画执行完毕）

    }, {
      key: "stop",
      value: function stop() {
        if (!this.autoPlay) {
          return;
        }

        this.autoPlay = false;
        clearTimeout(this.timer);
      } // 跳到指定的图片

    }, {
      key: "goTo",
      value: function goTo(index, reverseAnim) {
        // 参数处理
        if (index >= this.itemsLen || index < 0 || index === this.currentIndex) {
          return;
        }

        if (this.animating) {
          return;
        }

        this.newIndex = index; // 下一个帧

        if (typeof reverseAnim === 'undefined') {
          reverseAnim = !(this.newIndex > this.currentIndex);
        }

        var currentItem = this.items[this.currentIndex];
        var newItem = this.items[this.newIndex];
        css(newItem, 'display', 'block');

        if (this.effectIndex === 11) {
          // 每次聚焦时，随机选取一个作为 transform-origin
          var origins = ['15% 15%', '85% 85%', '15% 85%', '85% 15%']; // 每次聚焦时，随机选取 zoomOut 或 zoomIn 模式

          var zoomModes = ['billboardItem_11_on_zoomOut', 'billboardItem_11_on_zoomIn'];
          var origin = origins[Math.floor(Math.random() * origins.length)];
          var zoomMode = zoomModes[Math.floor(Math.random() * zoomModes.length)];
          newItem.classList.add(zoomMode);
          newItem.classList.remove('billboardItem_11_off');
          vendorCss(newItem, 'transformOrigin', origin);
          currentItem.classList.add('billboardItem_11_off');
          currentItem.classList.remove('billboardItem_11_on_zoomIn', 'billboardItem_11_on_zoomOut', 'billboardItem_11_start');
        } else {
          currentItem.classList.remove("billboardItem_".concat(this.effectIndex, "_on"), "billboardItem_".concat(this.effectIndex, "_on_reverse"));
          currentItem.classList.add("billboardItem_".concat(this.effectIndex, "_off"));
          newItem.classList.remove("billboardItem_".concat(this.effectIndex, "_off"), "billboardItem_".concat(this.effectIndex, "_off_reverse"));
          newItem.classList.add("billboardItem_".concat(this.effectIndex, "_on"));

          if (reverseAnim) {
            currentItem.classList.add("billboardItem_".concat(this.effectIndex, "_off_reverse"));
            newItem.classList.add("billboardItem_".concat(this.effectIndex, "_on_reverse"));
          }
        }

        this.animating = true;
        this.oldIndex = this.currentIndex; // 上一个帧

        this.currentIndex = this.newIndex; // 当前帧

        this.updateDotsDom();
        addAnimationEndEvent(newItem, this.eventAnimationEnd.bind(this));
      }
    }, {
      key: "eventAnimationEnd",
      value: function eventAnimationEnd() {
        var _this3 = this;

        if (removeAnimationEndEvent(this.items[this.newIndex], this.eventAnimationEnd.bind(this))) {
          this.animating = false;
          css(this.items[this.oldIndex], 'display', 'none');

          if (this.autoPlay) {
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
              _this3.next();
            }, this.duration);
          }
        }
      }
    }]);

    return Carousel;
  }();

  return Carousel;

})));
