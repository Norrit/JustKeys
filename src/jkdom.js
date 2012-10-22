window.jk = window.jk || {};
window.jk.dom = (function (window) {
    //
    // Helper and DOM Functions.
    // Don't want to inject a "big" library into the site.
    //

    // Collection functions each, map, reduce, filter and any taken from underscore.js
    // https://github.com/documentcloud/underscore/blob/master/underscore.js
    var breaker = {},
        nativeForEach = Array.prototype.forEach,
        nativeMap = Array.prototype.map,
        nativeReduce = Array.prototype.reduce,
        nativeFilter = Array.prototype.filter,
        nativeSome = Array.prototype.some;

    function each(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    }

    function map(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        each(obj, function (value, index, list) {
            results[index] = iterator.call(context, value, index, list);
        });
        return results;
    }

    function reduce(obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function (value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value, index, list);
            }
        });
        if (!initial) throw new TypeError('Reduce of empty array with no initial value');
        return memo;
    }

    function filter(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
        each(obj, function (value, index, list) {
            if (iterator.call(context, value, index, list)) results[results.length] = value;
        });
        return results;
    }

    function any(obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = false;
        if (obj == null) return result;
        if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
        each(obj, function (value, index, list) {
            if (result || (result = iterator.call(context, value, index, list))) return breaker;
        });
        return !!result;
    }

    function firstInArray(array) {
        return array.length > 0 ? [array[0]] : [];
    }

    function addClass(element, className) {
        if (!hasClass(element, className)) {
            if (element.className) {
                element.className += " " + className;
            } else {
                element.className = className;
            }
        }
    }

    function hasClass(element, className) {
        var regexp = addClass[className];
        if (!regexp) {
            regexp = addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
        }
        return regexp.test(element.className);
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth);
    }

    function isVisible(element) {
        if (element && element.tagName.toLowerCase() !== "body") {
            return element.style.display !== "none" &&
                isVisible(element.parentNode);
        }
        return true;
    }

    function insertAsFirst(parent, element) {
        if (parent.firstChild) {
            parent.insertBefore(element, parent.firstChild);
        } else {
            parent.appendChild(element);
        }
    }

    function removeClassesFromAllElements(classNames) {
        each(classNames, function (className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].classList.remove(className);
            }
        });
    }

    function removeElementsWithClasses(classNames) {
        each(classNames, function (className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        })
    }

    function hasLink(element) {
        return element.href && element.href !== "" && element.href !== "#";
    }

    return {
        addClass: addClass,
        hasClass: hasClass,
        insertAsFirst: insertAsFirst,
        removeClassesFromAllElements: removeClassesFromAllElements,
        removeElementsWithClasses: removeElementsWithClasses,
        hasLink: hasLink,
        elementInViewport: elementInViewport,
        isVisible: isVisible,
        each: each,
        map: map,
        reduce: reduce,
        filter: filter,
        any: any,
        firstInArray: firstInArray
    };
})(window);
