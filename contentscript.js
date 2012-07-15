/**
 * Setup Functions
 */
chrome.extension.sendRequest({action:"keybindings"}, function(keybindings) {
    Mousetrap.bind(keybindings["showTabs"], showTabs);
});

/*
 * Key Binding Functions
 */
function showTabs() {
    chrome.extension.sendRequest({action:"tabs"}, function(response) {
        console.log("Tabs", response);
    } );
}