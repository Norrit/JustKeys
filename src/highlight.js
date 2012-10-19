window.jk = window.jk || {};
window.jk.highlight = (function (jk) {

    var JK_HIGHLIGHT_CLASS = "jkHighlight",
        JK_HIGHLIGHT_NUMBER_CLASS = "jkHighlightNumber",
        JK_FILTERED_CLASS = "jkFiltered",
        JK_FILTERED_NUMBER_CLASS = "jkFilteredNumber",
        JK_SELECTED_CLASS = "jkSelected",
        JK_SELECTED_NUMBER_CLASS = "jkSelectedNumber";

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

    return {
        Highlight: Highlight
    }
})(jk.dom);