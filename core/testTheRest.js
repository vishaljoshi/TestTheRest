/**
 * @author Vishal Joshi
 * @desc this is small utility for validating the json and parsing it
 *
 */
 var _TEST_STATUS_PASS = 'pass';
 var _TEST_STATUS_FAIL='Error';
 var _TEST_STATUS_INPROGRESS='inprogress';
 var _HTTP_TIME_OUT = 'TIME_OUT';
 var _HTTP_ERROR = 'ERROR';
 var _HTTP_ABORT = 'ABORT';

 var EVENT_STATS='EVENT_STATS';

var version=1.1


var testTheRest = function(jsonAssertions,eventBus) {

var testCaseObj=null;

  $self=this;
   this.stats = {
    project: {
      total: 0,
      fail: 0
    },
    testSuit: {
      total: 0,
      fail: 0
    },
    testcase: {
      total: 0,
      fail: 0
    },
    asserts: {
      total: 0,
      fail: 0
    }
  }


  function restEngine(_util) {
    var inprogress = false;
    var setInProgress=function(progress){
      inprogress=progress;
    }
    var getInProgress=function(){
      return inprogress;
    }



    // validate the response
    var validateTest = function(status, headers, response, test) {
      $self.stats.testcase.total++;
      var errorMessage=null;
      test.res_assertions

      //if (status == test.http_status) {
        if (typeof response == 'string' || response instanceof String){
          try{
            response = JSON.parse(response);
          }catch(er){  console.error("test case failed, response is not Json :" + test.testName);}

        }
        if (test && test.res_assertions) {

          var testStatus = _TEST_STATUS_PASS
          for (var i = 0; i < test.res_assertions.length; i++) {
            console.info("validating assert :" + test.res_assertions[i].assertName);
            $self.stats.asserts.total++;
            var ev=null;
            if(test.res_assertions[i].assertType && test.res_assertions[i].assertType=="response"){
               ev = jsonAssertions.assert(response, test.res_assertions[i].expression);
            }else if(test.res_assertions[i].assertType && test.res_assertions[i].assertType=="statusCode"){
               ev = status==test.res_assertions[i].expression
            }else{

              ev = jsonAssertions.assert(headers, test.res_assertions[i].expression);
            }

            test.res_assertions[i].assertStatus = _TEST_STATUS_PASS;
            if (!ev || ev === false) {
              testStatus = _TEST_STATUS_FAIL;
              test.res_assertions[i].assertStatus = _TEST_STATUS_FAIL;
              $self.stats.asserts.fail++;

               errorMessage="assert  failed expression :" + test.res_assertions[i].assertName;
               console.error(errorMessage);
            }
          }
          test.testStatus = testStatus;
          //test.res_body = response;
          test.res_headers=headers;
          if (test.testStatus == _TEST_STATUS_FAIL) {
            $self.stats.testcase.fail++
            console.error("test case failed :" + test.testName);
          }

        } else {
          console.warn("error,no assertions");
        }
      /*} else {
        test.testStatus =_TEST_STATUS_FAIL;
        $self.stats.testcase.fail++
        errorMessage= "test case failed : bad response from the server HTTP status:"+status+ ", "+response;
        console.error(errorMessage);
      }*/

      var _statsEvent = new evntObj(EVENT_STATS,{'stats':$self.stats,'testId':test.id,'testStatus':test.testStatus,'errorMessage':errorMessage});
      eventBus.notify(_statsEvent)
      setInProgress(false);
      console.info("**************************end test********************");

    };




    // execute the test
    var executeTest = function(_test) {
      if (_test) {
        _test.testStatus=_TEST_STATUS_INPROGRESS;
        var _statsEvent = new evntObj(EVENT_STATS,{'stats':$self.stats,'testId':_test.id,'testStatus':_test.testStatus});
        eventBus.notify(_statsEvent)
        console.info("**************************start test**********************************************");
        console.info("executing test : " + _test.testName);

        setInProgress(true);
        _test.req_body = null;
        _test.res_headers=null;
        _test.startTime=null;
        _test.endTime=null;
        _test.testStatus=null;
          if(_test.method=='GET'){
            _util.comm().get(_test.url, _test.req_headers,  _test.req_params, _test.timeout,validateTest, _test);
          }else if(_test.method=='POST'){
            _util.comm().post(_test.url, _test.req_headers,  _test.req_params, _test.timeout,validateTest, _test);
          }

        }



    };

    var executeTestAll = function(testQ,testList) {
      if (testList) {
        for (var i = 0; i < testList.length; i++) {
          testQ.push(testList[i]);
        }
      }

    };



    return {

      "executeTest": executeTest,
      "executeTestAll": executeTestAll,
      "setInProgress": setInProgress,
      "getInProgress":getInProgress

    }

  }


  var _util = function() {

    var comm = function() {
      var ajax = new XMLHttpRequest();
      var allHeadersReg = /(^.+)/gm;

      var evalParam= function(param){
        var value='';


        if (param) {
          if((typeof param == 'string' || param instanceof String) && (param=param.trim())!=='' ){
            if(param.indexOf('$.')==0){
               value= param.substring(2,param.length);
              value = jsonAssertions.jsonParser.parse(testCaseObj, value);
              //console.log(jsNavi.startValidation(testCaseObj, 'projects[0].testSuits[0].tests[0].res_headers.head'));
            }/*else if(param.indexOf('=')==0){
              headerValue=headers[keys[i]];
            }*/else{
            value=param;
            }
          }else{
            value=param;
          }
        }//if
        return value;
      }// evalParam


      var setHeaders = function(headers) {
        if (headers) {


          for (var i = 0; i < headers.length; i++) {
            var key = Object.keys(headers[i]);
            var headerValue=evalParam(headers[i][key]);

            ajax.setRequestHeader(key, headerValue);
            console.log('setting headers ' + key + '==' + headerValue)
          }
        }

      };
      var getHeader = function(headers,keyValue) {
        if (headers) {


          for (var i = 0; i < headers.length; i++) {
            var key = Object.keys(headers[i]);
            if(key==keyValue){
                var headerValue=evalParam(headers[i][key]);
                return headerValue;
            }
          }
          return null;
        }

      };
      var buildHeaders = function(headerString) {
          var header={};
          if(headerString){
          var m;
              while ((m = allHeadersReg.exec(headerString)) != null) {
                  if (m.index === allHeadersReg.lastIndex) {
                      allHeadersReg.lastIndex++;

                  }
                  if(m[1]){
                     var _i= m[1].indexOf(':');
                      header[m[1].substring(0,_i)]=m[1].substring(_i+1,m[1].length).trim();
                  }
              }
          }
          return header;
      };

      var paramToString = function(param) {
        _ret = '';
        if (param) {


          for (var i = 0; i < param.length; i++) {
            var key = Object.keys(param[i]);
            if (i != 0) {
              _ret += '&'
            }
            _ret += key + '=' + evalParam(param[i][key]);
          }
        }
        return _ret;
      }
      var paramToEncodeURIComponent = function(param) {
        _ret = '';
        if (param) {


          for (var i = 0; i < param.length; i++) {
            var key = Object.keys(param[i]);
            if (i != 0) {
              _ret += '&'
            }
            _ret += encodeURIComponent(key) + '=' + encodeURIComponent(evalParam(param[i][key]));
          }
        }
        return _ret;
      }
      return {
        get: function(url, headers, param,timeout, callBackFunc, callBackParam) {
          try{
        callBackParam.startTime =(new Date()).getTime();
          ajax.timeout = !timeout?500:timeout;
          ajax.open('GET', url +(param && param.length>0?'?':'') + paramToString(param), true);
          ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status != 0) {
              console.info('HTTP response status:'+ajax.status);
              console.info('HTTP response response:'+ajax.responseText);
              callBackParam.endTime =(new Date()).getTime();
              callBackFunc(ajax.status, buildHeaders(ajax.getAllResponseHeaders()), ajax.responseText, callBackParam);
            }
          };




          ajax.ontimeout = function(){
            console.error('on time out:'+ajax.timeout);
            callBackFunc(_HTTP_TIME_OUT, null, 'resquest timed out at '+ajax.timeout+' ms.', callBackParam);
          };
          ajax.onerror = function(er){
            console.error('on error:'+er);
            callBackFunc(_HTTP_ERROR, null, 'an error occured while making the request ', callBackParam);
          };

          ajax.onabort = function(){
            console.error('on abort:');
            callBackFunc(_HTTP_ABORT, null, 'the request is aborted', callBackParam);
          };




          setHeaders(headers);

            ajax.send();
          }catch(er){
            console.error('error :'+er);
            callBackFunc(ajax.status, null, 'an error has occured while making the request', callBackParam);
          }


        },
        post: function(url, headers, param, timeout,callBackFunc, callBackParam) {

            try{
              callBackParam.startTime =(new Date()).getTime();
           ajax.timeout = !timeout?500:timeout;
          ajax.open('POST', url, true);
          ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status != 0) {
              console.info('HTTP response status:'+ajax.status);
              console.info('HTTP response response:'+ajax.responseText);
              callBackParam.endTime =(new Date()).getTime();
              callBackFunc(ajax.status, buildHeaders(ajax.getAllResponseHeaders()), ajax.responseText, callBackParam);
            }
          };

          ajax.ontimeout = function(){
            console.error('on time out:'+ajax.timeout);
            callBackFunc(_HTTP_TIME_OUT, null, 'resquest timed out at '+ajax.timeout+' ms.', callBackParam);
          };
          ajax.onerror = function(er){
            console.error('on error:'+er);
            callBackFunc(_HTTP_ERROR, null, 'an error occured while making the request ', callBackParam);
          };

          ajax.onabort = function(){
            console.error('on abort:');
            callBackFunc(_HTTP_ABORT, null, 'the request is aborted', callBackParam);
          };

          setHeaders(headers);
          if(getHeader(headers,'Content-Type')=='application/x-www-form-urlencoded'){
            ajax.send(paramToEncodeURIComponent(param));
          }else{
            ajax.send(callBackParam.req_params_raw);
          }

        }catch(er){
          console.error('error :'+er);
          callBackFunc(ajax.status, null, 'an error has occured while making the request', callBackParam);
        }
      }//post
      };
    }

    var arrayFind = function(arraytosearch, key, valuetosearch) {

      for (var i = 0; i < arraytosearch.length; i++) {

        if (arraytosearch[i][key] == valuetosearch) {
          return arraytosearch[i][key];
        }
      }
      return null;
    }

    return {
      "comm": comm,
      "arrayFind": arrayFind
    }
  }();

