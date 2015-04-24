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
          "req_headers": [
            {"name":"vi"},{"hello":"ok"}
          ],
          "req_params":[{
            "one": "1111"
            },
            {"1": 11
            }
          ],
          "res_assertions": [{
            "assertName": "assert1",
            "assertType":"response",
            "expression": "projects.list[0].one=false"
          },{
            "assertName": "assert2",
            "assertType":"header",
            "expression": "projects.kit=kat"
          },{
            "assertName": "assert3",
            "assertType":"response",
            "expression": "projects.list[1].ii=1234"
          }]
        }]
      }]
      }]
    }
