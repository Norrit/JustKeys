(function () {

    var justKeysHighlightClass = "justKeysHighlight";
    var justKeysHighlightNumberClass = "justKeysHighlightNumber";
    var justKeysFilteredClass = "justKeysFiltered";
    var justKeysFilteredNumberClass = "justKeysFilteredNumber";
    var $h = JustKeysHelper;

    // Object to hold the currently highlighted elements and the filter pattern
    var Highlight = function (elements) {
        var text = "";
        return {
            addToFilter: function (character) {
                text += character;
                console.log(text, "->", this.count());
            },
            removeLastFromFilter: function () {
                text = text.substring(0, text.length - 1);
                console.log(text, "->", this.count());
            },
            filter: function () {
                var selection = {};
                for (var i in elements) {
                    if (i.toString().indexOf(text) === 0) {
                        console.log("Match ", text, "->", i.toString());
                        selection[i] = elements[i];
                    }
                }
                return selection;
            },
            count: function () {
                return Object.keys(this.filter()).length;
            }
        };
    };
    var highlights;


    //
    // Display Functions
    //

    function resetHighlightedElements() {
        highlights = null;
        $h.removeClassFromAllElements(justKeysHighlightClass);
        $h.removeClassFromAllElements(justKeysFilteredClass);
        $h.removeElementsWithClass(justKeysHighlightNumberClass);
        $h.removeElementsWithClass(justKeysFilteredNumberClass);
    }

    function shouldHighlight(element) {
        return $h.hasLink(element) && $h.elementInViewport(element) && $h.isVisible(element);
    }

    function loadHighlightableElements() {
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

    function highlightElement(element, text) {
        var label = document.createElement("span");
        label.innerText = text;
        $h.addClass(label, justKeysHighlightNumberClass);
        $h.addClass(element, justKeysHighlightClass);
        $h.insertAsFirst(element, label);
    }

    function highlightElements() {
        var elements = loadHighlightableElements();
        for (var i in elements) {
            highlightElement(elements[i], i);
        }
        highlights = new Highlight(elements);
    }

    function bindSelectionKeys() {
        bindKeys("backspace", function () {
            highlights.removeLastFromFilter();
        });
        bindKeys("esc", function () {
            resetHighlightedElements();
        });
        for (var i = 0; i < 10; i++) {
            selectionKey(i.toString());
        }
    }

    function selectionKey(index) {
        bindKeys(index, function () {
            highlights.addToFilter(index)
        });
    }


    //
    // Bound functions
    //

    function initFollowLink() {
        resetHighlightedElements();
        highlightElements();
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
