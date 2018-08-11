/* global document:true */
/* eslint no-undef: "error" */
export function extend(dst, src) {
  if (dst && src) {
    for (const key in src) {
      if (Object.prototype.hasOwnProperty.call(src, key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}

export function getElementWidth(el) {
  return el.getBoundingClientRect().width || el.offsetWidth;
}

export function getElementHeight(el) {
  return el.getBoundingClientRect().height || el.offsetHeight;
}

export function css(el, prop, val) {
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

export function vendorCss(el, prop, val) {
  css(el, `Webkit${prop}`, val);
  css(el, `Moz${prop}`, val);
  css(el, `ms${prop}`, val);
  css(el, `O${prop}`, val);

  css(el, prop, val);
}

export function cssList(elements, prop, val) {
  [...elements].forEach((item) => {
    css(item, prop, val);
  });
}


export function addAnimationEndEvent(elem, endEvent) {
  elem.addEventListener('animationend', endEvent, false);
  elem.addEventListener('webkitAnimationEnd', endEvent, false);
  elem.addEventListener('oAnimationEnd', endEvent, false);
  elem.addEventListener('oanimationend', endEvent, false);
  elem.addEventListener('msAnimationEnd', endEvent, false);

  return true;
}

export function removeAnimationEndEvent(elem, endEvent) {
  elem.removeEventListener('animationend', endEvent, false);
  elem.removeEventListener('webkitAnimationEnd', endEvent, false);
  elem.removeEventListener('oAnimationEnd', endEvent, false);
  elem.removeEventListener('oanimationend', endEvent, false);
  elem.removeEventListener('msAnimationEnd', endEvent, false);

  return true;
}

export const checkBrowser = (function() {
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

export function parseDom(nodelist) {
  const $div = document.createElement('div');

  $div.innerHTML = nodelist;

  return $div.childNodes[0];
}

export function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;

  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}
