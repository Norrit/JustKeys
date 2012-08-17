(function () {

    var justKeysHighlightClass = "justKeysHighlight";
    var justKeysHighlightNumberClass = "justKeysHighlightNumber";
    var justKeysFilteredClass = "justKeysFiltered";
    var justKeysFilteredNumberClass = "justKeysFilteredNumber";
    var $h = JustKeysHelper;

    var elements;
    var text = "";

    var selection = {
        highlightableElements: function () {
            var shouldHighlight = function (element) {
                return $h.hasLink(element) && $h.elementInViewport(element) && $h.isVisible(element);
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
        },

        filteredElements: function () {
            var selection = {};
            for (var i in elements) {
                if (i.toString().indexOf(text) === 0) {
                    selection[i] = elements[i];
                }
            }
            return selection;
        },

        countFilteredElements: function () {
            return Object.keys(this.filteredElements()).length;
        }
    };

    var highlights = {
        reset: function () {
            elements = null;
            $h.removeClassFromAllElements(justKeysHighlightClass);
            $h.removeClassFromAllElements(justKeysFilteredClass);
            $h.removeElementsWithClass(justKeysHighlightNumberClass);
            $h.removeElementsWithClass(justKeysFilteredNumberClass);
        },

        highlightElement: function (element, text) {
            var label = document.createElement("span");
            label.innerText = text;
            $h.addClass(label, justKeysHighlightNumberClass);
            $h.addClass(element, justKeysHighlightClass);
            $h.insertAsFirst(element, label);
        },

        highlightElements: function () {
            for (var i in elements) {
                this.highlightElement(elements[i], i);
            }
        }
    };

    function bindSelectionKeys() {
        var bindSelectionNumberKey = function(index) {
            bindKeys(index, function () {
                text += index;
            });
        };
        bindKeys("esc", function () {
            highlights.reset();
        });
        bindKeys("backspace", function () {
            text = text.substring(0, text.length - 1);
        });
        for (var i = 0; i < 10; i++) {
            bindSelectionNumberKey(i.toString());
        }
    }

    //
    // Bound functions
    //

    function initFollowLink() {
        highlights.reset();
        elements = selection.highlightableElements();
        highlights.highlightElements();
        bindSelectionKeys();
    }

    // Function to hide the chrome module
    function request(action, callback) {
        chrome.extension.sendRequest({action: action}, callback);
    }

    // Function to hide Mousetrap.js
    function bindKeys(keys, fn) {
        Mousetrap.bind(keys, fn);
    }

    //
    // Setup.
    // Hook all keybindings into the current site.
    //
    request("keybindings", function (keybindings) {
        for (var prop in keybindings) {
            var keybinding = keybindings[prop];
            // eval is dangerous ... but should be fine here because no user
            // input is evaluated. Somehow invoking the functions by scope
            // doesn't work.
            console.log("Register Binding:", keybinding);
            bindKeys(keybinding.keys, eval(keybinding.fn));
        }
    });

})();