var getTestCaseValue = function(testCaseObj,current,value){

  if(param.indexOf('$.')==0){
     value= param.substring(2,param.length);
    value = jsonAssertions.jsonParser.parse(testCaseObj, value);
    //console.log(jsNavi.startValidation(testCaseObj, 'projects[0].testSuits[0].tests[0].res_headers.head'));
  }else if(param.indexOf('$testSuit')==0){
     value= param.substring(2,param.length);
    value = jsonAssertions.jsonParser.parse(testCaseObj, value);
    //console.log(jsNavi.startValidation(testCaseObj, 'projects[0].testSuits[0].tests[0].res_headers.head'));
  }
}



  var runner = function(testConfi, runConfi ,completedFunc) {
    testCaseObj=testConfi;
    $self.stats = {
      project: {
        total: 0,
        fail: 0
      },
      testSuit: {
        total: 0,
        fail: 0
      },
      testcase: {
        total: 0,
        fail: 0
      },
      asserts: {
        total: 0,
        fail: 0
      }
    }
    if(!testConfi.version){
      testConfi.version =version;
    }
    if(testConfi.version!==version){
      console.info('Test case version '+testConfi.version+' is not compatible with version '+version);
      return;
    }
    var ev = jsonAssertions.jsonParser.parse(testConfi, runConfi);

     var testQueue = new Array();


    if (ev) {
      if (ev.projects) {
        //all the project

        for (var j = 0; j < ev.projects.length; j++) {
          $self.stats.project.total++

          if (ev.projects[j] && ev.projects[j].testSuits) {
             console.info('Project :'+ev.projects[j].projectName);
            for (var i = 0; i < ev.projects[j].testSuits.length; i++) {
              $self.stats.testSuit.total++;
               console.info('Test Suits :'+ev.projects[j].testSuits[i].testSuitName);
              restEn.executeTestAll(testQueue,ev.projects[j].testSuits[i].tests);
            }
          }
        }

      } else if (ev.projectName) {
        $self.stats.project.total++;
        console.info('Project :'+ev.projectName);
        if (ev && ev.testSuits) {
          for (var i = 0; i < ev.testSuits.length; i++) {
             $self.stats.testSuit.total++;
             console.info('Test Suits :'+ev.testSuits[i].testSuitName);
            restEn.executeTestAll(testQueue,ev.testSuits[i].tests);
          }
        }
      } else if (ev.testSuitName) {
        $self.stats.testSuit.total++;
        console.info('Test Suits :'+ev.testSuitName);
        restEn.executeTestAll(testQueue,ev.tests)
      } else if (ev.testName) {
         console.info('Test  :'+ev.testName);
        restEn.executeTest(ev)
      }
    }

       var isRunning =setInterval(function(){anyThingToTest()}, 1000);

     var anyThingToTest =function(){
  //   console.log("anyThingToTest queue size="+testQueue.length+', restEn.inprogress='+restEn.getInProgress());

       if(!restEn.getInProgress()){
         if(testQueue.length>0){
           var test= testQueue.shift();
            restEn.executeTest(test);

         }else{
           clearInterval(isRunning);
           console.info('All test Completed!');
           completedFunc($self.stats);
         }

       }


    }

return $self.stats;
}

// return the engine.
var restEn = restEngine(_util);


return {
  "runner": runner

}

}
