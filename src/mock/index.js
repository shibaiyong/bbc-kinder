import Mock from 'mockjs'

export default {
  mockData() {
    //get 查询列表
    Mock.mock(/\/api\/v2\/attendance\/station/, 'get', {
      "msg": "请求成功",
      "code": 200,
      "data":
      {
        "attendance|30": [
          {
            "id|1-10": 1,  
            "teacherName|2-5": "教师",
            "status|1-5": 1,
          }
        ]
      }
    })

    Mock.mock(/\/api\/v2\/attendance\/month/, 'get', {
      "msg": "请求成功",
      "code": 200,
      "data":
      {
        "attendance|35": [
          {
            "id|1-30": 1,  
            "teacherName|2-3": "教师",
            "work|1-22": 1,
            "sleep|1-22": 1,
            "realWork|1-22": 1,
            "absence|1-22": 1,
            "sick|1-5": 1,
            "leaveabsence|1-22": 1,
          }
        ]
      }
    })

    Mock.mock(/\/api\/v2\/attendance\/detail/, 'get', {
      "msg": "请求成功",
      "code": 200,
      "data":
      {
        "attendance|5": [
          {
            "id|1-30": 1,  
            "teacherName|1": [
              '吴智勇',
              '张玉飞',
              '朱飞跃'
            ],
            "attendanceList": [
              {
                "date": 1,
                "status|1-6": 1,
                "day": '五'
              },
              {
                "date": 2,
                "status|1-6": 1,
                "day": '六'
              },
              {
                "date": 3,
                "status|1-6": 1,
                "day": '日'
              },
              {
                "date": 4,
                "status|1-6": 1,
                "day": '一'
              },
              {
                "date": 5,
                "status|1-6": 1,
                "day": '二'
              },
              {
                "date": 6,
                "status|1-6": 1,
                "day": '三'
              },{
                "date": 7,
                "status|1-6": 1,
                "day": '四'
              },
              {
                "date": 8,
                "status|1-6": 1,
                "day": '五'
              },
              {
                "date": 9,
                "status|1-6": 1
              },
              {
                "date": 10,
                "status|1-6": 1
              },
              {
                "date": 11,
                "status|1-6": 1
              },
              {
                "date": 12,
                "status|1-6": 1
              },
              {
                "date": 13,
                "status|1-6": 1
              },
              {
                "date": 14,
                "status|1-6": 1
              },
              {
                "date": 15,
                "status|1-6": 1
              },
              {
                "date": 16,
                "status|1-6": 1
              },
              {
                "date": 17,
                "status|1-6": 1
              },
              {
                "date": 18,
                "status|1-6": 1
              },
              {
                "date": 19,
                "status|1-6": 1
              },
              {
                "date": 20,
                "status|1-6": 1
              },
              {
                "date": 21,
                "status|1-6": 1
              },
              {
                "date": 22,
                "status|1-6": 1
              },
              {
                "date": 23,
                "status|1-6": 1
              },
              {
                "date": 24,
                "status|1-6": 1
              },
              {
                "date": 25,
                "status|1-6": 1
              },
              {
                "date": 26,
                "status|1-6": 1
              },
              {
                "date": 27,
                "status|1-6": 1
              },
              {
                "date": 28,
                "status|1-6": 1
              },
              {
                "date": 29,
                "status|1-6": 1
              },
              {
                "date": 30,
                "status|1-6": 1
              },
              {
                "date": 31,
                "status|1-6": 1
              }
            ]
          }
        ]
      }
    })
  }
}