window.jk = window.jk || {};
window.jk.dom = (function (window) {
    "use strict";
    //
    // Helper and DOM Functions.
    // Don't want to inject a "big" library into the site.
    //

    function addClass(element, className) {
        if (!hasClass(element, className)) {
            element.className = element.className ? element.className + " " + className : className;
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
        classNames.forEach(function (className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length) {
                elements[0].classList.remove(className);
            }
        });
    }

    function removeElementsWithClasses(classNames) {
        classNames.forEach(function (className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        });
    }

    function hasLink(element) {
        return element.href && element.href !== "#";
    }

    return {
        addClass: addClass,
        hasClass: hasClass,
        insertAsFirst: insertAsFirst,
        removeClassesFromAllElements: removeClassesFromAllElements,
        removeElementsWithClasses: removeElementsWithClasses,
        hasLink: hasLink,
        elementInViewport: elementInViewport,
        isVisible: isVisible
    };
}(window));
