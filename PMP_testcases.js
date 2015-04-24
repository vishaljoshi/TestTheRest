{
  "projects": [
    {
      "projectName": "PMP",
      "projectDesc": "Power Monitoring Portal",
      "testSuits": [
        {
          "testSuitName": "power report -by customer",
          "tests": [
            {
              "testName": "Customer List-APAC",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/customersByRegionAndIbx/APAC/NA/false",
              "method": "get",
              "timeout": "10000",
              "res_assertions": [
                {
                  "assertName": " There are no errors",
                  "assertType": "response",
                  "expression": "errorList=0",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "status is true",
                  "assertType": "response",
                  "expression": "success=true",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "Customer is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerName=LIQUIDNET ASIA LIMITED",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "ucmid is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].ucmid=1000001527",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "customer number is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerNumber=116853",
                  "assertStatus": "pass"
                }
              ],
              "req_headers": [
                {
                  "EMAIL": "vjoshi@ap.equinix.com"
                },
                {
                  "FIRSTNAME": "Vishal"
                },
                {
                  "LASTNAME": "Joshi"
                }
              ],
              "req_params": []
            },
            {
              "testName": "power report service",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/powerReport/byLevel",
              "method": "get",
              "timeout": "10000",
              "res_assertions": [
                {
                  "assertName": "status is true",
                  "assertType": "response",
                  "expression": "errorType=0"
                },
                {
                  "assertName": "Customer is valid",
                  "assertType": "response",
                  "expression": "ibxs[0].ucmid=1000001527"
                }
              ],
              "req_headers": [
                {
                  "EMAIL": "vjoshi@ap.equinix.com"
                },
                {
                  "FIRSTNAME": "Vishal"
                },
                {
                  "LASTNAME": "Joshi"
                }
              ],
              "req_params": []
            }
          ]
        }
      ]
    }
  ]
}