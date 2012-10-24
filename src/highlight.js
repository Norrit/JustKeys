window.jk = window.jk || {};
window.jk.highlight = (function (jk) {
    "use strict";

    var JK_HIGHLIGHT_CLASS = "jkHighlight",
        JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber",
        JK_FILTERED_CLASS = "jkFiltered",
        JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber",
        JK_SELECTED_CLASS = "jkSelected",
        JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber";

    function Highlight(nodes) {
        var selected, filtered, highlighted, text = "", self = this,

            elements = nodes.map(function (node, index) {
                return {index: index + 1, node: node};
            }),

            highlightElements = function () {
                function highlightElements(elements, highlightClass, numberClass) {
                    elements.forEach(function (element) {
                        var label = document.createElement("span");
                        label.innerText = element.index;
                        jk.addClass(label, numberClass);
                        jk.addClass(element.node, highlightClass);
                        jk.insertAsFirst(element.node, label);
                    });
                }

                function isIndexTheText(node) {
                    return text !== "" && node.index.toString().indexOf(text) === 0;
                }

                function isNotSelected(node) {
                    return selected.length > 0 ? node.index !== selected[0].index : true;
                }

                selected = jk.firstInArray(elements.filter(isIndexTheText));

                filtered = elements.filter(function (node) {
                    return isIndexTheText(node) && isNotSelected(node);
                });

                highlighted = elements.filter(function (node) {
                    return isNotSelected(node) &&
                        !filtered.some(function (fil) {
                            return fil.index === node.index;
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

        this.removeLastCharacter = function () {
            text = text.substring(0, text.length - 1);
            highlightElements();
        };

        highlightElements();
    }

    return {
        Highlight: Highlight
    };
}(jk.dom));