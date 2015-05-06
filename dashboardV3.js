/*

 <li>
 <span><i class="icon-leaf"></i> Grand Child</span>
 <a href="">Goes somewhere</a>
 </li>



*/


window.addEventListener('load', loadHandler);

function loadHandler() {




  window.initDash = function(struct) {
    window.dash = null;
    window.main = null;
    window.main = testTheRest(jsNavi, eventBus);
    // main.executeTest(testData.tests[0]);
    var data = null;
    document.getElementById("consoleView").innerHTML = null;
    document.getElementById("projectNav").innerHTML = null;

    if (typeof struct == 'string' || struct instanceof String) {
      data = JSON.parse(struct);
    } else {
      data = struct
    }
    window.dash = dashboard(document, data);

  }
  initDash(defaultStruct);


  $(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
  });



}



function consolechange() {
  var isbrowser = false
  var consoleView;
  _console = {};
  if (typeof window !== 'undefined' && typeof location !== 'undefined') {
    isbrowser = true
    consoleView = document.getElementById("consoleView");
    if (consoleView) {
      _console.info = function(msg) {
        consoleView.innerHTML += '<span class="console info">' + msg + '</span>';
      }

      _console.log = function(msg) {
        consoleView.innerHTML += '<span class="console log">' + msg + '</span>';
      }
      _console.error = function(msg) {
        consoleView.innerHTML += '<span class="console error">' + msg + '</span>';
      }

      _console.warn = function(msg) {
        consoleView.innerHTML += '<span class="console warning">' + msg + '</span>';
      }

    } else {
      _console = console;
    }

  } else {
    isbrowser = false;
    _console = console;
  }

  console = _console;
  window.console = console;
};



