window.onload = function () {
	  $.ajax({
	    "method": "GET",
	    "url": "https://earn.gg/account/get",
	    "success": function (data) {
	      if(data.result.api) {
	        browser.storage.local.set({ "authentication": {"key": data.result.api.key, "secret": data.result.api.secret}});
	      }
	    }
	});
	}
	 
	var onetwo = {
	    one: false,
	    two: false,
	    cooldown: false
	};
	document.addEventListener("keydown", keyDownTextField, false);
	function keyDownTextField(e) {
	    var keyCode = e.keyCode;
	    if (keyCode == 188) {
	        onetwo.one = true;
	    } else if (keyCode == 51) {
	        onetwo.two = true
	    } else {
	        onetwo.one = false;
	        onetwo.two = false;
	    }
	    if (onetwo.one == true && onetwo.two == true && onetwo.cooldown == false) {
	      $.get("https://earn.gg/chat/latest", function(data) {
	        for (i = 0; i < 20; i++) {
	            onetwo.cooldown = true;
	            cooldownHearts();
	            $.post("https://earn.gg/chat/heart?id=" + data[i].id, function(data) {
	              console.log(data);
	            });
	        }
	      });
	    }
	}
	 
	function cooldownHearts(){
	  if(onetwo.cooldown == true){
	    setTimeout(function (){
	      onetwo.cooldown = false;
	    },30000);
	  }
	}