var defaultStruct = {
  "projects": [{
      "projectName": "default project",
      "projectDesc": "this is a first test 1 project",
      "baseUrl":"http://localhost:8000/",
      "testSuits": [{
        "testSuitName": "default  test suit",
        "tests": [{
          "testName": "default test case",
          "url": "http://localhost:8000/data",
          "method": "get",
          "timeout": 5000,
          "req_headers": {
            "name": "hey",
            "hello": "ok"
          },
          "req_params": {
            "one": "1111",
            "1": 11
          },
          "res_assertions": [{
            "assertName": "assert1",
            "expBody": "projects.list[0].one=false"
          },{
            "assertName": "assert2",
            "expBody": "projects.kit=kat"
          },{
            "assertName": "assert3",
            "expBody": "projects.list[1].ii=1234"
          }]
        },{
          "testName": "default test case 2",
          "url": "http://localhost:8000/data",
          "method": "get",
          "timeout": 3000,
          "req_headers": {
            "head": "=projects[0].testSuits[0].tests[0].res_headers.head",
            "tail": "=projects[0].testSuits[0].tests[0].res_headers.tail"
          },
          "req_params": {
            "two": "222",
            "2": 22
          },
          "res_assertions": [{
            "assertName": "assert1",
            "expBody": "projects.list[0].one=false"
          },{
            "assertName": "assert2",
            "expBody": "projects.kit=kat"
          },{
            "assertName": "assert3",
            "expBody": "projects.list[1].ii=1234"
          },{
            "assertName": "assert4",
            "expHeader": "Connection=keep-alive"
          }]
        }]
      }]
      }]
    }