var dashboard = function($doc, config) {
  consolechange();

  var play = function(event) {
    event = event || window.event;
    //event.target.data
    //  document.getElementById("statsView").style.display = "none";
    document.getElementById("progress").style.display="block";
    document.getElementById("consoleView").innerHTML = null;
    //  console.log(event.target.parentElement.getAttribute('data'));
    var id = event.target.parentElement.parentElement.id;
    $('#'+id).find('.testName').removeClass('testFail');
    $('#'+id).find('.testName').removeClass('testPass');
    var stats = main.runner(config, event.target.parentElement.parentElement.getAttribute('data'),testCompleted);
    //  console.log("assert3==" + stats.asserts.total);

    event.stopPropagation();
    return true;
  }

  var testCompleted = function(status) {
  //  var _statsEvent = new evntObj(EVENT_STATS,status);
  //  eventBus.notify(_statsEvent)
    document.getElementById("progress").style.display="none";

  }

  var copy = function(event) {
    event = event || window.event;
    //console.log(event.target.parentElement.parentElement.getAttribute('data'))
    var ev = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('data'));
    var parent = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('parent'));
    var parentNode = event.target.parentElement.parentElement.parentElement;
    if (parent && ev) {
      var newObject = JSON.parse(JSON.stringify(ev));
      var _LItest = null;
      if (ev.testName) {
        newObject.testName = 'blank-' + ev.testName + parent.length;
        //newObject.id='blank'+parent.length+'-'+ev.testName
        //_LItest  = getNode(newObject.testName, 'test',parent.length);

      } else if (ev.testSuitName) {
        newObject.testSuitName = 'blank-' + ev.testSuitName + parent.length;
        //var _LItest = getNode(newObject.testSuitName, 'test suit',parent.length);

      } else if (ev.projectName) {
        newObject.projectName = 'blank-' + ev.projectName + parent.length + '-';
        //  _LItest  = getNode(newObject.projectName, 'project',parent.length);
      }
      //_LItest.setAttribute('data', event.target.parentElement.parentElement.getAttribute('parent')+'['+parent.length+']');
      //_LItest.setAttribute('parent', event.target.parentElement.parentElement.getAttribute('parent'));
      //parentNode.appendChild(_LItest);
      parent.push(newObject);
      load(config);
      //registerAction();
    }
    event.stopPropagation();

  }

  var deleteHeader = function(event) {
    var e = event || window.event;
    var ids = event.target.getAttribute('data').split("-");
    var id = ids[0];
    var key = ids[2];
    var ev = jsNavi.startValidation(config, document.getElementById(id).getAttribute('data'));
    if (ev.req_headers) {
      delete ev.req_headers[key];

    }
    event.target.parentElement.parentElement.className += ' deleteTestHeader';
    return false;
  }
  var addHeader = function(event) {
    $(".addHeaderElement").unbind("click");
    $(".deleteHeaderElement").unbind("click");

    var e = event || window.event;
    var elementId = event.target.getAttribute('data');
    var key = null;
    var value = '_blank';
    var rowElement = document.getElementById('headers' + elementId);

    var ev = jsNavi.startValidation(config, document.getElementById(elementId).getAttribute('data'));
    if (!ev.req_headers) {
      ev.req_headers = [];
    }
    key = 'header-'+ev.req_headers.length;
    var header = {};
    header[key] = value;
    ev.req_headers.push(header);

    //var header ='<div class="col-xs-6"><a href="#" data="'+elementId+'-formTestHeader-'+keys[i]+'" class="deleteHeaderElement" >-</a>key : <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+keys[i]+'" value="'+keys[i]+'"></div> <div class="col-xs-6">value: <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+ev.req_headers[keys[i]]+'" value="'+ev.req_headers[keys[i]]+'"></div>';
    var header = '<div class="row"><div class="col-xs-6"><a  data="' + elementId + '-formTestHeader-' + key + '" class="deleteHeaderElement" >-</a>' +
      'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestHeader-key" value="' + key + '"></div>' +
      '<div class="col-xs-6">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestHeader-value" value="' + value + '"></div></div>';



    //var header = '<div class="col-xs-6"><a href="#" data="'+elementId+'-formTestHeader-'+key+'" class="deleteHeaderElement" >-</a>key : <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+key+'" value="'+key+'"></div> <div class="col-xs-6">value: <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+value+'" value="'+value+'"></div>';
    var div = document.createElement('div');
    div.innerHTML = header;
    var element = div.firstChild;
    rowElement.appendChild(element);
    div.innerHTML = null;

    $('.addHeaderElement').click(function(e) {
      addHeader(e);
    });
    $('.deleteHeaderElement').click(function(e) {
      deleteHeader(e);
    });
    return false;

  }
  var deleteParam = function(event) {
    var e = event || window.event;
    var ids = event.target.getAttribute('data').split("-");
    var id = ids[0];
    var key = ids[2];
    var ev = jsNavi.startValidation(config, document.getElementById(id).getAttribute('data'));
    if (ev.req_params) {
      delete ev.req_params[key];

    }
    event.target.parentElement.parentElement.className += ' deleteTestHeader';
    return true;
  }
  var addParam = function(event) {
    $(".addParamElement").unbind("click");
    $(".deleteParamElement").unbind("click");

    var e = event || window.event;
    var elementId = event.target.getAttribute('data');
    var key = null;
    var value = '_blank';
    var rowElement = document.getElementById('params' + elementId);

    var ev = jsNavi.startValidation(config, document.getElementById(elementId).getAttribute('data'));
    if (!ev.req_params) {
      ev.req_params = [];
    }
    key = 'param-'+ev.req_params.length;
    var param = {};
    param[key] = value;
    ev.req_params.push(param);

    //var header ='<div class="col-xs-6"><a href="#" data="'+elementId+'-formTestHeader-'+keys[i]+'" class="deleteHeaderElement" >-</a>key : <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+keys[i]+'" value="'+keys[i]+'"></div> <div class="col-xs-6">value: <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+ev.req_headers[keys[i]]+'" value="'+ev.req_headers[keys[i]]+'"></div>';
    var paramWrap = '<div class="row"><div class="col-xs-6"><a  data="' + elementId + '-formTestParam-' + key + '" class="deleteParamElement" >-</a>' +
      'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestParam-key" value="' + key + '"></div>' +
      '<div class="col-xs-6">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestParam-value" value="' + value + '"></div></div>';



    //var header = '<div class="col-xs-6"><a href="#" data="'+elementId+'-formTestHeader-'+key+'" class="deleteHeaderElement" >-</a>key : <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+key+'" value="'+key+'"></div> <div class="col-xs-6">value: <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+value+'" value="'+value+'"></div>';
    var div = document.createElement('div');
    div.innerHTML = paramWrap;
    var element = div.firstChild;
    rowElement.appendChild(element);
    div.innerHTML = null;

    $('.addParamElement').click(function(e) {
      addParam(e);
    });
    $('.deleteParamElement').click(function(e) {
      deleteParam(e);
    });
    return true;

  }

  var deleteAssert = function(event) {
    var e = event || window.event;
    var ids = event.target.getAttribute('data').split("-");
    var id = ids[0];
    var key = ids[2];
    var ev = jsNavi.startValidation(config, document.getElementById(id).getAttribute('data'));
    if (ev.res_assertions) {
      delete ev.res_assertions[key];

    }
    event.target.parentElement.parentElement.className += ' deleteTestHeader';
    return true;
  }
  var addAssert = function(event) {
    $(".addAssertElement").unbind("click");
    $(".deleteAssertElement").unbind("click");

    var e = event || window.event;
    var elementId = event.target.getAttribute('data');
    var key = null;
    var value = 'true';
    var rowElement = document.getElementById('assert' + elementId);

    var ev = jsNavi.startValidation(config, document.getElementById(elementId).getAttribute('data'));
    if (!ev.res_assertions) {
      ev.res_assertions = [];
    }
    key = ev.res_assertions.length;
    var assert = {};
  ///  param[key] = value;
    var assert = {
      "assertName": 'asert-'+key,
      "assertType": "header",
      "expression": value
    }
    ev.res_assertions.push(assert);


    var selection=  '<select  class="formTestinput" id="' + elementId + '-formTestAssertion-type" ><option id="header" value="header" selected >header</option><option id="response" value="response">response</option></select>'
    var assertWrap = '<div class="row"><div class="col-xs-4">'+
      '<a  data="' + elementId + '-formTestAssert-' + assert.assertName + '" class="deleteAssertElement" >-</a>' +
        'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-key" value="' +  assert.assertName + '"></div>' +
        '<div class="col-xs-4">type:'+selection+' </div>'+
        '<div class="col-xs-4">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-value" value="' + assert.expression + '"></div></div>';




    //var header = '<div class="col-xs-6"><a href="#" data="'+elementId+'-formTestHeader-'+key+'" class="deleteHeaderElement" >-</a>key : <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+key+'" value="'+key+'"></div> <div class="col-xs-6">value: <input class="formTestinput" type="text" id="'+elementId+'-formTestHeader-'+value+'" value="'+value+'"></div>';
    var div = document.createElement('div');
    div.innerHTML = assertWrap;
    var element = div.firstChild;
    rowElement.appendChild(element);
    div.innerHTML = null;

    $('.addAssertElement').click(function(e) {
      addAssert(e);
    });
    $('.deleteAssertElement').click(function(e) {
      deleteAssert(e);
    });
    return true;

  }

  var save = function(event) {
    var e = event || window.event;
    var ev = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('data'));
    var elementId = event.target.parentElement.parentElement.getAttribute('id')
    var parent = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('parent'));
    var parentNode = event.target.parentElement.parentElement.parentElement;

    if (parent && ev) {
      var identifier = ev.id;
      if (ev.testName) {


        ev.testName = document.getElementById(identifier + '-formTestName').value;
        event.target.innerHTML = ev.testName+'<div> <img class="callout" src="callout.gif" /><strong>'+ev.testName+'</strong><br /><p class="testDesc"></p></div>';
        ev.url = document.getElementById(identifier + '-formTestUrl').value;
        ev.method = document.getElementById(identifier + '-formTestMethod').value;
        ev.timeout = document.getElementById(identifier + '-formTestTimeout').value;
        if (ev.req_headers) {
          delete ev.req_headers;
          ev.req_headers = [];
          $('#headers' + elementId).children('.row').not('.deleteTestHeader').each(function(index, row) {

            var key = $(row).find('#' + elementId + '-formTestHeader-key').val();
            var value = $(row).find('#' + elementId + '-formTestHeader-value').val();
            var header = {};
            header[key] = value;
            ev.req_headers.push(header);
          });




        }
        if (ev.req_params) {

          delete ev.req_params;
          ev.req_params = [];
          $('#params' + elementId).children('.row').not('.deleteTestHeader').each(function(index, row) {

            var key = $(row).find('#' + elementId + '-formTestParam-key').val();
            var value = $(row).find('#' + elementId + '-formTestParam-value').val();
            var param = {};
            param[key] = value;
            ev.req_params.push(param);
          });




        }

        if (ev.res_assertions) {

          delete ev.res_assertions;
          ev.res_assertions = [];
          $('#assert' + elementId).children('.row').not('.deleteTestHeader').each(function(index, row) {

            var key = $(row).find('#' + elementId + '-formTestAssertion-key').val();
            var value = $(row).find('#' + elementId + '-formTestAssertion-value').val();
            var type = $(row).find('#' + elementId + '-formTestAssertion-type').val();
            var assert = {
              "assertName": key,
              "assertType": type,
              "expression": value
            }
            ev.res_assertions.push(assert);
          });




        }




      } else if (ev.testSuitName) {
        //testForm.innerHTML=inHtml+'<div class="container"><div class="row"><input type="text" id="formTestSuitName" value="'+ev.testSuitName+'"></div></div>'+'</div></div>';
        ev.testSuitName = document.getElementById(identifier + '-formTestSuitName').value;
        event.target.innerHTML = ev.testSuitName+'<div> <img class="callout" src="callout.gif" /><strong>'+ev.testSuitName+'</strong><br /><p class="testDesc"></p></div>';

      } else if (ev.projectName) {
        //testForm.innerHTML=inHtml+'<div class="container"><div class="row"><input type="text" id="formProjectName" value="'+ev.projectName+'"></div></div>';
        ev.projectName = document.getElementById(identifier + '-formTestProjectName').value;
        event.target.innerHTML = ev.projectName+'<div> <img class="callout" src="callout.gif" /><strong>'+ev.projectName+'</strong><br /><p class="testDesc"></p></div>';
      }
      //registerAction();
      //  testForm.style.display='block';
    //  load(config);
    }
    e.stopPropagation();
