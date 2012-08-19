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

        removeClass: function (element, className) {
            var regexp = this.addClass[className];
            if (!regexp) {
                regexp = this.addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
            }
            element.className = element.className.replace(regexp, "$2");
        },

        hasClass: function (element, className) {
            var regexp = this.addClass[className];
            if (!regexp) {
                regexp = this.addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
            }
            return regexp.test(element.className);
        },

        toggleClass: function (element, className) {
            if (this.hasClass(element, className)) {
                this.removeClass(element, className);
            } else {
                this.addClass(element, className);
            }
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

        removeClassFromAllElements: function (className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                this.removeClass(elements[0], className);
            }
        },

        removeElementsWithClass: function(className) {
            var elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                this.remove(elements[0]);
            }
        },

        hasLink: function (element) {
            return element.href && element.href !== "" && element.href !== "#";
        }

    };

    //Expose the DOM functions
    window.JkDom = jkDom;

})();
