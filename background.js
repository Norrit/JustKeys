/*
 * Message Handling Setup
 */
chrome.extension.onRequest.addListener(function (request, sender, senderResponse) {
    switch(request.action) {
    case "keybindings":
        replyKeybindings(request, sender, senderResponse);
        break;
    case "tabs":
        replyTabs(request, sender, senderResponse);
        break;
    }
});


/**
 * Reply Functions
 */
function replyKeybindings(request, sender, sendResponse) {
    // TODO: Load keybindings from preferences
    sendResponse({"showTabs": "ctrl+b"});
};

function replyTabs(request, sender, sendResponse) {
    chrome.tabs.query({"currentWindow":true}, sendResponse);
};

