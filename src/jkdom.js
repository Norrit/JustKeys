(function () {

    //
    // DOM Functions.
    // Don't want to inject a "big" library into the site.
    //
    var jkDom = {

        addClass: function (element, className) {
            if (!this.hasClass(element, className)) {
                if (element.className) {
                    element.className += " " + className;
                } else {
                    element.className = className;
                }
            }
        },

        hasClass: function (element, className) {
            var regexp = this.addClass[className];
            if (!regexp) {
                regexp = this.addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
            }
            return regexp.test(element.className);
        },

        elementInViewport: function (el) {
            var rect = el.getBoundingClientRect();
            return (rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth);
        },

        isVisible: function (element) {
            if (element && element.tagName.toLowerCase() !== "body") {
                return element.style.display !== "none" &&
                    this.isVisible(element.parentNode);
            }
            return true;
        },

        insertAsFirst: function (parent, element) {
            if (parent.firstChild) {
                parent.insertBefore(element, parent.firstChild);
            } else {
                parent.appendChild(element);
            }
        },

        remove: function (element) {
            element.parentNode.removeChild(element);
        },

        removeClassesFromAllElements: function (classNames) {
            var length = classNames.length;
            for (var i = 0, className = classNames[i]; i < length; i++, className = classNames[i]) {
                var elements = document.getElementsByClassName(className);
                while (elements.length > 0) {
                    elements[0].classList.remove(className);
                }
            }
        },

        removeElementsWithClasses: function(classNames) {
            var length = classNames.length;
            for (var i = 0, className = classNames[i]; i < length; i++, className = classNames[i]) {
                var elements = document.getElementsByClassName(className);
                while (elements.length > 0) {
                    this.remove(elements[0]);
                }
            }
        },

        hasLink: function (element) {
            return element.href && element.href !== "" && element.href !== "#";
        }

    };

    //Expose the DOM functions
    window.JkDom = jkDom;

})();
