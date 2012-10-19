(function (window, jk, Highlight, bindKeys, unbindKeys, request) {

     var highlights;

    function highlightableElements() {
        var shouldHighlight = function (element) {
            return jk.hasLink(element) && jk.elementInViewport(element) && jk.isVisible(element);
        };
        var elements = document.getElementsByTagName("a");
        return jk.filter(elements, function (element) {
            return shouldHighlight(element);
        });
    }

    function bindSelectionKeys(keys, action) {
        bindKeys(keys, function () {
            reset();
        });
        bindKeys("return", function () {
            var selected = highlights.selectedElement();
            if (selected) {
                action(selected.href);
            }
        });
        var bindSelectionNumberKey = function (index) {
            interceptKeydownEvent((parseInt(index) + 48).toString());
            bindKeys(index, function () {
                highlights.addCharacter(index);
            });
        };
        for (var i = 0; i < 10; i++) {
            bindSelectionNumberKey(i.toString());
        }
    }

    function interceptKeydownEvent(index) {
        var listener = function (e) {
            if (e.keyCode == index) {
                e.stopPropagation();
            }
        };
        window.addEventListener('keydown', listener, true);
    }

    //
    // Bound functions
    //
    function initFollowLink(keybinding) {
        highlights = new Highlight(highlightableElements());
        bindSelectionKeys(keybinding.keys, function (href) {
            request({action: "follow", url: href}, function (response) {
                reset();
            });
        });
    }

    function initGotoLink(keybinding) {
        highlights = new Highlight(highlightableElements());
        bindSelectionKeys(keybinding.keys, function (href) {
            request({action: "goto", url: href}, function (response) {
                reset();
            });
        });
    }

    function reset() {
        if (highlights != null) {
            highlights.reset();
            highlights = null;
        }
        initHooks();
    }

    function deleteLastCharacter() {
        if (highlights != null) {
            highlights.deleteLastCharacter();
        }
    }

    //
    // Setup.
    // Hook all keybindings into the current site.
    //
    function initHooks() {
        request({action: 'keybindings'}, function (keybindings) {
            jk.each(keybindings, function (keybinding) {
                // eval is dangerous ... but should be fine here because no user
                // input is evaluated. Somehow invoking the functions by scope
                // doesn't work.
                console.log("Register Binding:", keybinding);
                bindKeys(keybinding.keys, function (e) {
                    ((eval(keybinding.fn)(keybinding, e)))
                });
                // Intercept keydown events of bound keys to prevent intermediate events.
                // For example Google Insta Search would break the link selection
                interceptKeydownEvent(keybinding.keyCode)
            })
        });
    }

    initHooks();

})(window, jk.dom, jk.highlight.Highlight, Mousetrap.bind, Mousetrap.unbind, chrome.extension.sendRequest);
