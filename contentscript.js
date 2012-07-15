(function() {
  
  function _showTabs() {
    chrome.extension.sendRequest({action:"tabs"}, function(response) {
      console.log("Tabs", response);
    });
  }
  
  /**
   * Setup. Hook all keybindings into the current site.
   */
  chrome.extension.sendRequest({action:"keybindings"}, function(keybindings) {
    Mousetrap.bind(keybindings["showTabs"], _showTabs);
  });
  
}) ();
