window.jk = window.jk || {};
window.jk.dom = (function (window) {
    "use strict";
    //
    // Helper and DOM Functions.
    // Don't want to inject a "big" library into the site.
    //

    function each(obj, iterator, context) {
        var key, breaker = {};
        if (obj !== null) {
            for (key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) {
                        return;
                    }
                }
            }
        }
    }

    function headInArray(array) {
        return array.length > 0 ? [array[0]] : [];
    }

    function addClass(element, className) {
        if (!hasClass(element, className)) {
            element.className = element.className ? element.className + " " + className : element.className = className;
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
            return element.style.display !== "none" && isVisible(element.parentNode);
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
        });
    }

    function hasLink(element) {
        return element.href && element.href !== "" && element.href !== "#";
    }

    function nodeListToArray(tags) {
        var elements = [],
            length = tags.length,
            i;
        for (i = length; i--; elements.unshift(tags[i]));
        return elements;
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
        firstInArray: headInArray,
        nodeListToArray: nodeListToArray
    };
})(window);
