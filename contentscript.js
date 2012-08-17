(function () {

    var justKeysHighlightClass = "justKeysHighlight";
    var justKeysHighlightNumberClass = "justKeysHighlightNumber";
    var justKeysFilteredClass = "justKeysFiltered";
    var justKeysFilteredNumberClass = "justKeysFilteredNumber";
    var $h = JustKeysHelper;

    var elements;
    var text = "";

    var selection = {
        highlightedElements: function (elements) {
            var selected = this.filteredElements(elements);
            var highlighted = {};
            for (var i in elements) {
                if (!selected[i]) {
                    highlighted[i] = elements[i];
                }
            }
            return highlighted;
        },

        filteredElements: function (elements) {
            var selection = {};
            for (var i in elements) {
                if (text != "" && i.toString().indexOf(text) === 0) {
                    selection[i] = elements[i];
                }
            }
            return selection;
        },

        countFilteredElements: function (elements) {
            return Object.keys(this.filteredElements(elements)).length;
        }
    };



    var highlights = (function () {
        function highlightElement(element, text, highlightClass, numberClass) {
            var label = document.createElement("span");
            label.innerText = text;
            $h.addClass(label, numberClass);
            $h.addClass(element, highlightClass);
            $h.insertAsFirst(element, label);
        }
        return {
            reset: function () {
                $h.removeClassFromAllElements(justKeysHighlightClass);
                $h.removeClassFromAllElements(justKeysFilteredClass);
                $h.removeElementsWithClass(justKeysHighlightNumberClass);
                $h.removeElementsWithClass(justKeysFilteredNumberClass);
            },

            highlightElements: function (elements) {
                this.reset();
                var highlighted = selection.highlightedElements(elements);
                for (var i in highlighted) {
                    highlightElement(highlighted[i], i, justKeysHighlightClass, justKeysHighlightNumberClass);
                }
                var filtered = selection.filteredElements(elements);
                for (var n in filtered) {
                    highlightElement(filtered[n], n, justKeysFilteredClass, justKeysFilteredNumberClass);
                }
            }
        };
    })();

    function highlightableElements() {
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
    }

    function bindSelectionKeys() {
        var bindSelectionNumberKey = function (index) {
            bindKeys(index, function () {
                text += index;
                highlights.highlightElements(elements);
            });
        };
        bindKeys("esc", function () {
            reset();
        });
        bindKeys("d", function () {
            text = text.substring(0, text.length - 1);
            highlights.highlightElements(elements);
        });
        for (var i = 0; i < 10; i++) {
            bindSelectionNumberKey(i.toString());
        }
    }

    function reset() {
        elements = null;
        text = "";
        highlights.reset();
    }

    //
    // Bound functions
    //

    function initFollowLink() {
        reset();
        elements = highlightableElements();
        highlights.highlightElements(elements);
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
