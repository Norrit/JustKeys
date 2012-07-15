(function() {
  
  // TODO: Load keybindings from preferences
  var KEYBINDINGS = {showTabs: "ctrl+b"};
  
  // Reply Functions
  function _replyKeybindings(request, sender, response) {
    response(KEYBINDINGS);
  };

  function _replyTabs(request, sender, response) {
    //chrome query directly sends the response
    chrome.tabs.query({currentWindow: true}, response);
  };
  
  var justKeys = {
    
    /**
     * Dispatches the received message from the `JustKeys` frontend.
     * The messages should have the following type:
     * {action: "Name of the action" [, <extra option properties if needed>]}
     */
    dispatch: function(request, sender, response) {
      switch(request.action) {
      case "keybindings":
        _replyKeybindings(request, sender, response);
        break;
      case "tabs":
        _replyTabs(request, sender, response);
        break;
      }
    }
  };
  
  // Expose `JustKeys` to the global object
  window.JustKeys = justKeys;
   
})();
 
 /**
  * Message Handling Setup
  */
 chrome.extension.onRequest.addListener(JustKeys.dispatch);
