(function (window, JkDom, bindKeys, unbindKeys, request) {

    var JK_HIGHLIGHT_CLASS = "jkHighlight";
    var JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber";
    var JK_FILTERED_CLASS = "jkFiltered";
    var JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber";
    var JK_SELECTED_CLASS = "jkSelected";
    var JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber";

    var each = JkDom.each,
        map = JkDom.map,
        filter = JkDom.filter,
        any = JkDom.any,
        firstInArray = JkDom.firstInArray,
        highlights;

    function Highlight(nodes) {
        var selected, filtered, highlighted, text = "", self = this;

        var elements = map(nodes, function (node, index) {
            return {index: index + 1, node: node};
        });

        var highlightElements = function () {
            function highlightElements(elements, highlightClass, numberClass) {
                each(elements, function (element) {
                    var label = document.createElement("span");
                    label.innerText = element.index;
                    JkDom.addClass(label, numberClass);
                    JkDom.addClass(element.node, highlightClass);
                    JkDom.insertAsFirst(element.node, label);
                });
            }

            selected = firstInArray(filter(elements, function (node) {
                return text != "" && node.index.toString().indexOf(text) === 0;
            }));

            filtered = filter(elements, function (node) {
                return text != "" && node.index.toString().indexOf(text) === 0 &&
                    (selected.length > 0 ? node.index !== selected[0].index : true);
            });

            highlighted = filter(elements, function (node) {
                return (selected.length > 0 ? node.index !== selected[0].index : true) &&
                    !any(filtered, function (fil) {
                        return fil.index == node.index;
                    });
            });
            self.reset();
            highlightElements(highlighted, JK_HIGHLIGHT_CLASS, JK_HIGHLIGHT_NUMBER_CLASS);
            highlightElements(filtered, JK_FILTERED_CLASS, JK_FILTERED_NUMBER_CLASS);
            highlightElements(selected, JK_SELECTED_CLASS, JK_SELECTED_NUMBER_CLASS);
        };

        this.reset = function () {
            JkDom.removeClassesFromAllElements([JK_HIGHLIGHT_CLASS, JK_FILTERED_CLASS, JK_SELECTED_CLASS]);
            JkDom.removeElementsWithClasses([JK_HIGHLIGHT_NUMBER_CLASS, JK_FILTERED_NUMBER_CLASS, JK_SELECTED_NUMBER_CLASS]);
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
            return JkDom.hasLink(element) && JkDom.elementInViewport(element) && JkDom.isVisible(element);
        };
        var elements = document.getElementsByTagName("a");
        return filter(elements, function(element) {
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
            each(keybindings, function (keybinding) {
                // eval is dangerous ... but should be fine here because no user
                // input is evaluated. Somehow invoking the functions by scope
                // doesn't work.
                console.log("Register Binding:", keybinding);
                bindKeys(keybinding.keys, function (e) {
                    ((eval(keybinding.fn)(keybinding, e)))
                });
                // Intercept keydown events of bound keys to prevent Google Insta Search
                interceptKeydownEvent(keybinding.keyCode)
            })
        });
    }

    initHooks();

})(window, window.JkDom, Mousetrap.bind, Mousetrap.unbind, chrome.extension.sendRequest);
