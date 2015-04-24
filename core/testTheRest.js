/**
 * @author Vishal Joshi
 * @desc this is small utility for validating the json and parsing it
 *
 */
var testTheRest = function(jsNavi,eventBus) {

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
  var _TEST_STATUS_PASS = 'pass';
  var _TEST_STATUS_FAIL='Error';
  var EVENT_STATS='EVENT_STATS';


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
      if (typeof response == 'string' || response instanceof String){
        response = JSON.parse(response);
      }
      if (status == 200) {
        if (test && test.res_assertions) {

          var testStatus = _TEST_STATUS_PASS
          for (var i = 0; i < test.res_assertions.length; i++) {
            console.info("validating assert :" + test.res_assertions[i].assertName);
            $self.stats.asserts.total++;
            var ev=null;
            if(test.res_assertions[i].assertType && test.res_assertions[i].assertType=="response"){
              var ev = jsNavi.startValidation(response, test.res_assertions[i].expression);
            }else{
              ev = jsNavi.startValidation(headers, test.res_assertions[i].expression);
            }

            test.res_assertions[i].assertStatus = _TEST_STATUS_PASS;
            if (!ev || ev === false) {
              testStatus = _TEST_STATUS_FAIL;
              test.res_assertions[i].assertStatus = _TEST_STATUS_FAIL;
              $self.stats.asserts.fail++;
               console.error("assert  failed expression :" + test.res_assertions[i].assertName);
            }
          }
          test.testStatus = testStatus;
          test.req_body = response;
          test.res_headers=headers;
          if (test.testStatus == _TEST_STATUS_FAIL) {
            $self.stats.testcase.fail++
            console.error("test case failed :" + test.testName);
          }

        } else {
          console.warn("error,no test to validate");
        }
      } else {
        test.testStatus =_TEST_STATUS_FAIL;
        $self.stats.testcase.fail++
        console.error("test case failed : bad response from the server");
      }

      var _statsEvent = new evntObj(EVENT_STATS,$self.stats);
      eventBus.notify(_statsEvent)
      setInProgress(false);
      console.info("**************************end test********************");

    };




    // execute the test
    var executeTest = function(_test) {
      if (_test) {
        console.info("**************************start test**********************************************");
        console.info("executing test : " + _test.testName);
        setInProgress(true);
        _test.req_body = null;
        _test.res_headers=null;
        _test.startTime=null;
        _test.endTime=null;
        _test.testStatus=null;
        _util.comm().get(_test.url, _test.req_headers,  _test.req_params, _test.timeout,validateTest, _test);

      }
    };

    var executeTestAll = function(testQ,testList) {
      if (testList) {
        for (var i = 0; i < testList.length; i++) {
          testQ.push(testList[i]);
        }
      }

    }



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
        if (param && (param=param.trim())!=='') {

                if(param.indexOf('{')==0 && param.indexOf('}')==(param.length-1)){
                   value= param.substring(1,param.length-1);
                  value = jsNavi.startValidation(testCaseObj, value);
                  //console.log(jsNavi.startValidation(testCaseObj, 'projects[0].testSuits[0].tests[0].res_headers.head'));
                }/*else if(param.indexOf('=')==0){
                  headerValue=headers[keys[i]];
                }*/else{
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
      return {
        get: function(url, headers, param,timeout, callBackFunc, callBackParam) {
        callBackParam.startTime =(new Date()).getTime();
          ajax.timeout = !timeout?500:timeout;
          ajax.open('GET', url + '?' + paramToString(param), true);
          ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status != 0) {

              callBackParam.endTime =(new Date()).getTime();
              callBackFunc(ajax.status, buildHeaders(ajax.getAllResponseHeaders()), ajax.responseText, callBackParam);
            }
          };
          ajax.ontimeout = function(){
            console.error('time out:');
            callBackFunc(ajax.status, null, null, callBackParam);
          };

          setHeaders(headers);
          ajax.send();

        },
        post: function(url, headers, param, timeout,callBackFunc, callBackParam) {
            callBackParam.startTime =(new Date()).getTime();
           ajax.timeout = !timeout?500:timeout;
          ajax.open('POST', url, true);
          ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status != 0) {
              callBackParam.endTime =(new Date()).getTime();
              callBackFunc(ajax.status, buildHeaders(ajax.getAllResponseHeaders()), ajax.responseText, callBackParam);
            }
          };

          ajax.ontimeout = function(){
            console.error('time out:');
                      callBackFunc(ajax.status, null, null, callBackParam);
          };
          setHeaders(headers);
          ajax.send(paramToString(param));
        }
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



  var runner = function(testConfi, runConfi) {
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
    var ev = jsNavi.startValidation(testConfi, runConfi);

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
        var test= testQueue.shift();
         restEn.executeTest(test);
       }
       if(testQueue.length<=0){
            clearInterval(isRunning);
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
