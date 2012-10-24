window.jk = window.jk || {};
window.jk.highlight = (function (jk) {
    "use strict";

    function Highlight(nodes) {

        var JK_HIGHLIGHT_CLASS = "jkHighlight",
            JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber",
            JK_FILTERED_CLASS = "jkFiltered",
            JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber",
            JK_SELECTED_CLASS = "jkSelected",
            JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber",

            selected,
            filtered,
            highlighted,

            text = "",

            elements = nodes.map(function (node, index) {
                return {index: index + 1, node: node};
            }),

            highlight = function () {
                function highlightElements(elements, highlightClass, numberClass) {
                    elements.forEach(function (element) {
                        var label = document.createElement("span");
                        label.innerText = element.index;
                        jk.addClass(label, numberClass);
                        jk.addClass(element.node, highlightClass);
                        jk.insertAsFirst(element.node, label);
                    });
                }

                function firstInArray(array) {
                    return array.length ? [array[0]] : [];
                }

                function isIndexTheText(node) {
                    return text && node.index.toString().indexOf(text) === 0;
                }

                function isNotSelected(node) {
                    return selected.length ? node.index !== selected[0].index : true;
                }

                selected = firstInArray(elements.filter(isIndexTheText));

                filtered = elements.filter(function (node) {
                    return isIndexTheText(node) && isNotSelected(node);
                });

                highlighted = elements.filter(function (node) {
                    return isNotSelected(node) &&
                        !filtered.some(function (element) {
                            return element.index === node.index;
                        });
                });
                this.reset();
                highlightElements(highlighted, JK_HIGHLIGHT_CLASS, JK_HIGHLIGHT_NUMBER_CLASS);
                highlightElements(filtered, JK_FILTERED_CLASS, JK_FILTERED_NUMBER_CLASS);
                highlightElements(selected, JK_SELECTED_CLASS, JK_SELECTED_NUMBER_CLASS);
            }.bind(this);

        this.reset = function () {
            jk.removeClassesFromAllElements([JK_HIGHLIGHT_CLASS, JK_FILTERED_CLASS, JK_SELECTED_CLASS]);
            jk.removeElementsWithClasses([JK_HIGHLIGHT_NUMBER_CLASS, JK_FILTERED_NUMBER_CLASS, JK_SELECTED_NUMBER_CLASS]);
        };

        this.selectedElement = function () {
            return selected.length ? selected[0].node : null;
        };

        this.addCharacter = function (character) {
            text = text + character;
            highlight();
        };

        this.removeLastCharacter = function () {
            text = text.substring(0, text.length - 1);
            highlight();
        };

        highlight();
    }

    return {
        Highlight: Highlight
    };
}(jk.dom));