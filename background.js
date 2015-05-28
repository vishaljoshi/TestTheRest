var requestDetails ={};
var recorderSettings ={
  'isStarted':false,
  'excludeTypes':['.css','.js','.html','fluid/i18n']
  };


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.recorder && request.recorder.status === "start"){
          onRecord(request.recorder.url);
          sendResponse({recorder: {status:'started'}});
      }else if (request.recorder && request.recorder.status === "stop"){
        onStopRecord();
        sendResponse({recorder: {status:'stopped','requestDetails':requestDetails}});
      }

    });




var onCompletedCallBack =function(details) {

  var req = requestDetails[details.requestId+''];
  if(!req){
    return;
  }
  req.completionTime=details.timeStamp;
  console.log('on complete=>'+details.requestId+','+details.method+','+details.url+', '+details.type+','+details.responseHeaders+','+details.timeStamp)
};

var onBeforeSendHeadersCallBack=function(details){
  var req = requestDetails[details.requestId+''];
  if(!req){
    return;
  }
  req.method=details.method;
  req.type=details.type;
  req.requestHeaders=details.requestHeaders;
  req.url=details.url;


  console.log('on send headers=>'+details.requestId+','+details.method+','+details.url+' , '+details.type+','+details.requestHeaders+','+details.timeStamp)
  if(details.requestHeaders!==null && details.requestHeaders!==undefined){
    return {requestHeaders: details.requestHeaders};
  }else{
    return;
  }

};

var onBeforeRequestCallBack=function(details){
  // start from here
  var isgood=false;
  // use a regex
  var excludeTypes =recorderSettings.excludeTypes;
  for (var i = 0; i < excludeTypes.length; i++) {
    if(details.url.indexOf(excludeTypes[i])!=-1){
      return;
    }
  }
  var req = requestDetails[details.requestId+''];
  if(!req){
    req={};
    requestDetails[details.requestId+'']=req;
  }
  req.startTime=details.timeStamp;
  req.method=details.method;
  req.type=details.type;

  req.url=details.url;
  console.log('on before request=>'+details.requestId+','+details.method+', '+details.url+', '+details.type+','+details.timeStamp)
  if(details.requestBody!==null && details.requestBody!==undefined){
    req.requestBody=details.requestBody;
    return {requestBody: details.requestBody}; //this throws error on post call
  }else{
    return;
  }


};

var onHeadersReceivedCallBack=function(details){
  var req = requestDetails[details.requestId];
  if(!req){
    return;
  }
  req.method=details.method;
  req.type=details.type;
  req.responseHeaders=details.responseHeaders;
  req.url=details.url;
  console.log('on onHeadersReceived=>'+details.requestId+','+details.method+','+details.url+', '+details.type+','+details.responseHeaders+','+details.timeStamp);
  if(details.responseHeaders!==null && details.responseHeaders!==undefined){
    return {responseHeaders: details.responseHeaders};
  }else{
    return;
  }


};

var onErrorOccurredCallBack=function(details){
  console.error('on error=>'+details.requestId+','+details.method+','+details.url+', '+details.type+','+details.responseHeaders+','+details.timeStamp);
};
var onRecord = function(url){
  console.log("inside onrecord url="+url);
  var filter = {urls: ['*://'+url+'*'],types:['main_frame', 'sub_frame','xmlhttprequest']}
  requestDetails={};
  chrome.webRequest.onCompleted.addListener(onCompletedCallBack,filter);


  chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeadersCallBack,filter,["blocking", "requestHeaders"]);//

  chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestCallBack,filter,[ "requestBody"]);//


    chrome.webRequest.onHeadersReceived.addListener(onHeadersReceivedCallBack,filter,["blocking", "responseHeaders"]);//,["blocking", "responseHeaders"]

    chrome.webRequest.onErrorOccurred.addListener(onErrorOccurredCallBack,filter);
    console.log("inside onrecord completed registration");
    recorderSettings.isStarted=true;
}

var onStopRecord= function(){
  console.log("inside onStopRecord");
  chrome.webRequest.onCompleted.removeListener(onCompletedCallBack);


  chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersCallBack);//["blocking", "requestHeaders"]

  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestCallBack);//["blocking", "requestBody"]


    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedCallBack);//,["blocking", "responseHeaders"]

    chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurredCallBack);

    recorderSettings.isStarted=false;
  //  console.log(requestDetails);

}


var  importer = function(){
  var projectName="default project"
  var projects =[];
  var testSuits=[];
  var tests = []
  var keys = Object.keys(requestDetails);
  keys.sort();
var url;
if(keys.length>0){
  for(var i=0;i<keys.length;i++){
    var k =keys[i];
    var test ={};
    var matches = requestDetails[k].url.match(/^[^#]*?:\/\/.*?(\/.*)$/);
    if(matches && matches[1]){
      test.testName= matches[1];
    }else{
      test.testName=requestDetails[k].url;
    }

    test.url=requestDetails[k].url;
    url=requestDetails[k].url;
    test.method=requestDetails[k].method;
    test.timeout= Math.ceil((requestDetails[k].completionTime -requestDetails[k].startTime)+(1000*5)) ;
    test.req_headers=[];
    var headers = requestDetails[k].requestHeaders;
    for(var j=0;j<headers.length;j++){
      var h = {};
      h[headers[j].name]=headers[j].value;
      test.req_headers.push(h);
    }

    test.req_params=[];
    test.res_assertions=[];
    tests.push(test);
  }
  var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  if(matches && matches[1]){
    projectName=matches[1];
  }
  testSuits.push({"testSuitName":"default test suilt","tests":tests});
  projects.push({  "projectName": projectName,
    "projectDesc": "this is a default  project",
    "testSuits": testSuits});
  var finalProject=  {"projects":projects};
console.log("importing "+finalProject);
return finalProject;
}else{
  return null;
}

}