console.info('saved');
  }


  var edit = function(event) {
    $(".addHeaderElement").unbind("click");
    $(".deleteHeaderElement").unbind("click");
    var e = event || window.event;
    var elementId = e.target.parentElement.parentElement.getAttribute('id');
    var testForm = document.getElementById("testform" + elementId);
    if (testForm.style.display === 'none') {
      //console.log(event.target.parentElement.parentElement.getAttribute('data'))
      var ev = jsNavi.startValidation(config, e.target.parentElement.parentElement.getAttribute('data'));
      var parent = jsNavi.startValidation(config, e.target.parentElement.parentElement.getAttribute('parent'));
      var parentNode = e.target.parentElement.parentElement.parentElement;


      testForm.innerHTML = null;
      var inHtml = '<div class="panel panel-primary" > <div class="panel-heading"><h3 class="panel-title">Edit <a class="save">save</a></h3></div><div class="panel-body">';
      if (parent && ev) {
        if (ev.testName) {

          //inHtml+='<div class="row"> <div class="col-xs-6"><span class="title">name</span></div> <div class="col-xs-6"><span class="title">Url</span></div> </div> <div class="row"> <div class="col-xs-6"><input type="text" id="'+elementId+'-formTestName" value="'+ev.testName+'"></div> <div class="col-xs-6"><input type="text" id="'+elementId+'-formTestUrl" value="'+ev.url+'"></div> </div> <div class="row"> <div class="col-xs-6"><span class="title">method</span></div> <div class="col-xs-6"><span>time Out</span></div> </div> <div class="row"> <div class="col-xs-6"><input type="text" id="'+elementId+'-formTestMethod" value="'+ev.method+'"></div> <div class="col-xs-6"><input type="text" id="'+elementId+'-formTestTimeout" value="'+ev.timeout+'"></div> </div> ';
          inHtml += '<div class="row"> <div class="col-xs-12"><div class="formTesttitle">Test Case Name</div></div></div>' +
            '<div class="row"> <div class="col-xs-12"><input class="formTestinput" type="text" id="' + elementId + '-formTestName" value="' + ev.testName + '"></div></div>' +
            '<div class="row"><div class="col-xs-12"><div class="formTesttitle">Url</div></div></div>' +
            '<div class="row"><div class="col-xs-12"><input class="formTestinput" type="text" id="' + elementId + '-formTestUrl" value="' + ev.url + '"></div> </div>' +
            '<div class="row"> <div class="col-xs-6"><div class="formTesttitle">method</div></div> <div class="col-xs-6"><div class="formTesttitle">time Out</div></div> </div> <div class="row"> <div class="col-xs-6"><input class="formTestinput" type="text" id="' + elementId + '-formTestMethod" value="' + ev.method + '"></div> <div class="col-xs-6"><input class="formTestinput" type="text" id="' + elementId + '-formTestTimeout" value="' + ev.timeout + '"></div> </div> ';

          // start header
          inHtml += '<div class="row"><div class="col-xs-12"><h3>header<a  data="' + elementId + '" class="addHeaderElement" >+</a></h3></div></div><div class="row" ><div class="col-xs-12" id="headers' + elementId + '">';
          if (ev.req_headers) {


            for (var i = 0; i < ev.req_headers.length; i++) {
              var key = Object.keys(ev.req_headers[i]);
              inHtml += '<div class="row"><div class="col-xs-6"><a  data="' + elementId + '-formTestHeader-' + key + '" class="deleteHeaderElement" >-</a>' +
                'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestHeader-key" value="' + key + '"></div>' +
                '<div class="col-xs-6">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestHeader-value" value="' + ev.req_headers[i][key] + '"></div></div>';
            }


          }
          inHtml += '</div></div>';
          // END header
          // START param
          inHtml += '<div class="row"><div class="col-xs-12"><h3>Param<a data="' + elementId + '" class="addParamElement" >+</a></h3></div></div><div class="row" ><div class="col-xs-12" id="params' + elementId + '">';
          if (ev.req_params) {
            /// inHtml+= '<div class="row"><div class="col-xs-12"><h3>Param</h3><a href="#" data="'+elementId+'" class="addParamElement" >+</a></div></div>';

            for (var i = 0; i < ev.req_params.length; i++) {
              var key = Object.keys(ev.req_params[i]);
              inHtml += '<div class="row"><div class="col-xs-6"><a  data="' + elementId + '-formTestParam-' + key + '" class="deleteParamElement" >-</a>' +
                'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestParam-key" value="' + key + '"></div>' +
                '<div class="col-xs-6">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestParam-value" value="' + ev.req_params[i][key] + '"></div></div>';
            }

          }
          inHtml += '</div></div>';
          // END PARAM


          // START ASSERTS
          inHtml += '<div class="row"><div class="col-xs-12"><h3>Asserts<a data="' + elementId + '" class="addAssertElement" >+</a></h3></div></div><div class="row" ><div class="col-xs-12" id="assert' + elementId + '">';
          if (ev.res_assertions) {
            /// inHtml+= '<div class="row"><div class="col-xs-12"><h3>Param</h3><a href="#" data="'+elementId+'" class="addParamElement" >+</a></div></div>';

            for (var i = 0; i < ev.res_assertions.length; i++) {
              var assert = ev.res_assertions[i];
              //var key = Object.keys(assert);

            var selection=  '<select  class="formTestinput" id="' + elementId + '-formTestAssertion-type" ><option id="header" value="header" '+(assert.assertType == "header"?"selected":"")+'>header</option><option id="response" value="response"'+( assert.assertType == "response"?"selected":"") +'>response</option></select>'
              inHtml += '<div class="row"><div class="col-xs-4">'+
              '<a  data="' + elementId + '-formTestAssert-' + assert.assertName + '" class="deleteAssertElement" >-</a>' +
                'key : <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-key" value="' +  assert.assertName + '"></div>' +
                '<div class="col-xs-4">type:'+selection+' </div>'+
                '<div class="col-xs-4">value: <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-value" value="' + assert.expression + '"></div></div>';
            }

          }
          inHtml += '</div></div>';
          // END ASSERTS


        /*  if (ev.res_assertions) {
            inHtml += '<div class="row"><div class="col-xs-12"><h3>Asserts</h3></div></div><div class="row">';
            //  var keys = Object.keys(ev.req_params);

            for (var i = 0; i < ev.res_assertions.length; i++) {
              var assert = ev.res_assertions[i];
              inHtml += '<div class="col-xs-6">assertName : <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-' + assert.assertName + '" value="' + assert.assertName + '"></div>';
              var type = assert.assertType == "response" ? 'response' : 'header';
              inHtml += '<div class="col-xs-6">value for ' + type + ': <input class="formTestinput" type="text" id="' + elementId + '-formTestAssertion-' + assert.expression + '" value="' + assert.expression + '"></div>';

            }
            inHtml += '</div>';

          }*/


          inHtml += '</div>';
          //  inHtml+= '<div class="row"><div class="col-xs-12"><a class="title" id="saveTest" onclick="save()">save</a></div></div>';//save
          inHtml += '</div></div>'; //Panel



          testForm.innerHTML = inHtml;


        } else if (ev.testSuitName) {

          inHtml += '<div class="row"><div class="col-xs-12"><input class="formTestinput" type="text" id="' + elementId + '-formTestSuitName" value="' + ev.testSuitName + '"></div></div>'
            //  inHtml+= '<div class="row"><div class="col-xs-12"><a class="title" id="saveTest" onclick="save()">save</a></div></div>';//save
          inHtml += '</div></div>'; //Panel

          testForm.innerHTML = inHtml;
        } else if (ev.projectName) {
          inHtml += '<div class="row"><div class="col-xs-12"><input class="formTestinput" type="text" id="' + elementId + '-formTestProjectName" value="' + ev.projectName + '"></div></div>'
          inHtml += '</div></div>'; //panel
          testForm.innerHTML = inHtml;



        }
        //registerAction();
        $('.addHeaderElement').click(function(e) {
          addHeader(e);
        });
        $('.deleteHeaderElement').click(function(e) {
          deleteHeader(e);
        });


        $('.addParamElement').click(function(e) {
          addParam(e);
        });
        $('.deleteParamElement').click(function(e) {
          deleteParam(e);
        });


        $('.addAssertElement').click(function(e) {
          addAssert(e);
        });
        $('.deleteAssertElement').click(function(e) {
          deleteAssert(e);
        });
        //registerAction();
        $('.save').click(function(e) {
          save(event);
        });

        testForm.style.display = 'block';
      }

    } else {
      testForm.style.display = 'none';
      save(event);
    }
    e.stopPropagation();

  }

  var minus = function(event) {
    console.log("remove");
    event = event || window.event;
    // console.log(event.target.parentElement.parentElement.getAttribute('data'))
    var ev = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('data'));
    var parent = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('parent'));
    var parentNode = event.target.parentElement.parentElement.parentElement;
    if (parent) {
      var ind = null;

      // need to use id
      for (var i = 0; i < parent.length; i++) {
        ind = i;
        if (ev.testName && parent[i].testName === ev.testName) {
          break;
        } else if (ev.testSuitName && parent[i].testSuitName === ev.testSuitName) {
          break;
        } else if (ev.projectName && parent[i].projectName === ev.projectName) {
          break;
        }
      }
      if (ind != null) {
        parent.splice(ind, 1);
        // parentNode.removeChild(event.target.parentElement.parentElement);
        load(config);
      }

    }
    event.stopPropagation();


  }




  var upload = function(e) {
    var testCases = document.getElementById("testCaseFile");
    // the file is the first element in the files property
    var file = testCases.files[0];

    console.log("File name: " + file.name);
    console.log("File size: " + file.Size);

    var reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function(e) {

      initDash(e.target.result);

    }
    document.getElementById("uploadFile").value = file.name;
  };


  var exportTestCase = function(event) {
    var ev = event || window.event;
    var st = JSON.stringify(config);

    ev.target.href = "data:text/json;charset=UTF-8," + encodeURIComponent(st);
    ev.target.download = "testCases.json";
    return true;
  }
  var exportResult = function(event) {
    event = event || window.event;
    var csvData = '';
    var getTestResult = function(project, testSuit, tests) {
      var _ret = '';
      if (tests) {
        for (var i = 0; i < tests.length; i++) {
          if (i > 0) {
            _ret += '\n';
          }
          _ret += project + ',' + testSuit + ',' + tests[i].testName + ',' + tests[i].url + ',' + tests[i].method + ',' + tests[i].timeout + ',' + (tests[i].endTime ? tests[i].endTime - tests[i].startTime : 'NA') + ',' + tests[i].testStatus
        }
      }
      return _ret;
    }
    var getTestSuitsResult = function(project, testSuits) {
      var _ret = '';
      if (testSuits) {
        for (var i = 0; i < testSuits.length; i++) {
          _ret += getTestResult(project, testSuits[i].testSuitName, testSuits[i].tests)
        }
      }
      return _ret;
    }
    var getheaderResult = function() {

      return 'Project, Test Suit,Test case,URL,Method,Time Out,Response Time, Status \n';
    }



    var ev = jsNavi.startValidation(config, event.target.parentElement.parentElement.getAttribute('data'));
    if (ev.projectName) {
      csvData += getheaderResult();
      csvData += getTestSuitsResult(ev.projectName, ev.testSuits);
    }



    event.target.href = "data:text/csv;charset=UTF-8," + encodeURIComponent(csvData);
    event.target.download = "result.csv";

    return true;

  }

  var load = function(config) {
    //$doc.getElementById("statsView").style.display = "none";
    if (config) {
      var projectNav = $doc.getElementById("projectNav");
      projectNav.innerHTML = null;
      var projects = config.projects;
      var _DIVWRAP = $doc.createElement("DIV");
      _DIVWRAP.class = "tree well";
      if (projects) {
        for (var i = 0; i < projects.length; i++) {
          var _LIpro = getNode(projects[i].projectName, 'project', i);
          _LIpro.setAttribute('data', 'projects[' + i + ']')
          _LIpro.setAttribute('parent', 'projects');
          _LIpro.setAttribute('id', i);
          projects[i].id = i;
          //_LIpro.class = "nav nav - sidebar ";
          //_LIpro.id = projects[i].projectName;
          //_LIpro.innerHTML=projects[i].projectName;

          if (projects[i].testSuits) {
            var _ULtestSuit = $doc.createElement("UL");
            for (var j = 0; j < projects[i].testSuits.length; j++) {
              var _LItestSuit = getNode(projects[i].testSuits[j].testSuitName, 'test suit', i + '' + j);
              _LItestSuit.setAttribute('data', 'projects[' + i + '].testSuits[' + j + ']');
              _LItestSuit.setAttribute('parent', 'projects[' + i + '].testSuits');
              _LItestSuit.setAttribute('id', i + '' + j);
              projects[i].testSuits[j].id = i + '' + j;
              // _LItestSuit.data='projects['+i+'].testSuits['+j+'].testSuitName';
              //_LItestSuit.class = "nav nav-sidebar";
              //_LItestSuit.id = projects[i].testSuits[j].testSuitName;
              //_LItestSuit.innerHTML = projects[i].testSuits[j].testSuitName;
              if (projects[i].testSuits[j].tests) {
                var _ULtest = $doc.createElement("UL");

                for (var k = 0; k < projects[i].testSuits[j].tests.length; k++) {
                  var _LItest = getNode(projects[i].testSuits[j].tests[k].testName, 'test', i + '' + j + '' + k);
                  _LItest.setAttribute('data', 'projects[' + i + '].testSuits[' + j + '].tests[' + k + ']');
                  _LItest.setAttribute('parent', 'projects[' + i + '].testSuits[' + j + '].tests');
                  _LItest.setAttribute('id', i + '' + j + '' + k);
                  projects[i].testSuits[j].tests[k].id = i + '' + j + '' + k;
                  //  _LItest.data='projects['+i+'].testSuits['+j+'].tests['+k+']';
                  //_LItest.id = projects[i].testSuits[j].tests[k].testName;
                  //_LItest.innerHTML = projects[i].testSuits[j].tests[k].testName;
                  _ULtest.appendChild(_LItest);
                }
                _LItestSuit.appendChild(_ULtest);
              }
              _ULtestSuit.appendChild(_LItestSuit);
            }
            _LIpro.appendChild(_ULtestSuit);
          }
          projectNav.appendChild(_LIpro);
        }
      }// if projects
    }// if config

    treenode();

  }

   var treenode =function () {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function(e) {
      var children = $(this).parent('li.parent_li').find(' > ul > li');
      if (children.is(":visible")) {
        children.hide('fast');
        $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
      } else {
        children.show('fast');
        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
      }
      e.stopPropagation();
    });
  };
  var getNode = function(name, type, id) {
    var _li = $doc.createElement("li");
    var testcontroller = $doc.createElement("div");

    testcontroller.className = "testcontroller";
    var titleTest = $doc.createElement("a");
    titleTest.className = "itooltip testName";
    titleTest.innerHTML = name+'<div> <img class="callout" src="callout.gif" /><strong>'+name+'</strong><br /><p class="testDesc"></p></div>';
    titleTest.onclick = edit;

    //  var addtestLi = $doc.createElement("li");
    var copytest = $doc.createElement("a");
    copytest.className = "controls";
    copytest.innerText = "copy";
    copytest.onclick = copy;
    //addtestLi.appendChild(addtest);

    //var deletetestLi = $doc.createElement("li");
    var deletetest = $doc.createElement("a");
    deletetest.className = "controls";
    deletetest.innerText = "Delete";
    deletetest.onclick = minus;
    //deletetestLi.appendChild(deletetest);


    //var playtestLi = $doc.createElement("li");
    var playtest = $doc.createElement("a");
    playtest.className = "controls";
    playtest.innerText = "Play";
    playtest.onclick = play;
    //playtestLi.appendChild(playtest);


    //Nav
    //var testNav = $doc.createElement("nav");
    //var testPager = $doc.createElement("ul");
    //  testNav.className ="pager" ;
    //  testNav.appendChild(copytest);
    //  testNav.appendChild(deletetest);
    //  testNav.appendChild(playtest);
    //  testNav.appendChild(testPager);



    testcontroller.appendChild(titleTest);
    //  testcontroller.appendChild(testNav);
    testcontroller.appendChild(copytest);
    //testcontroller.appendChild(copytest);
    testcontroller.appendChild(deletetest);
    testcontroller.appendChild(playtest);








    var _tmp = '<span><i class="icon-leaf">' + type + '</i></span>';
    if ('project' === type) {
      //  var exporttestLi = $doc.createElement("li");
      var exporttest = $doc.createElement("a");
      exporttest.className = "controls";
      exporttest.innerText = "Export Result";
      exporttest.onclick = exportResult;
      //  playtestLi.appendChild(exporttest);
      testcontroller.appendChild(exporttest);

    }
    var testForm = $doc.createElement("div");
    testForm.className = "testform";
    testForm.style.display = 'none'
    testForm.id = 'testform' + id;

    testForm.innerText = '';

    testcontroller.appendChild(testForm);
    //'+'<div class="testcontroller"><a href="#" id="addTest" class="glyphicon glyphicon-plus">+</a><a href="#" id="deleteTest"  class="glyphicon glyphicon-minus">-</a><a href="#" id="playTest"  class="glyphicon glyphicon-play">>></a></div>'
    _li.innerHTML = _tmp;
    _li.appendChild(testcontroller);
    return _li;
  }


  var showStats = function(e) {
    console.log("showStats==" + e.getName());
    var stats = e.getData().stats;
    var testId = e.getData().testId;
    var status = e.getData().testStatus;
    var errorMessage =  e.getData().errorMessage;
    $doc.getElementById("stats.pro.total").innerHTML = stats.project.total;
    $doc.getElementById("stats.pro.fail").innerHTML = stats.project.fail;
    $doc.getElementById("stats.testSuit.total").innerHTML = stats.testSuit.total;
    $doc.getElementById("stats.testSuit.fail").innerHTML = stats.testSuit.fail;
    $doc.getElementById("stats.testCase.total").innerHTML = stats.testcase.total;
    $doc.getElementById("stats.testCase.fail").innerHTML = stats.testcase.fail;
    $doc.getElementById("stats.asserts.total").innerHTML = stats.asserts.total;
    $doc.getElementById("stats.asserts.fail").innerHTML = stats.asserts.fail;
    //  $doc.getElementById("statsView").style.display = "block";

    // update the test case labels:

    if(testId && status ){
      $('#'+testId).find('.testName').removeClass('testFail');
      $('#'+testId).find('.testName').removeClass('testPass');
      $('#'+testId).find('.testName').removeClass('testInprogress');
      if(status==_TEST_STATUS_INPROGRESS){
        $('#'+testId).find('.testName').addClass('testInprogress');
        $('#'+testId).find('.testDesc').text("test in progress ...");


      }else if (status==_TEST_STATUS_PASS){
        $('#'+testId).find('.testName').addClass('testPass');
        $('#'+testId).find('.testDesc').text("test is a success :)");
      }else{
        $('#'+testId).find('.testName').addClass('testFail');
        $('#'+testId).find('.testDesc').text("test is a failure :( , "+errorMessage);
      }


    }


  }
  eventBus.register('EVENT_STATS', showStats);


  load(config);


  var registerAction = function() {
    $("#testCaseFile").unbind("change");
    $("#exportTestCase").unbind("click");

    $('#testCaseFile').change(upload);
    $("#exportTestCase").click(exportTestCase);

  }
  registerAction();
  return {
    "showStats": showStats
  }

}
