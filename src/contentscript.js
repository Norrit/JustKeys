(function (JkDom) {

    var JK_HIGHLIGHT_CLASS = "jkHighlight";
    var JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber";
    var JK_FILTERED_CLASS = "jkFiltered";
    var JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber";
    var JK_SELECTED_CLASS = "jkSelected";
    var JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber";

    var highlights;
    var action;

    function highlight(elements, text) {

        function highlightElement(element, number, highlightClass, numberClass) {
            var label = document.createElement("span");
            label.innerText = number;
            JkDom.addClass(label, numberClass);
            JkDom.addClass(element, highlightClass);
            JkDom.insertAsFirst(element, label);
        }

        function highlightElements(elements, highlightClass, numberClass) {
            for (var i in elements) {
                highlightElement(elements[i], i, highlightClass, numberClass);
            }
        }

        var selected = (function () {
            for (var i in elements) {
                var selected = {};
                if (text != "" && i.toString().indexOf(text) === 0) {
                    selected[i] = elements[i];
                    break;
                }
            }
            return selected;
        })(),

        filtered = (function () {
            var filtered = {};
            for (var i in elements) {
                if (text != "" && i.toString().indexOf(text) === 0 && !selected[i]) {
                    filtered[i] = elements[i];
                }
            }
            return filtered;
        })(),

        highlighted = (function () {
            var highlighted = {};
            for (var i in elements) {
                if (!selected[i] && !filtered[i]) {
                    highlighted[i] = elements[i];
                }
            }
            return highlighted;
        })();


        var h = {
            highlightElements:function () {
                this.reset();
                highlightElements(highlighted,JK_HIGHLIGHT_CLASS, JK_HIGHLIGHT_NUMBER_CLASS);
                highlightElements(filtered,JK_FILTERED_CLASS, JK_FILTERED_NUMBER_CLASS);
                highlightElements(selected,JK_SELECTED_CLASS, JK_SELECTED_NUMBER_CLASS);
            },

            reset:function () {
                JkDom.removeClassFromAllElements(JK_HIGHLIGHT_CLASS);
                JkDom.removeClassFromAllElements(JK_FILTERED_CLASS);
                JkDom.removeClassFromAllElements(JK_SELECTED_CLASS);
                JkDom.removeElementsWithClass(JK_HIGHLIGHT_NUMBER_CLASS);
                JkDom.removeElementsWithClass(JK_FILTERED_NUMBER_CLASS);
                JkDom.removeElementsWithClass(JK_SELECTED_NUMBER_CLASS);
            },

            selectedElement:function () {
                for (var first in selected) return selected[first];
            },

            text:function () {
                return text;
            },

            elements:function () {
                return elements;
            }
        };
        h.highlightElements();
        return h;
    }

    function highlightableElements() {
        var shouldHighlight = function (element) {
            return JkDom.hasLink(element) && JkDom.elementInViewport(element) && JkDom.isVisible(element);
        };
        var elements = document.getElementsByTagName("a");
        var highlightable = {};
        var number = 1;
        for (var i = 0; i < elements.length; i++) {
            if (shouldHighlight(elements[i])) {
                highlightable[number++] = elements[i];
            }
        }
        return highlightable;
    }

    function bindSelectionKeys() {
        var bindSelectionNumberKey = function (index) {
            bindKeys(index, function () {
                var text = highlights.text() + index;
                var elements = highlights.elements();
                highlights = highlight(elements, text);
            });
        };
        bindKeys("esc", function () {
            reset();
        });
        bindKeys("return", function () {
            var selected = highlights.selectedElement();
            if (selected) {
                action(selected.href);
            }
        });
        bindKeys("d", function () {
            var text = highlights.text();
            text = text.substring(0, text.length - 1);
            var elements = highlights.elements();
            highlights = highlight(elements, text);
        });
        for (var i = 0; i < 10; i++) {
            bindSelectionNumberKey(i.toString());
        }
    }

    function start() {
        highlights = highlight(highlightableElements(), "");
        bindSelectionKeys();
    }

    function reset() {
        if (highlights != null) {
            highlights.reset();
            highlights = null;
        }
        action = null;
    }

    //
    // Bound functions
    //

    function initFollowLink() {
        reset();
        action = function (href) {
            request({action:"follow", url:href}, function (response) {
                console.log(response);
            });
        };
        start();
    }

    function initGotoLink() {
        reset();
        action = function (href) {
            request({action: "goto", url: href}, function (response) {
                console.log(response);
            });
        };
        start();
    }

    // Function to hide the chrome module
    function request(action, callback) {
        chrome.extension.sendRequest(action, callback);
    }

    // Function to hide Mousetrap.js
    function bindKeys(keys, fn) {
        Mousetrap.bind(keys, fn);
    }

    //
    // Setup.
    // Hook all keybindings into the current site.
    //
    request({action: 'keybindings'}, function (keybindings) {
        for (var prop in keybindings) {
            var keybinding = keybindings[prop];
            // eval is dangerous ... but should be fine here because no user
            // input is evaluated. Somehow invoking the functions by scope
            // doesn't work.
            console.log("Register Binding:", keybinding);
            bindKeys(keybinding.keys, eval(keybinding.fn));
        }
    });

})(JkDom);
