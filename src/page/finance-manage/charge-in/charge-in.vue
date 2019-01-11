/** 
 * @Desc: 收费
 */
<template>
  <content-box :whiteInner="false">
    <!-- 主要内容 -->
    <!-- <Button @click.native="al">
      <v-icon size="14" type="icon-add" style="margin-right:4px;"/>新增
    </Button> -->
    <div class="charge-in">
      <div class="fill-height">
        <div class="left-control fill">
          <div v-show="!addPageFlag">
            <!-- 顶部 title -->
            <Button 
              size="small"
              style="margin:12px 0 0 28px;padding: 0 10px"
              @click="listDialogFlag = true;addOrUpdataBtnFlag=false">
              <v-icon size="14" type="icon-add" style="margin-right:4px;"/>新增
            </Button>
            <!-- 联动 linkage -->
            <div class="linkage">
              <div class="class-select">
                <span class="select-txt">班级</span>
                
                <!-- <el-select  class="input-com" v-model="classDataList.classId" placeholder="请选择">
                  <el-option
                    v-for="item in classDataList"
                    :key="item.classId"
                    :label="item.classLabel"
                    :value="item.classId">
                  </el-option>
                </el-select> -->
                <!-- <input class="input-com" type="text"> -->
              </div>
              <div class="class-select">
                <span class="select-txt">姓名</span>
                </el-select>
                <el-input class="input-com" v-model="inputStudentName" placeholder="请输入学生姓名"></el-input>
                <!-- <input class="input-com" type="text"> -->
              </div>
              <div class="class-select">
                <span class="select-txt">状态</span>
                
              </div>
              <div class="class-select">
                <div class="block">
                  <span class="demonstration select-txt">开单时间</span>
                  <el-date-picker
                    v-model="value7"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2" class="input-com" >
                  </el-date-picker>
                </div>
              </div>
              <div class="class-select">
                <Button 
                  type="ghost"
                  size="small"
                  style="margin-right:5px;padding: 0 10px">
                  查询
                </Button>
                <Button 
                  type="ghost"
                  size="small"
                  style="margin-right:5px;padding: 0 10px;border: 1px solid #F84B62;color: #F84B62;"
                  class="input-reset">
                  重置
                </Button>
                <Button 
                  type="ghost"
                  size="small"
                  style="margin-right:5px;padding: 0 10px">
                  <v-icon size="14" type="icon-upload" style="margin-right:4px;"/>导出
                </Button>
              </div>
            </div>

            <!-- 表单区域 -->
            <div class="table">
              <div class="table-title line-item">
                <div v-for="(item, index) in titleData" :class="item.class" class="item">{{item.value}}</div>
              </div>
              <div class="table-body">
                <div v-for="(data, index) in bodyData" class="line-item">
                  <div v-for="(item, j) in data" :class="item.class" class="item">
                    <span v-show="item.value!='未支付'">{{item.value}}</span>
                    <div v-show="item.value=='未支付'">
                      <span style="color: #F84B62" v-show="item.value=='未支付'">{{item.value}}</span>
                    </div>
                    <div v-show="item.class=='operation'">
                      <span style="color: #269856" v-show="item.value1" @click="commitPay(index,j)">{{item.value1}}</span>
                      <span style="color: #FF9902" @click="addOrUpdataBtnFlag=true;listDialogFlag = true;" v-show="item.value2">{{item.value2}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-show="addPageFlag">
            <!-- 联动 linkage -->
            <div class="linkage">
              <div class="add-student-info"><span></span>{{addOrUpdataBtnFlag?'修改学生钟一':'新增学生钟一'}}</div>
              <div class="class-select">
                <span class="select-txt">姓名</span>
                </el-select>
                <el-input class="input-com" v-model="addInputStudentName" placeholder="请输入学生姓名"></el-input>
                <!-- <input class="input-com" type="text"> -->
              </div>
              <div class="class-select">
                <span class="select-txt">收费方案</span>
                <el-select  class="input-com" v-model="addInputFeeFangan.addInputFeeFanganId" placeholder="请选择" value="">
                  <el-option
                    v-for="item in addInputFeeFangan"
                    :key="item.addInputFeeFanganId"
                    :label="item.addInputFeeFanganLabel"
                    :value="item.addInputFeeFanganId">
                  </el-option>
                </el-select>
                <!-- <input class="input-com" type="text"> -->
              </div>
              
              <div class="class-select">
                <span class="select-txt">收费方式</span>
                <el-select  class="input-com" v-model="addInputFeeType.addInputFeeTypeId" placeholder="请选择" value="">
                  <el-option
                    v-for="item in addInputFeeType"
                    :key="item.addInputFeeTypeId"
                    :label="item.addInputFeeTypeLabel"
                    :value="item.addInputFeeTypeId">
                  </el-option>
                </el-select>
              </div>
              <div class="class-select">
                <span class="select-txt">收费时长</span>
                <el-select  class="input-com" v-model="addInputFeeLong.addInputFeeLongId" placeholder="请选择">
                  <el-option
                    v-for="item in addInputFeeLong"
                    :key="item.addInputFeeLongId"
                    :label="item.addInputFeeLongLabel"
                    :value="item.addInputFeeLongId">
                  </el-option>
                </el-select>
              </div>
              <div class="class-select">
                <div class="block">
                  <span class="demonstration select-txt">收费有效期</span>
                  <el-date-picker
                    v-model="value7"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2" class="input-com" >
                  </el-date-picker>
                </div>
              </div>
            </div>

            <!-- 表单区域 -->
            <div class="table">
              <div class="table-title line-item">
                <div v-for="(item, index) in addStudentInfoTitleData" :class="item.class" class="item" style="width:16.66%;">{{item.value}}</div>
              </div>
              <div class="table-body">
                <div v-for="(data, index) in addStudentInfoBodyData" class="line-item">
                  <div v-for="(item, j) in data" :class="item.class" class="item"  style="width:16.66%;">
                    <span v-show="item.value==false" style="width: 100%;height: 40px;">&nbsp;</span>
                    <span v-show="item.value!='未支付'&&j!=2">{{item.value}}</span>
                    <!-- 数量可以输入 -->
                    <input type=number v-show="j==2" :value='item.value' style="text-align:center;border: 1px solid #99601C;height:28px;width:60px;border-radius: 8px;" />
                    <div v-show="item.value=='未支付'">
                      <span style="color: #F84B62" v-show="item.value=='未支付'">{{item.value}}</span>
                    </div>
                    <div v-show="item.class=='operation'">
                      <span style="color: #269856" v-show="item.value1" @click="commitPay(index,j)">{{item.value1}}</span>
                      <span style="color: #FF9902" v-show="item.value2"  @click="modify(data)">{{item.value2}}</span>
                      <span style="color: #5494EA" v-show="item.value3">{{item.value3}}</span>
                      <span style="color: #F84B62" @click="deleteListItem(index)" v-show="item.value4">{{item.value4}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="add-student-info-btn">
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px;border: 1px solid #F84B62;color: #F84B62;"
                class="input-reset">
                打印
              </Button>
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px;color:#fff;background:#269856;"
                 @click="addStudentInfoSaveDialog()">
                保存
              </Button>
              <Button 
                type="ghost"
                size="small"
                style="padding: 0 10px;border: 1px solid #F84B62;color:#fff;background:#F84B62;"
                 @click="addStudentInfoCloseDialog()">
                取消
              </Button>
            </div>
          </div>
        <div class="list-dialog">

          <el-dialog
            title="选择学生"
            :visible.sync="listDialogFlag">
            <div class="dialog-main">
              <div class="class-select">
                <span class="select-txt">年级</span>
                <el-select  class="input-com" v-model="gradeDataList.gradeId" placeholder="请选择">
                  <el-option
                    v-for="item in gradeDataList"
                    :key="item.gradeId"
                    :label="item.gradeLabel"
                    :value="item.gradeId">
                  </el-option>
                </el-select>
              </div>
              <div class="class-select">
                <span class="select-txt">班级</span>
                <el-select  class="input-com" v-model="classAddDataList.classAddId" placeholder="请选择">
                  <el-option
                    v-for="item in classAddDataList"
                    :key="item.classAddId"
                    :label="item.classAddLabel"
                    :value="item.classAddId">
                  </el-option>
                </el-select>
              </div>
              <div class="class-select">
                <span class="select-txt">姓名</span>
                <el-input class="input-com" v-model="inputSelectStudentName" placeholder="请输入学生姓名"></el-input>
              </div>
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px">
                查询
              </Button>
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px;border: 1px solid #F84B62;color: #F84B62;"
                class="input-reset">
                重置
              </Button>
            </div>
            <!-- 表单区域 -->
            <div class="table">
              <div class="table-title line-item">
                <div v-for="(item, index) in addDialogTitleData" :class="item.class" class="item">{{item.value}}</div>
              </div>
              <div class="table-body">
                <div v-for="(data, index) in addDialogBodyData" class="line-item" @click="addDialogItemIN()">
                  <div v-for="(item, j) in data" :class="item.class" class="item">
                    <span v-show="item.value!='未支付'">{{item.value}}</span>
                    <div v-show="item.value=='未支付'">
                      <span style="color: #F84B62" v-show="item.value=='未支付'">{{item.value}}</span>
                    </div>
                    <div v-show="item.class=='operation'">
                      <span style="color: #269856" v-show="item.value1">{{item.value1}}</span>
                      <span style="color: #FF9902" v-show="item.value2">{{item.value2}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>

        </div>
        </div>
      </div>
      
    </div>


  </content-box>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil , getCurrentDate, localStorageUtil} from 'lib/util'
  // 组件
  import TypeVue from 'component/type'
  import TimeVue from 'component/time'
  import Searchbar from 'component/searchbar'
  import FileList from 'component/file-list'

  //import Button from 'component/button/button'
  // 接口
  import { requestGetTypeList, requestGetDocumentList, _handleFile, _download } from 'api/document-module'
  export default {
    name: 'charge-in',
    components: {
      TypeVue,
      TimeVue,
      Searchbar,
      FileList,
      Select,
      //Button
    },
    
    data: function() {
      return {
        addInputStudentName:'钟一', 	//新增学生信息 姓名
        addInputFeeTypeIn:'', 	//新增学生信息 收费方案
        addInputFeeFangan:[   	//新增学生信息 [] 
	        {
            addInputFeeFanganId: 'class1',
            addInputFeeFanganLabel: '托班（普通班）'
          }, {
            addInputFeeFanganId: 'class2',
            addInputFeeFanganLabel: '托班（国际班）'
          }, {
            addInputFeeFanganId: 'class3',
            addInputFeeFanganLabel: '小班（普通班）'
          }, {
            addInputFeeFanganId: 'class4',
            addInputFeeFanganLabel: '小班（国际班）'
          }, {
            addInputFeeFanganId: 'class5',
            addInputFeeFanganLabel: '艺术班'
          }, {
            addInputFeeFanganId: 'class6',
            addInputFeeFanganLabel: '特长生'
          }
        ],

        addInputFeeTypeIn:'', 	//新增学生信息 收费方式
        addInputFeeType:[
          {
            addInputFeeTypeId: 'class1',
            addInputFeeTypeLabel: '微信'
          }, {
            addInputFeeTypeId: 'class2',
            addInputFeeTypeLabel: '支付宝'
          }, {
            addInputFeeTypeId: 'class3',
            addInputFeeTypeLabel: '银联'
          }, {
            addInputFeeTypeId: 'class4',
            addInputFeeTypeLabel: '现金'
          }, {
            addInputFeeTypeId: 'class5',
            addInputFeeTypeLabel: '其他'
          }
        ], 	//新增学生信息

        addInputFeeLongIn: '', 	//新增学生信息 收费时长
        addInputFeeLong:[
          {
            addInputFeeLongId: 'class1',
            addInputFeeLongLabel: '学年'
          }, {
            addInputFeeLongId: 'class2',
            addInputFeeLongLabel: '学期'
          }, {
            addInputFeeLongId: 'class3',
            addInputFeeLongLabel: '月期'
          }, {
            addInputFeeLongId: 'class4',
            addInputFeeLongLabel: '日期'
          }
        ], 	//新增学生信息

        addStudentInfoTitleData: [
          {
            class: 'billing-num',
            value: '收费项目'
          }, {
            class: 'student',
            value: '单价'
          }, {
            class: 'class',
            value: '数量'
          },{
            class: 'money',
            value: '金额'
          },{
            class: 'billing-data',
            value: '项目说明'
          },{
            class: 'operation',
            value: '操作'
          }
        ], 	//新增学生信息
        addStudentInfoBodyData: [
          [{
            class: 'billing-num',
            value: '保教费'
          }, {
            class: 'student',
            value: '3000'
          }, {
            class: 'class',
            value: '1'
          },{
            class: 'money',
            value: '3000'
          },{
            class: 'billing-data',
            value: ' '
          },{
            class: 'operation',
            value4: '移除'
          }],[{
            class: 'billing-num',
            value: '餐饮费'
          }, {
            class: 'student',
            value: '1200'
          }, {
            class: 'class',
            value: '1'
          },{
            class: 'money',
            value: '1200'
          },{
            class: 'billing-data',
            value: ' '
          },{
            class: 'operation',
            value4: '移除'
          }],[{
            class: 'billing-num',
            value: '管理费'
          }, {
            class: 'student',
            value: '2400'
          }, {
            class: 'class',
            value: '1'
          },{
            class: 'money',
            value: '2400'
          },{
            class: 'billing-data',
            value: ' '
          },{
            class: 'operation',
            value4: '移除'
          }],
        ], 	//新增学生信息

        inputStudentName: '',  // 页面输入框 学生姓名
        inputSelectStudentName: '',  // 选择学生 学生姓名
        addPageFlag: false,  // 是否 打开新增页面
        listDialogFlag: false,  // 列表弹框
        addOrUpdataBtnFlag: false,  // 新增还是修改 btn 新增
        dialogVisible: false,  // 列表弹框
        classDataList: [
	        {
            classId: 'class1',
            classLabel: '托班一班'
          }, {
            classId: 'class2',
            classLabel: '托班二班'
          }, {
            classId: 'class3',
            classLabel: '小班一班'
          }, {
            classId: 'class4',
            classLabel: '小班二班'
          }, {
            classId: 'class5',
            classLabel: '中班一班'
          }, {
            classId: 'class6',
            classLabel: '中班二班'
          }, {
            classId: 'class7',
            classLabel: '中班三班'
          }, {
            classId: 'class8',
            classLabel: '大班一班'
          }
        ],
        classAddDataList: [
	        {
            classAddId: 'class1',
            classAddLabel: '托班一班'
          }, {
            classAddId: 'class2',
            classAddLabel: '托班二班'
          }, {
            classAddId: 'class3',
            classAddLabel: '小班一班'
          }, {
            classAddId: 'class4',
            classAddLabel: '小班二班'
          }, {
            classAddId: 'class5',
            classAddLabel: '中班一班'
          }, {
            classAddId: 'class6',
            classAddLabel: '中班二班'
          }, {
            classAddId: 'class7',
            classAddLabel: '中班三班'
          }, {
            classAddId: 'class8',
            classAddLabel: '大班一班'
          }
        ],
        gradeDataList: [
          {
            gradeId: 'grade1',
            gradeLabel: '托班'
          }, {
            gradeId: 'grade2',
            gradeLabel: '小班'
          }, {
            gradeId: 'grade3',
            gradeLabel: '中班'
          }, {
            gradeId: 'grade4',
            gradeLabel: '大班'
          }
        ],
        statusDataList: [
          {
            statusId: 'status1',
            statusLabel: '有效'
          }, {
            statusId: 'status2',
            statusLabel: '无效'
          }
        ],
        titleData: [{
          class: 'billing-num',
          value: '单据编号'
        }, {
          class: 'student',
          value: '姓名'
        }, {
          class: 'class',
          value: '班级'
        }, {
          class: 'charge-status',
          value: '收费方式'
        },  {
          class: 'billing-data',
          value: '开单日期'
        }, {
          class: 'money',
          value: '金额'
        }, {
          class: 'status',
          value: '状态'
        },{
          class: 'operation',
          value: '操作'
        }],
        bodyData: [
          [
            {
                "class": "billing-num",
                "value": "11251044505"
            },
            {
                "class": "student",
                "value": "张托托"
            },
            {
                "class": "class",
                "value": "托班二班"
            },
            {
                "class": "charge-status",
                "value": "微信"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 4500
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11251262114"
            },
            {
                "class": "student",
                "value": "钟一"
            },
            {
                "class": "class",
                "value": "小班一班"
            },{
                "class": "charge-status",
                "value": "支付宝"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 5000
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11253872600"
            },
            {
                "class": "student",
                "value": "王中中1"
            },
            {
                "class": "class",
                "value": "中班一班"
            },{
                "class": "charge-status",
                "value": "微信"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 5600
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11257276495"
            },
            {
                "class": "student",
                "value": "陈大大"
            },
            {
                "class": "class",
                "value": "大班一班"
            },{
                "class": "charge-status",
                "value": "微信"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 6400
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11255088171"
            },
            {
                "class": "student",
                "value": "豆包"
            },
            {
                "class": "class",
                "value": "托班一班"
            },{
                "class": "charge-status",
                "value": "支付宝"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 4500
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11258150719"
            },
            {
                "class": "student",
                "value": "帅帅"
            },
            {
                "class": "class",
                "value": "托班一班"
            },{
                "class": "charge-status",
                "value": "支付宝"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 4500
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11255770694"
            },
            {
                "class": "student",
                "value": "宁宁"
            },
            {
                "class": "class",
                "value": "托班一班"
            },
            {
                "class": "charge-status",
                "value": "支付宝"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 4500
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11259841356"
            },
            {
                "class": "student",
                "value": "小勇"
            },
            {
                "class": "class",
                "value": "小班一班"
            },{
                "class": "charge-status",
                "value": "微信"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 5000
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
        ],
        [
            {
                "class": "billing-num",
                "value": "11256819216"
            },
            {
                "class": "student",
                "value": "乐乐"
            },
            {
                "class": "class",
                "value": "小班一班"
            },{
                "class": "charge-status",
                "value": "支付宝"
            },
            {
                "class": "billing-data",
                "value": "2018-11-25"
            },
            {
                "class": "money",
                "value": 5000
            },
            {
                "class": "status",
                "value": "有效"
            },{
              class: 'operation',
              value2: '修改'
            }
          ]
        ],
        addDialogTitleData: [{
          class: 'student',
          value: '姓名'
        },{
          class: 'sex',
          value: '性别'
        },{
          class: 'class',
          value: '班级'
        }],
        addDialogBodyData: [
	[{
          class: 'student',
          value: '钟一'
        },{
          class: 'sex',
          value: '男'
        },{
          class: 'class',
          value: '大班二班'
        }],
	[{
          class: 'student',
          value: '唐糖'
        },{
          class: 'sex',
          value: '女'
        },{
          class: 'class',
          value: '中班二班'
        }],
	[{
          class: 'student',
          value: '陈诺'
        },{
          class: 'sex',
          value: '男'
        },{
          class: 'class',
          value: '小班二班'
        }],
	[{
          class: 'student',
          value: '李晓霞'
        },{
          class: 'sex',
          value: '女'
        },{
          class: 'class',
          value: '小班-班'
        }],
	[{
          class: 'student',
          value: '朱一一'
        },{
          class: 'sex',
          value: '男'
        },{
          class: 'class',
          value: '托班-班'
        }],
	[{
          class: 'student',
          value: '徐志锐'
        },{
          class: 'sex',
          value: '男'
        },{
          class: 'class',
          value: '托班-班'
        }],
	[{
          class: 'student',
          value: '毛毛'
        },{
          class: 'sex',
          value: '女'
        },{
          class: 'class',
          value: '托班-班'
        }],
	[{
          class: 'student',
          value: '张小花'
        },{
          class: 'sex',
          value: '女'
        },{
          class: 'class',
          value: '中班一班'
        }],
          [{
          class: 'student',
          value: '张小朵'
        },{
          class: 'sex',
          value: '女'
        },{
          class: 'class',
          value: '中班一班'
        }],
          [{
          class: 'student',
          value: '陈巍巍'
        }, {
          class: 'sex',
          value: '男'
        },{
          class: 'class',
          value: '大班一班'
        }]
        ],
        value: '',// 以上是选择下拉
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: '',
        value7: '', // 以上是日期下拉
        
      }
    },
    watch: {
      /**
       * 监视选中文件列表数据
       * @param  {array} newValue：新值
       */
      selectFileList: function(newValue) {
        // 全选和非全选
        if (this.fileList.length !== 0) {
          this.checkAll = newValue.length === this.fileList.length ? true : false
        }
        // 根据选择的文件的个数，在表格中显示选中文件的个数和按钮的显示
        if (newValue.length !== 0) {
          this.showOtherItemFlag = false
          this.showCountFlag = true
          this.countNum = newValue.length
          // 判断当前点击项
          let name = this.typeName
          switch (name) {
            // 文档
            case 'document':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              this.buttonVisible.copy = true
              this.buttonVisible.move = true
              break
            // 草稿箱
            case 'draft':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              break
            // 回收站 
            case 'recycle':
              this._resetBtnVisible()
              this.buttonVisible.reply = true
              this.buttonVisible.smash = true
              break
            // 时间 
            case 'time':
              this._resetBtnVisible()
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              break  
          }
          // 如果只有一个被选中,打印按钮消失
          if (newValue.length !== 1) {
            this.buttonVisible.print = false
          }
        }
        // 没有选中文件 
        else {
          this.showOtherItemFlag = true
          this.showCountFlag = false
          this.countNum = 0
          //  根据选中的文件类型显示不同的按钮组
          let name = this.typeName
          switch (name) {
            // 文档
            case 'document':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              break
            // 草稿箱
            case 'draft':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              break
            // 回收站 
            case 'recycle':
              this._resetBtnVisible()
              break
            case 'time':
              this._resetBtnVisible()
              break  
          }
        }
      }
    },
    beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
      clearTimeout(this.timeOut)
      next()
    },
    mounted: function() {
      // this._requestGetTypeData()
      // this._watchLocal()
    },
    methods: {
      /** 
       * 弹框 删除数据
      */
     al(){
alert(1)
     },
      deleteListItem(index) {
        // 获取数组
        var arr = this.addStudentInfoBodyData;
        console.log(arr)
        if (index > -1) {
          arr.splice(index, 1);
        }
        console.log(arr)

        this.addStudentInfoBodyData = arr;
      },
      /** 
       * 学生信息  保存按钮
      */
      addStudentInfoSaveDialog() {
        this.addPageFlag = false;
      },
      /** 
       * 学生信息  取消按钮
      */
      addStudentInfoCloseDialog() {
        this.addPageFlag = false;
      },
      /** 
       * input 重置
      */
      addDialogItemIN() {
        this.listDialogFlag = false;
        this.addPageFlag = true;
      },
      /** 
       * input 重置
      */
      restInput(index,j) {
        var list = this.bodyData[index];
        console.log(list[j-1])
        if(index%3){
          this.bodyData[index][j-1].value = '已支付(支付宝)'
        }else if(index>3&&index%2){
          this.bodyData[index][j-1].value = '已支付(微信)'
        }else {
          this.bodyData[index][j-1].value = '已支付(现金)'
        }
      },
      /** 
       * 列表 确认支付
      */
      commitPay(index,j) {
        var list = this.bodyData[index];
        console.log(list[j-1])
        if(index%3){
          this.bodyData[index][j-1].value = '已支付(支付宝)'
        }else if(index>3&&index%2){
          this.bodyData[index][j-1].value = '已支付(微信)'
        }else {
          this.bodyData[index][j-1].value = '已支付(现金)'
        }
      },
      /** 
       * 列表弹框的处理
      */
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      /** 
       * 监视数据 
      */
      _watchLocal: function() {
        this.timeOut = setInterval(this.localData, 5000)
      },

      /** 
       * 获取存储的数据
      */
      localData: function() {
        let value = localStorageUtil.get('fileChange')
        value && this.afrashTypeData()
        localStorageUtil.set('fileChange', false)
      },

      /** 
       * 清空数据，重置按钮显示和恢复全不选
      */
      _clearData: function() {
        this.fileList = []
        this.selectFileList = []
        this.typeName = ''
        this._resetBtnVisible()
        this.checkAll = false
        this.$refs.searchbar._clearValue()
      },

      /** 
       * 重置Button显示
      */
      _resetBtnVisible: function() {
        this.buttonVisible = {
          upload: false,
          download: false,
          print: false,
          delete: false,
          smash: false,
          copy: false,
          move: false,
          reply: false
        }
      },

      /** 
       * 获取所有的文档列表
      */
      _requestGetDocumentDatas: function(obj) {
        this.selectFileList = []
        this.loadingVisible = true
        return requestGetDocumentList(obj).then(response => {
          if (response.code === 200) {
            if (response.data.length) {
              // 设置当前的文档的ID数组
              let idArr = []
              idArr = response.data.map(item => {
                return item.fileId
              })
              // 存储当前获取的ID数组对象
              sessionStorageUtil.set('current_Ids', idArr)
              // 设置是否被选中的属性
              this.fileList = response.data.map(item => {
                item.checked = false
                return item
              })
            }
            else {
              this.fileList = []
            }
            // 关闭loading
            setTimeout(() => {
              this.loadingVisible = false
            }, 500)
          }
        })
      },

      /** 
       * tab项点击
      */
      _tabItemClick: function(name) {
        // this._clearData()
        this.currentTabView = name
        // 当点击的是分类项，重新请求数据
        // if(name === 'TypeVue') {
        //   this._requestGetTypeData()
        // }  
      },

      /** 
       * 接收type改变,根据类别的数据来重置按钮的显示和类型的显示
      */
      _getTypeData: function(item) {
        // 清空数据
        this._clearData()
        // 获取类型值
        let typeValue = item.title + ''
        // 设置当前的选中项的Title值,存储起来用来判断
        this.current_title = item.title
        this.current_categoryId = item.categoryId ? Number(item.categoryId) : ''
        this.current_obj = item
        switch (typeValue) {
          // 草稿箱
          case '草稿箱':
            this.typeName = 'draft'
            this.belongClass = 'draft'
            this.buttonVisible.upload = true
            this.current_categoryId = 'draft'
            break
          // 回收  
          case '回收站':
            this.typeName = 'recycle'
            this.belongClass = 'recycle'
            break
          // 文档
          default:
            this.typeName = 'document'
            this.belongClass = 'document'
            this.buttonVisible.upload = true
            break
        }
        // 设置请求的参数
        let obj = {}
        // 传递的是文档类型
        if(item.categoryId) {
          obj.categoryId = Number(item.categoryId)
        }
        // 传递的回收站和草稿箱
        if (item.fileStatus) {
          obj.fileStatus = Number(item.fileStatus)
        }
        // 获取文档数据
        this._requestGetDocumentDatas(obj)
      },

      /** 
       * 接收年月数据改变
      */
      _getMonthData: function(item) {
        // 设置一些变量
        this.typeName = 'time'
        this.current_title = '时间'
        this.belongClass = 'time'
        this.current_obj = item
        let obj = {}
        obj.queryTime = item.year + '-' + item.mon
        // 获取文档数据
        this._requestGetDocumentDatas(obj)
      },

      /** 
       * 接收搜索的值
      */
      _search: function(keyword) {
        let pattern = new RegExp('[?*/\<>:"|]')
        if (null === keyword || keyword === '' || pattern.test(keyword)) {
          return this.$VMessage('error', '请填写正确的查询内容')
        } else {
          // 设置请求的参数对象
          let obj = {}
          obj.queryCriteria = keyword + ''
          // 根据当前对象的数据进行参数赋值
          if (this.current_obj.categoryId) {
            obj.categoryId = this.current_obj.categoryId
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
          if (this.current_obj.fileStatus) {
            obj.fileStatus = this.current_obj.fileStatus
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
          if (this.current_obj.year) {
            obj.queryTime = this.current_obj.year + '-' + this.current_obj.mon
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
        }
      },

      /**
       * 全选状态改变
       */
      _checkAllChange: function(newValue) {
        // 改变文件选中状态，设置为全部选中
        for (let file of this.fileList) {
          if (file.checked !== newValue) {
            file.checked = newValue
          }
        }
        // 改变selectFileList数据
        if (newValue) {
          // 勿将fileList赋给selectFileList，会建立引用
          this.selectFileList = [].concat(this.fileList)
        } 
        else {
          this.selectFileList = []
        }
      },

      /**
       * 文件选中状态改变
       * @param  {object} file：当前选中文件
       */
      _fileSelectChange: function(file) {
        this.selectFileList = [].concat(this.selectFileList)
        file.checked ? this._addElement(this.selectFileList, file) : this._removeEleById(this.selectFileList, file.fileId)
      },

      /** 
       * 单个文件的状态改变
       * @param  {object} file：当前选中文件
      */
      _singleFileSelectChange: function(file) {
        if (file.checked) {
          for (let fileItem of this.fileList) {
            fileItem.checked = false
            if (file.fileId === fileItem.fileId) {
              fileItem.checked = true
            }
          }
          // 清空被选中的文件
          this.selectFileList = []
          this._addElement(this.selectFileList, file)
        }
      },

      /**
       * 添加一个元素到selectFileList
       * @param  {array} arr：目标数组
       * @param  {object} file：要添加的元素
       */
      _addElement: function(arr, file) {
        const isContain = this._contain(arr, file.fileId)
        if (!isContain) {
          arr.push(file)
        }
      },

      /**
       * 根据id删除数组中的一个元素
       * @param  {array} arr：目标数组
       * @param  {number} id：要删除元素的id属性
       */
      _removeEleById: function(arr, id) {
        arr.forEach(item => {
          if(item.fileId === id) {
            arr.splice(arr.indexOf(item), 1)
          }
        })
      },

      /**
       * 判断数组中是否有某个元素
       * @param  {array} arr：要判断的数组
       * @param  {number} id：元素的id
       */
      _contain: function(arr, id) {
        let flag = false
        arr.forEach(item => {
          if (item.fileId === id) {
            flag = true
          }
        })
        return flag
      },

      /** 
       * 还原按钮点击
      */
      _replyClick: function() {
        let params = {
          fileIds: this._getSplitString()
        }
        // api
        _handleFile('/api/v2/file/station/trashRecovery', params, 'post').then( res => {
          if (res.code === 200) {
            // 获取当前分类类别的数据
            this.afrashTypeData()
            // 提示信息
            this.$VMessage('success', '文件还原成功')
          } else if (res.code === 204) {
            // 提示信息
            this.$VMessage('error', '文件还原失败')
          }
        })
      },

      /**
       * 请求复制文件
       * @param  {number} typeId: 目标分类Id
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _copyFile: function(typeId, fileIds) {
        let params = {
          destCategoryId: typeId,
          fileIds: fileIds
        } 
        // api
        _handleFile('/api/v2/file/station/copy', params, 'post').then(res => {
          if (res.code === 200) {
            this.$VMessage('success', '文件复制成功')
            this.moveOrCopyDialogVisible = false
            // 获取当前分类类别的数据
            this.afrashTypeData()
          } if (res.code === 204) {
            this.$VMessage('error', '文件复制失败')
            this.moveOrCopyDialogVisible = true
          }
        })
      },

      /**
       * 将id组成的数组，用逗号分隔成字符串
       */
      _getSplitString: function() {
        const fileIds = this.selectFileList.map(file => {
          return file.fileId
        })
        return fileIds.join(',')
      },

      /** 
       * 创建文档按钮点击，跳转新的页面
      */
      _createBtnClick: function() {
        let current_title = this.current_title
        let categoryId = null
        if (current_title === '全部文档' || current_title === '回收站' || current_title === '草稿箱' || current_title === '时间') {
          categoryId = ''
        } else {
          categoryId = this.current_obj.categoryId
        }
        // 打开新页面，同时传递当前所属的类别分类参数
        window.open(window.location.origin + `/#/editor?source=file&categoryid=${categoryId}`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .charge-in
    width 100%
    height 100%
    position relative
    .fill-height
      overflow-y auto
      min-width 1110px
    .document-show-box
      position absolute
      bottom 0
      right 0
      width 800px
      height 450px
      overflow hidden
      z-index -999
      visibility hidden
    .left-control
    .right-list
      position relative
      padding 12px
      border-radius 5px
      background-color rgb(255, 255, 255)
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
    .left-control
      .linkage
        text-align left
        .class-select
          display inline-block
          // width 12%
          margin 16px 0 0
          margin-left 36px
          .select-txt
            border none
            color #99601C
            margin-right 6px

      // 列表样式
      .table
        margin-top 16px
        width 100%
        line-height 40px
        color #99601C

        .table-title
          background rgba(204,204,204,0.15)
        .line-item
          width 100%
          height 40px
          clear both
          >div
            float left
            padding 0 12px
            width 12.5%
            font-size 14px
            text-align center
            box-sizing border-box

        .table-body
          width 100%
          // background #fff
          clear both
          .line-item
            &:hover
              background rgba(117,199,59,0.1)
            &:leave
              background #fff
            &.active-title 
              background rgba(117,199,59,0.15)
            .operation
              cursor pointer

      .item-tab-content
        width 420px
        margin 0 auto
        .vice-tab
          padding 12px 20px
          cursor pointer
          color #ccc
      .tabble-out
        margin 20px auto
        border-space 0px 0px
        border-collapse collapse
        .tabble-line
          border-right 1px solid #666
          border-bottom 1px solid #666
          .tabble-cow
            width 10%
            padding 8px 20px
            border-top 1px solid #666
            border-left 1px solid #666
      .control-title
        float left
        width 120px
        margin 0 20px
        height 50px
        line-height 50px
        color #99601c
        border-bottom 3px solid white
      .active-title  
        color #99601c
        border-color #99601c
    .left-control
      .control-data
        position absolute
        left 0
        right 0
        bottom 10px
        top 60px    
        overflow-y auto
    .right-list
      padding 20px 

  .move-file-content
    padding 0 20px
    line-height 34px
    .move-select
      width 320px
      margin-left 20px  
</style>

<style lang="stylus" rel="stylesheet/stylus">
.input-com
  width 260px
  display inline-block
  input
    height 32px
    line-height 32px
    color #99601C
    padding 0 12px
    box-sizing border-box
    background #ffe6c1
    border 1px solid #99601C!important
    border-radius 16px

  .el-input__suffix
    .el-input__suffix-inner
      .el-input__icon
        line-height 32px
        color #99601C
  .el-select-dropdown__item.selected
    color #99601C

.el-select-dropdown__item.selected
  color #269856
</style>

<style>
  .charge-in .add-student-info span{
    display: inline-block;
    width: 8px;
    height: 18px;
    margin-right: 8px;
    margin-left: 8px;
    margin-bottom: -3px;
    background: #269856;
    border-radius: 2px;
  }
  .charge-in .add-student-info{
    margin-left: 20px;
    color: #99601C;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
  }
  /* 日期 */
  .charge-in .block .el-range-editor.el-range-editor.el-input__inner.input-com .el-range-separator{
    color: #99601C;
  }
  .charge-in .block .el-range-editor.el-input__inner{
    width: 680px;
    height: 32px;
    line-height: 32px;
    color: #fff;
    padding: 0;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #fff!important;
    border-radius: 16px;
  }
  .charge-in .el-date-table td.today span{
    color: #269856;
  }
  .charge-in .el-date-table td.end-date span, .el-date-table td.start-date span{
    background: #269856;
  }
  .el-date-table td.available:hover{
    color: #269856;
  }

  .charge-in .input-reset.ivu-btn-ghost:hover{
    background: rgba(248, 75, 98,.1)!important;
  }

  /* 弹框样式 */
  .charge-in .list-dialog .el-dialog{
    width: 880px;
    height: 600px;
    background: #FFFBEB;
    border-radius: 16px;
    overflow: hidden;
  }
  .charge-in .el-dialog__header{
    background: -webkit-linear-gradient(bottom, #E99D46 , #AA7334); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom, #E99D46, #AA7334); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom, #E99D46, #AA7334); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom, #E99D46 , #AA7334); /* 标准的语法 */
  }
  .charge-in .el-dialog__header .el-dialog__title{
    color: #fff;
  }
  .charge-in .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
    /* float: right; */
  }
  .charge-in .el-dialog__body{
    padding: 12px 30px;
  }
  .charge-in .el-dialog .el-dialog__body .table .line-item>div.item{
    width: 30%
  }

  .charge-in .class-select{
    display: inline-block;
    margin: 16px 0 0;
    margin-right: 12px;
  }
  .charge-in .class-select .select-txt{      
    border: none;
    color: #99601C;
    margin-right: 6px;
  }
  .charge-in .class-select .input-com {      
    width: 160px;
  }
  .charge-in .add-student-info-btn{      
    margin-top: 160px;
    float: right;
  }
  
</style>
