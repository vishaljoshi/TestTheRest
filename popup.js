// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */



document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("loadTestTheRest").onclick = loadTestTheRest;
  document.getElementById("startRecord").onclick = startStopRecord;
  document.getElementById("save").onclick = saveData;
  chrome.runtime.getBackgroundPage(function(bgPage) {
    var className = document.getElementById("startRecord").className;
    if (bgPage.recorderSettings.isStarted) {
      document.getElementById("startRecord").className = className.trim() + ' startRecording';
    }
  });

});


function loadTestTheRest() {
  chrome.runtime.getBackgroundPage(function(bgPage) {
    console.log("bgPage.recorderSettings.isStarted"+bgPage.recorderSettings.isStarted);
    bgPage.requestDetails;
    var config =bgPage.importer();
    console.log();
    var b = chrome.extension.getURL("") + "index3.html";
    chrome.tabs.create({
      url: b
    }), window.close()

  });
}

function saveData(event) {
  var ev = event || window.event;
  chrome.runtime.getBackgroundPage(function(bgPage) {
    if(response.recorder.requestDetails){
      var st = JSON.stringify(response.recorder.requestDetails);
      ev.target.href = "data:text/json;charset=UTF-8," + encodeURIComponent(st);
      ev.target.download = "testCases.json";
    }
  });




  return true;
}

function startStopRecord(event) {

  chrome.runtime.getBackgroundPage(function(bgPage) {
    var className = document.getElementById("startRecord").className;
    if (bgPage.recorderSettings.isStarted) {
      className = className.substring(0,className.indexOf("startRecording"))
      document.getElementById("startRecord").className=className.trim();
      //alert(bgPage.requestDetails);

      stopRecording(event);

      event.stopPropagation();

    } else {
      document.getElementById("startRecord").className = className.trim() + ' startRecording';
      getCurrentTabUrl(function(url) {
        //https://developer.chrome.com/extensions/match_patterns
        console.log("url===" + url);
        url = url.substring(url.indexOf('//') + 2, url.length);
        url = url.substring(0, url.indexOf('/') + 1);
        console.log("t===" + url);
        //url="www.google.com.sg/";
        startRecording(url);
        //onRecord(url)
        event.stopPropagation();
      });
    }
  });
}

var startRecording = function(url) {
  chrome.runtime.sendMessage({
    'recorder': {
      'status': 'start',
      'url': url
    }
  }, function(response) {
    console.log('startRecording=' + response.recorder.status);
  });
}
var stopRecording = function(event) {
  var e = event || window.event;

  chrome.runtime.sendMessage({
    'recorder': {
      'status': 'stop'
    }
  }, function(response) {
    console.log('stopRecording' + response.recorder.status);
    var res = response.recorder.requestDetails;


  //  var st = JSON.stringify(res);
  //  console.log('st=' + st)
  //  e.target.href = "data:text/json;charset=UTF-8," + encodeURIComponent(st);
  //  e.target.download = "data.json";

  //  return true;

  });

}
