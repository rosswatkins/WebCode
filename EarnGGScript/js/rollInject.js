setTimeout(function (){
  if(window.location.href.includes('/roll')){
    if(document.getElementById('rollIFrame')) {

    } else {
      var appendToDiv = document.getElementsByClassName("inner");
      var newElement = document.createElement("rollIFrame");
      newElement.innerHTML = "<br><hr style='border: 1px solid #9D7AD1;margin:0;'/><br><iframe onload='var finishedLoading = true;' id='rollIFrame' style='width:100%' align='center' width='400' height='500' frameborder='0' src='" + browser.extension.getURL('/html/roll.html') + "'></iframe>";
        if(appendToDiv[0]){
          appendToDiv[1].appendChild(newElement);
        }
      }
    }
  }, 2000);
