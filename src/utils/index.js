export function _extend(dst, src) {
    if (dst && src) {
        for (let key in src) {
            if (src.hasOwnProperty(key)) {
                dst[key] = src[key];
            }
        }
    }

    return dst;
}

function hasClass(element, cName) {
    return !!element.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};

export function addClass(element, cName) {

    if (!hasClass(element, cName)) {
        element.className += " " + cName;
    }
}

export function removeClass(element, cName) {
    if (hasClass(element, cName)) {
        element.className = element.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
    }
}

export function _getElementWidth(el) {
    return el.getBoundingClientRect().width || el.offsetWidth;
}

export function _getElementHeight(el) {
    return el.getBoundingClientRect().height || el.offsetHeight;
}

export function _vendorCss(el, prop, val) {
    _css(el, `Webkit${prop}`, val);
    _css(el, `Moz${prop}`, val);
    _css(el, `ms${prop}`, val);
    _css(el, `O${prop}`, val);

    _css(el, prop, val);
}

export function _cssList(elements, prop, val) {
    [...elements].forEach((item) => {
        _css(item, prop, val);
    });
}

export function _css(el, prop, val) {
    let style = el && el.style;

    if (style) {
        if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                val = document.defaultView.getComputedStyle(el, '');
            } else if (el.currentStyle) {
                val = el.currentStyle;
            }

            return prop === void 0 ? val : val[prop];
        } else {
            if (!(prop in style)) {
                prop = '-webkit-' + prop;
            }

            style[prop] = val + (typeof val === 'string' ? '' : 'px');
        }
    }
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
    let animationProperties = ['animation', 'MozAnimation', 'webkitAnimation', 'msAnimation', 'OAnimation'];
    let transformProperties = ['transform', 'MozTransform', 'webkitTransform', 'msTransform', 'OTransform'];
    let opacityProperties = ['opacity', 'MozOpacity', 'webkitOpacity', 'msOpacity', 'OOpacity'];
    let div = document.createElement('div');
    let props;
    let result = {};

    return function(flag) {
        if (typeof result[flag] == "boolean") {
            return result[flag];
        }

        switch (flag) {
            case "animation":
                props = animationProperties;
                break;
            case "transform":
                props = transformProperties;
                break;
            case "opacity":
                props = opacityProperties;
                break;
            default:
                props = animationProperties;
        }

        for (let i = 0, len = props.length; i < len; i++) {
            if (div.style[props[i]] !== undefined) {
                result[flag] = true;

                return result[flag];
            }
        }

        result[flag] = false;

        return result[flag];
    }
})();

export function parseDom(nodelist) {
    let $div = document.createElement("div");

    $div.innerHTML = nodelist;

    return $div.childNodes[0];
}

export function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;

    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}