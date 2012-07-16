(function() {

  //
  // Constants
  //
  var justKeysHighlightClass = "justKeysHighlight";
  var justKeysHighlightNumberClass = "justKeysHighlightNumber";

  //
  // Display Functions
  //
  function showTabs() {
    request("tabs", function(response) {
      // TODO: Implement this stuff ...
      console.log("Tabs", response);
    });    
  }
  
  function resetHighlightedLinks() {
    var elements = document.getElementsByClassName(justKeysHighlightClass);
    while(elements.length > 0) {
      JustKeysHelper.removeClass(elements[0], justKeysHighlightClass);
    }
    elements = document.getElementsByClassName(justKeysHighlightNumberClass);
    while(elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function shouldHighlight(element) {
    return JustKeysHelper.elementInViewport(element) 
      && JustKeysHelper.isVisible(element) 
      && JustKeysHelper.hasLink(element);
  }

  function highlightLink(element, text) {
    var label = document.createElement("span");
    label.innerText = text;
    JustKeysHelper.addClass(label, justKeysHighlightNumberClass);
    JustKeysHelper.addClass(element, justKeysHighlightClass);
    JustKeysHelper.insertAsFirst(element, label);
  }

  function highlightLinks() {
    resetHighlightedLinks();
    var elements = document.getElementsByTagName("a");
    var number = 1;
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (shouldHighlight(element)) {
        highlightLink(element, number++);
      }
    }
  }

  // Function to hide the chrome module
  function request(action, callback) {
    chrome.extension.sendRequest({action: action}, callback);
  }
  
  //
  // Setup. 
  // Hook all keybindings into the current site.
  //
  request("keybindings", function(keybindings) {
    for(var prop in keybindings) {
      var keybinding = keybindings[prop];
      // eval is dangerous ... but should be fine here because no user
      // input is evaluated. Somehow invokeing the functions by scope
      // doesnt work.
      console.log("Register Binding:", keybinding);
      Mousetrap.bind(keybinding.keys, eval(keybinding.fn));
    }
  });
  
}) ();
