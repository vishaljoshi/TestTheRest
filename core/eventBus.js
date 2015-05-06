// Code goes here

// JavaScript Document

var evntObj = function(name,data){
this.name=name;
this.data=data;
  this.getName= function(){
    return this.name;
  }
  this.getData= function(){
    return this.data;
  }
}


var eventBus =function(){
var queue = new Array();
var eventMapper ={};
var isRunning=null;



  var checkEvent =function (){
     //console.log("event queue size"+queue.length);
    if(queue.length>0){
            var _event = queue.shift();
            var func = eventMapper[_event.getName()];
            func.call(this,_event);
   }
  }

   var startEventCycle = function(){
      isRunning =setInterval(checkEvent, 1000);
  }

  var stopEventCycle = function(){
    clearInterval(isRunning);
  }

  var register = function(_eventName,handlerFunc){
    eventMapper[_eventName]=handlerFunc;
  }

  var notify = function(_event){
      queue.push(_event);

  }
  startEventCycle();
  return {"stopEventCycle":stopEventCycle,"register":register,"notify":notify}

}();
