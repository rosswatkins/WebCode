browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	  browser.tabs.query({
	    active: true,
	    currentWindow: true
	  }, function(tabs) {
	    var tab = tabs[0];
	    if(tab){
	      if(tab.url){
	        var url = tab.url;
	        if(url === "https://earn.gg/roll"){
	          console.log("on roll tab");
	            browser.tabs.executeScript(tab.id, {
	                file: '/js/rollInject.js'
	            });
	        }
	        }
	      }
	  });
	});