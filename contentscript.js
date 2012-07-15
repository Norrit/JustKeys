/**
 * Setup Functions
 */
chrome.extension.sendRequest({action:"keybindings"}, bindKeys);

function bindKeys(keybindings) {
    console.log("Binding keys", keybindings);
    Mousetrap.bind(keybindings["showTabs"], showTabs);
}

/*
 * Key Binding Functions
 */
function showTabs() {
    document.body.style.backgroundColor="yellow";
    chrome.extension.sendRequest({action:"tabs"}, function(response) {
        console.log("Tabs", response);
    } );
}