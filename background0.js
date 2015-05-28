chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 1162;
  var height = 720;
  chrome.app.window.create('index3.html', {
    'outerBounds': {
      width: width,
       height: height,
       left: Math.round((screenWidth-width)/2),
       top: Math.round((screenHeight-height)/2)

    }
  });
  //chrome.windows.getCurrent(object getInfo, function callback)


});
