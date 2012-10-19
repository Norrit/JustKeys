(function (window, jk, bindKeys, unbindKeys, request) {

    var JK_HIGHLIGHT_CLASS = "jkHighlight",
        JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber",
        JK_FILTERED_CLASS = "jkFiltered",
        JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber",
        JK_SELECTED_CLASS = "jkSelected",
        JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber",

        highlights;

    function Highlight(nodes) {
        var selected, filtered, highlighted, text = "", self = this;

        var elements = jk.map(nodes, function (node, index) {
            return {index: index + 1, node: node};
        });

        var highlightElements = function () {
            function highlightElements(elements, highlightClass, numberClass) {
                jk.each(elements, function (element) {
                    var label = document.createElement("span");
                    label.innerText = element.index;
                    jk.addClass(label, numberClass);
                    jk.addClass(element.node, highlightClass);
                    jk.insertAsFirst(element.node, label);
                });
            }

            selected = jk.firstInArray(jk.filter(elements, function (node) {
                return text != "" && node.index.toString().indexOf(text) === 0;
            }));

            filtered = jk.filter(elements, function (node) {
                return text != "" && node.index.toString().indexOf(text) === 0 &&
                    (selected.length > 0 ? node.index !== selected[0].index : true);
            });

            highlighted = jk.filter(elements, function (node) {
                return (selected.length > 0 ? node.index !== selected[0].index : true) &&
                    !jk.any(filtered, function (fil) {
                        return fil.index == node.index;
                    });
            });
            self.reset();
            highlightElements(highlighted, JK_HIGHLIGHT_CLASS, JK_HIGHLIGHT_NUMBER_CLASS);
            highlightElements(filtered, JK_FILTERED_CLASS, JK_FILTERED_NUMBER_CLASS);
            highlightElements(selected, JK_SELECTED_CLASS, JK_SELECTED_NUMBER_CLASS);
        };

        this.reset = function () {
            jk.removeClassesFromAllElements([JK_HIGHLIGHT_CLASS, JK_FILTERED_CLASS, JK_SELECTED_CLASS]);
            jk.removeElementsWithClasses([JK_HIGHLIGHT_NUMBER_CLASS, JK_FILTERED_NUMBER_CLASS, JK_SELECTED_NUMBER_CLASS]);
        };

        this.selectedElement = function () {
            return selected.length > 0 ? selected[0].node : null;
        };

        this.addCharacter = function (character) {
            text = text + character;
            highlightElements();
        };

        this.deleteLastCharacter = function () {
            text = text.substring(0, text.length - 1);
            highlightElements();
        };

        highlightElements();
    }

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

})(window, JkDom, Mousetrap.bind, Mousetrap.unbind, chrome.extension.sendRequest);
