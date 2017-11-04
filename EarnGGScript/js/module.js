
	 
	window.onload = function() {
	    $("#title").removeClass("hidden");
	    $("#balance").removeClass("hidden");
	    var pageData = {inProgress:false, profit:0, wins: 0, losses: 0, authenticated:false};
	    //Button onclick event listeners
	    document.getElementById("loginButton").addEventListener("click", authenticate);
	    document.getElementById("startRolling").addEventListener("click", startRolling);
	    document.getElementById("stopRolling").addEventListener("click", stopRolling);
	 
	    document.getElementById("title").innerHTML = "Login to earn.gg using your Key and Secret";
	 
	    browser.storage.local.get(["authentication"], function(items) {
	      if(items.authentication){
	        if (items.authentication.key && items.authentication.secret) {
	            document.getElementById("key").value = items.authentication.key;
	            document.getElementById("secret").value = items.authentication.secret;
	            document.getElementById("title").innerHTML = "Login to earn.gg using your Key and Secret";
	            $('#authentication').removeClass("hidden");
	            authenticate();
	        } else {
	            document.getElementById("title").innerHTML = "Login to earn.gg and we will pull your Key and Secret!";
	            $('#authentication').removeClass("hidden");
	        }
	      }
	    });
	 
	    //authentication with earn.gg
	    function authenticate() {
	        var key = document.getElementById("key").value,
	            secret = document.getElementById("secret").value;
	            pageData.key = key;
	            pageData.secret = secret;
	 
	        browser.storage.local.set({
	            "authentication": {
	                "key": key,
	                "secret": secret
	            }
	        });
	        $.ajax({
	            "method": "GET",
	            "url": "https://earn.gg/account/get?key=" + key + "&secret=" + secret,
	            "success": function(data) {
	                pageData.balance = data.result.balance;
	                document.getElementById("title").innerHTML = "Welcome, " + data.result.name;
	                $("#roll").removeClass("hidden");
	                $("#authentication").addClass("hidden");
	                pageData.authenticated = true;
	            },
	            "error": function(data) {
	                document.getElementById("error").innerHTML = "<h2>ERROR> Wrong Key & Secret. Login to earn.gg, and then refresh this page.</h2>";
	                $("#error").removeClass("hidden");
	            }
	        });
	    }
	 
	    function stopRolling() {
	      var total = parseInt(pageData.balance) - parseInt(pageData.startingBalance);
	      alert("Total Profit: " + total + " - Total Wins: " + pageData.wins + " - Total Losses: " + pageData.losses + " - W/L Ratio " + (pageData.wins/pageData.losses).toFixed(3));
	      location.reload();
	    }
	 
	    setInterval(function() {
	      if(pageData.authenticated === true){
	      var total = parseInt(pageData.balance) - parseInt(pageData.startingBalance);
	      document.getElementById("total").innerHTML = "Total Profit: " + total;
	      document.getElementById("wins").innerHTML = "Total Wins: " + pageData.wins;
	      document.getElementById("losses").innerHTML = "Total Losses: " + pageData.losses;
	      document.getElementById("ratio").innerHTML = "W/L Ratio " + (pageData.wins/pageData.losses).toFixed(3);
	 
	      $.ajax({
	          "method": "GET",
	          "url": "https://earn.gg/account/get?key=" + document.getElementById("key").value + "&secret=" + document.getElementById("secret").value,
	          "success": function(data) {
	            pageData.balance = data.result.balance;
	          },
	          "error": function(data) {
	              document.getElementById("error").innerHTML = data;
	              $("#error").removeClass("hidden");
	          }
	      });
	      }
	    },200);
	 
	    //set saved info from previous uses
	    setSaved();
	 
	    function setSaved() {
	        browser.storage.local.get(["rollSettings"], function(items) {
	            if (items.rollSettings) {
	                if (items.rollSettings.speed) {
	                    document.getElementById("betSpeed").value = items.rollSettings.speed;
	                    document.getElementById("betMulti").value = items.rollSettings.multi;
	                    document.getElementById("baseBet").value = items.rollSettings.baseBet;
	                    document.getElementById("maxLosses").value = items.rollSettings.maxLosses;
	                    document.getElementById("minBal").value = items.rollSettings.minBal;
	                    document.getElementById("maxBal").value = items.rollSettings.maxBal;
	                }
	            }
	        });
	    }
	 
	    function startRolling() {
	        var speed = 1000 / parseInt(document.getElementById("betSpeed").value),
	            lastOutcome = true;
	            pageData.consecutiveLosses = 0;
	            pageData.wins = 0;
	            pageData.losses = 0;
	            pageData.profit = 0;
	            pageData.nextBet = parseInt(document.getElementById("baseBet").value);
	 
	            $("#startRolling").addClass("hidden");
	            $("#stopRolling").removeClass("hidden");
	            $("#stats").removeClass("hidden");
	 
	            document.getElementById("startingBalance").innerHTML = "Starting Balance: " + pageData.balance.toFixed(0);
	            pageData.startingBalance = pageData.balance;
	 
	        setInterval(function() {
	            //setting settings
	            var speed = 1000 / parseInt(document.getElementById("betSpeed").value),
	                multi = document.getElementById("betMulti").value,
	                baseBet = document.getElementById("baseBet").value,
	                minBal = document.getElementById("minBal").value,
	                maxBal = document.getElementById("maxBal").value,
	                maxLosses = document.getElementById("maxLosses").value;
	 
	 
	 
	            browser.storage.local.set({
	                "rollSettings": {
	                    "speed": parseInt(document.getElementById("betSpeed").value),
	                    "multi": multi,
	                    "baseBet": baseBet,
	                    "minBal": minBal,
	                    "maxBal": maxBal,
	                    "maxLosses": maxLosses
	                }
	            });
	            //sending the request
	 
	            if (minBal <= pageData.balance - pageData.nextBet) {
	                if (maxBal >= pageData.balance) {
	                  console.log("consec: " + pageData.consecutiveLosses);
	                  if(pageData.consecutiveLosses < maxLosses){
	                    if(pageData.inProgress === false){
	                      pageData.inProgress = true;
	                      $.ajax({
	                          "method": "GET",
	                          "url": "https://earn.gg/gamble/roll?amount=" + pageData.nextBet + "&payout=" + multi + "&key=" + pageData.key + "&secret=" + pageData.secret,
	                          "success": function(data) {
	                              if (data.won === true) {
	                                  pageData.wins++;
	                                  pageData.consecutiveLosses = 0;
	                                  var lastOutcome = true;
	                                  pageData.nextBet = baseBet;
	                                  pageData.inProgress = false;
	                                  document.getElementById("current").innerHTML = "Current: Win - Next Bet: " + pageData.nextBet;
	                              } else {
	                                  pageData.losses++;
	                                  var oldProfit = pageData.profit;
	                                  var lastOutcome = true;
	                                  pageData.consecutiveLosses++;
	                                  pageData.nextBet*=2;
	                                  pageData.inProgress = false;
	                                  document.getElementById("current").innerHTML = "Current: Loss - Next Bet: " + pageData.nextBet;
	                              }
	                          }
	                      });
	                  } else {
	                      console.log("Avoided problem roll");
	                  }
	                } else {
	                    pageData.consecutiveLosses = 0;
	                    pageData.nextBet = baseBet;
	                    console.log("Reset!")
	                }
	                } else {
	                    document.getElementById("error").innerHTML = "ERROR> Maximum balance reached!";
	                    $("#error").removeClass("hidden");
	                }
	            } else {
	                document.getElementById("error").innerHTML = "ERROR> Minimum balance reached!";
	                $("#error").removeClass("hidden");
	            }
	        }, speed);
	    }
	}