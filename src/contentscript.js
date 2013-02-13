;(function (window, jk, Highlight, bindKeys, unbindKeys, request) {
    "use strict";

    var highlights;

    function highlightableElements() {
        function shouldHighlight(element) {
            return jk.hasLink(element) && jk.elementInViewport(element) && jk.isVisible(element);
        }

        function nodeListToArray(tags) {
            var elements = [],
                length = tags.length,
                i;
            for (i = length; i--; elements.unshift(tags[i]));
            return elements;
        }

        var elements = nodeListToArray(document.getElementsByTagName("a")),
            visible = elements.filter(shouldHighlight);
        request({action: "filter"}, function (filter) {
            // TODO: Extract this block into own filter module/class
            var filtered = visible;
            Object.keys(filter).forEach(function (key) {
                var site = this[key];
                if (new RegExp(site.urlRegex).test(window.location.href)) {
                    filtered = filtered.filter(function (element) {
                        return !site.classes.some(function (clazz) {
                            return jk.hasClass(element, clazz);
                        });
                    });
                }
            }.bind(filter));
            highlights = new Highlight(filtered);
        });
    }

    function interceptKeydownEvent(index) {
        var listener = function (e) {
            var activeElement = window.document.activeElement;
            if (activeElement.tagName.toLocaleLowerCase() != "input"
                && activeElement.tagName.toLocaleLowerCase() != "textarea"
                && e.keyCode === index) {
                e.stopPropagation();
            }
        };
        window.addEventListener('keydown', listener, true);
    }

    function bindSelectionKeys(keys, action) {
        function bindSelectionNumberKey(index) {
            interceptKeydownEvent(index + 48);
            bindKeys(index.toString(), function () {
                highlights.addCharacter(index);
            });
        }
        bindKeys(keys, function () {
            reset();
        });
        bindKeys("return", function () {
            var selected = highlights.selectedElement();
            if (selected) {
                action(selected.href);
            }
        });
        for (var i = 0; i < 10; i += 1) {
            bindSelectionNumberKey(i);
        }
    }

    //
    // Bound functions
    //
    function initFollowLink(keybinding) {
        highlightableElements();
        bindSelectionKeys(keybinding.keys, function (href) {
            request({action: "follow", url: href}, function (response) {
                reset();
            });
        });
    }

    function initGotoLink(keybinding) {
        highlightableElements();
        bindSelectionKeys(keybinding.keys, function (href) {
            request({action: "goto", url: href, active: true}, function (response) {
                reset();
            });
        });
    }

    function initGotoLinkInBackground(keybinding) {
        highlightableElements();
        bindSelectionKeys(keybinding.keys, function (href) {
            request({action: "goto", url: href, active: false}, function (response) {
                reset();
            });
        });
    }

    function reset() {
        if (highlights) {
            highlights.reset();
            highlights = null;
        }
        initHooks();
    }

    function removeLastCharacter() {
        if (highlights) {
            highlights.removeLastCharacter();
        }
    }

    //
    // Setup.
    // Hook all keybindings into the current site.
    //
    function initHooks() {
        request({action: 'keybindings'}, function (keybindings) {
            Object.keys(keybindings).forEach(function (key) {
                var keybinding = this[key];
                // eval is dangerous ... but should be fine here because no user
                // input is evaluated. Somehow invoking the functions by scope
                // doesn't work.
                console.log("Register Binding:", keybinding);
                bindKeys(keybinding.keys, function (e) {
                    eval(keybinding.fn)(keybinding, e);
                });
                // Intercept keydown events of bound keys to prevent intermediate events.
                // For example Google Insta Search would break the link selection
                interceptKeydownEvent(keybinding.keyCode)
            }.bind(keybindings));
        });
    }

    initHooks();

}(window, jk.dom, jk.highlight.Highlight, Mousetrap.bind, Mousetrap.unbind, chrome.extension.sendRequest));
