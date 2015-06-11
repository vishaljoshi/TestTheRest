

window.addEventListener('load', settingsLoadHandler);
//document.onload=settingsLoadHandler;

function settingsLoadHandler(){
  showUrlExclusion();


}

var addListners = function(){

  $("#addUrlExclusion").click(addUrlExclusion);
  $(".removeurlexclusion").click(removeUrlExclusion);
  $("#saveSettings").click(saveSetting);


}

var removeListners = function(){

  $("#addUrlExclusion").unbind('click');
  $(".removeurlexclusion").unbind('click');
  $("#saveSettings").unbind('click');

}
var saveSetting = function(){
  var mainframe = document.getElementById('main_frame').checked;
  var subframe = document.getElementById('sub_frame').checked;
  var ajax = document.getElementById('xmlhttprequest').checked;
  console.log("ajax=="+ajax);

  chrome.runtime.getBackgroundPage(function(bgPage) {
    bgPage.recorderSettings.callTypes=[];
    if(mainframe){
      bgPage.recorderSettings.callTypes.push('main_frame');
    }
    if(subframe){
      bgPage.recorderSettings.callTypes.push('sub_frame');
    }
    if(ajax){
      bgPage.recorderSettings.callTypes.push('xmlhttprequest');
    }

    //showUrlExclusion();

  });
}


var addUrlExclusion = function(){
var excl = document.getElementById('urlExclusion').value;
chrome.runtime.getBackgroundPage(function(bgPage) {
  bgPage.recorderSettings.excludeTypes.push(excl);
  showUrlExclusion();

});
}


var removeUrlExclusion = function(event){
  var val = event.target.getAttribute('data');
  chrome.runtime.getBackgroundPage(function(bgPage) {
     var list = bgPage.recorderSettings.excludeTypes;
      list.splice(list.indexOf(val),1);
    showUrlExclusion();
  });
}


var showUrlExclusion = function(){

  var disp = document.getElementById("UrlexclusionDisplay");
  disp.innerHTML='';
  //var t = document.getElementById('addUrlExclusion');

  chrome.runtime.getBackgroundPage(function(bgPage) {
    var list = bgPage.recorderSettings.excludeTypes;
    for(var i=0;i<list.length;i++){
      var span = document.createElement('span');
      span.className=" label label-info bubble";
      span.innerHTML=""+list[i]+'<a id="removeUrlExclusion" class="removeurlexclusion" data="'+list[i]+'">&times;</a>';

      disp.appendChild(span)
    }
    // call types
    var callTypesList = bgPage.recorderSettings.callTypes;
    for(var i=0;i<callTypesList.length;i++){


      document.getElementById(callTypesList[i]).checked=true;


    }



    removeListners();
    addListners();
  });



}

//settingsLoadHandler();
