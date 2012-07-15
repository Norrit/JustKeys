/*
 * Message Handling Setup
 */
chrome.extension.onRequest.addListener(function(request, sender, response) {
    switch(request.action) {
    case "keybindings":
        replyKeybindings(request, sender, response);
        break;
    case "tabs":
        replyTabs(request, sender, response);
        break;
    }
});


/**
 * Reply Functions
 */
function replyKeybindings(request, sender, response) {
    // TODO: Load keybindings from preferences
    response({showTabs: "ctrl+b"});
};

function replyTabs(request, sender, response) {
    //chrome query directly sends the response
    chrome.tabs.query({currentWindow: true}, response);
};

