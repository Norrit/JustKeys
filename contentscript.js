(function () {

    var justKeysHighlightClass = "justKeysHighlight";
    var justKeysHighlightNumberClass = "justKeysHighlightNumber";
    var justKeysFilteredClass = "justKeysFiltered";
    var justKeysFilteredNumberClass = "justKeysFilteredNumber";
    var $h = JustKeysHelper;

    var highlights;
    var text = "";

    //
    // Display Functions
    //

    function filteredElements() {
        var selection = {};
        for (var i in highlights) {
            if (i.toString().indexOf(text) === 0) {
                selection[i] = highlights[i];
            }
        }
        return selection;
    }

    function countFilteredElements() {
        return Object.keys(filteredElements()).length;
    }

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
        for (var i in highlights) {
            highlightElement(highlights[i], i);
        }
    }

    function bindSelectionKeys() {
        bindKeys("esc", function () {
            resetHighlightedElements();
        });
        bindKeys("backspace", function () {
            text = text.substring(0, text.length - 1);
        });
        for (var i = 0; i < 10; i++) {
            binSelectionNumberKey(i.toString());
        }
    }

    function binSelectionNumberKey(index) {
        bindKeys(index, function () {
            text += index;
        });
    }


    //
    // Bound functions
    //

    function initFollowLink() {
        resetHighlightedElements();
        highlights = loadHighlightableElements();
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
