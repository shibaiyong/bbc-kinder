/** 
 * @Desc: 学生管理内容区
 */
<template>
  <div class="student-manage-content">
    <!-- loading -->
    <v-loading v-show="loadingVisible"></v-loading>

    <!-- S 头部 -->
    <div class="header" v-show="classId !== 0">
      <!-- 增加.stop属性用来测试一体机功能 -->
      <Button size="large" @click.native.stop="_addStudentClick">
        <v-icon type="icon-add-person" size="14"></v-icon>
        新生入园
      </Button>
      <div class="count-wrapper">
        <span class="count-item sex-male">
          <v-icon 
            type="icon-sex-male" 
            size="38"
            style="vertical-align:bottom;">
          </v-icon>{{ countData.male }}
        </span>
        <span class="count-item sex-female">
          <v-icon 
            type="icon-sex-female" 
            size="38"
            style="vertical-align:bottom;">
          </v-icon>{{ countData.female }}
        </span>
        <span class="total">
          （班级人数：{{ countData.total }}人）
        </span>
      </div>
    </div>
    <!-- E 头部 -->

    <!-- S 学生列表 -->
    <div class="student-list-wrapper">
      <ul class="student-list">
        <student-item 
          v-for="student in studentList" 
          :key="student.stu_id" 
          :student="student"
          :remove="true"
          @removeStudent="_removeStudentClick"
          @editStudent="_editStudentClick">
        </student-item>
      </ul>
    </div>
    <!-- E 学生列表 -->

    <!-- S 添加学生/修改学生 对话框  -->
    <!-- @on-cancel="$refs['studentOperationForm'].resetFields()"  _cancelStudentOperation  -->
    <Modal 
      :title="isAddStudent ? '添加学生' : '修改学生'"
      v-model="studentOperationDialogVisible"
      @on-ok="_handleStudentOperation"
      @on-cancel="_cancelStudentOperation" 
      class="add-child">
      <Form 
        :model="studentOperationForm"
        :rules="studentOperationFormRule"
        :labelWidth="90"
        ref="studentOperationForm"
        style="padding:0 50px;">
        <FormItem label="学生姓名" prop="name">
          <Input 
            size="large"
            v-model="studentOperationForm.name" 
            placeholder="请输入学生姓名"
            style="width:260px;"/>
        </FormItem>
        <FormItem prop="sex">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="studentOperationForm.gender">
            <Radio :label="1">男</Radio>
            <Radio :label="0">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="所属年级" prop="gradeId">
          <Select
          size="large" 
          v-model="studentOperationForm.gradeId" 
          placeholder="请选择年级"
          style="width:260px;">
            <Option
              v-for="grade in $store.state.gradeList"
              :key="grade.gradeId"
              :value="grade.gradeId">
              {{ grade.gradeName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem 
          size="large"
          label="所属班级" 
          prop="classId">
          <Select 
            size="large" 
            v-model="studentOperationForm.classId" 
            placeholder="请选择班级"
            style="width:260px;">
            <Option
              v-for="classItem in classList"
              :key="classItem.classId"
              :value="classItem.classId">
              {{ classItem.className }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="birthday">
          <span slot="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span>
          <DatePicker 
            type="date"
            size="large"
            placeholder="请选择生日"
            :value="studentOperationForm.birthday"
            :options="studentOperationBirthdayOptions"
            @on-change="(value) => { studentOperationForm.birthday = value }"
            style="width:260px;">
          </DatePicker>
        </FormItem>
       
        <div v-for="(item, index) in studentOperationForm.protectMen" :key="index" class="protect-men">
          <div style="float: left;width: 90px;height: 38px;padding-right: 20px;text-align: right;vertical-align: middle;float: left;font-size: 16px;color: #99601c;line-height: 34px;padding-right: 20px;-webkit-box-sizing: border-box;box-sizing: border-box;">{{index==0?'监 护 人':' '}}</div>
          
          <FormItem 
            size="large"
            label="" 
            prop="relation_type?">
            <Select 
              size="large" 
              v-model="item.relation_type" 
              placeholder="选择" style="width:88px;">
              <Option
                v-for="protectItem in protectList"
                :key="protectItem.protectId"
                :value="protectItem.protectId">
                {{ protectItem.protectName }}
              </Option>
            </Select>
          </FormItem>

          <FormItem
            label=""
            :prop="'protectMen.'+index+'.parent_name'"
            :rules="studentOperationFormRule.protectMen.name">
            <Input 
              size="large"
              v-model="item.parent_name" 
              placeholder="姓名" style="width: 100px;display: inline-block;margin-left: 4px;" class="protect-men-name"/>
          </FormItem>
            
          <FormItem label="" 
            :prop="'protectMen.'+index+'.phone'"
            :rules="studentOperationFormRule.protectMen.phone">
            <Input
              size="large"
              v-model="item.phone" 
              placeholder="联系方式" style="width: 160px;display: inline-block;margin: 0 4px;" :show-message="true" class="protect-men-phone"/>
            <span class="protect-man-icon" @click="_delProtectMan(index)"></span>
            <span v-if="!isAddStudent" :style="item.is_actived?'color:#75C73B;':'color:#F84B62;'">{{item.is_actived?'已激活':'未激活'}}</span>
          </FormItem>
        </div>
        <div style="margin-left: 90px;height: 16px;font-size: 12px;line-height: 16px;color:#ed3f14;"><span v-if="phoneCheckInfo">{{phoneCheckInfo.msg}}</span></div>
        <!-- 添加监护人 btn -->
        <FormItem
          v-if="studentOperationForm.protectMen.length<8"
          prop="addProtectMan">
          <div style="display: inline-block;cursor: pointer;" @click="_addProtectManFun">
            <v-icon type="icon-add" size="12" color="#CB6A22"></v-icon>
            <span>添加监护人</span>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 添加学生对话框 -->

    <!-- S 删除监护人对话框 -->
    <Modal
      title="删除监护人"
      v-model="removeProtectManDialogVisible"
      :confirm="true"
      @on-ok="_removeProtectManFun">
      <p style="text-align:center;">
        确定要删除本条
        <span style="color:#ed3f14;font-weight:bold;">
          {{ removeStudent.name }}
        </span>
        的监护人
        <span style="color:#ed3f14;font-weight:bold;">
          {{ removeStudent.parent }}
        </span>
        吗？
      </p>
    </Modal>
    <!-- E 删除学生对话框 -->

    <!-- S 删除学生对话框 -->
    <Modal
      title="删除学生"
      v-model="removeStudentDialogVisible"
      :confirm="true"
      @on-ok="_removeStudent">
      <p style="text-align:center;">
        确定要删除学生 
        <span style="color:#ed3f14;font-weight:bold;">
          {{ removeStudent.name }}
        </span>
        吗？
      </p>
    </Modal>
    <!-- E 删除学生对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { 
    requestGetStudents,
    requestAddStudent,
    requestPatchStudent,
    requestDeleteStudent,
    requestDeleteProtectMan
  } from 'api/student-manage'
  import StudentItem from 'base/student-item'
  export default {
    name: 'StudentManageContent',
    components: {
      StudentItem,
    },
    data: function() {
      return {
        // 学生数据
        studentList: [],
        countData: {
          male: '',
          female: '',
          total: ''
        },
        // 添加学生表单
        isAddStudent: true,
        studentOperationDialogVisible: false,
        freEditStudent: {}, // 保存修改学生之前状态
        studentOperationForm: {
          id: '',
          name: '',
          gradeId: '',
          classId: '',
          birthday: '',
          gender: '1',
          protectMen: [
            {
              relation_type: 1,
              parent_name: '',
              phone: '',
              is_actived: true,
              parent_id: null
            }
          ]
        },
        studentOperationFormRule: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 2, max: 10, message: '2~10 个字符之间', trigger: 'blur' }
          ],
          gradeId: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
          classId: [
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ],
          birthday: [
            { required: true, message: '请选择生日', trigger: 'change' }
          ],
          protectMen:{
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 15, message: '2~15 个字符之间', trigger: 'blur' }
            ],
            phone:[
              { required: true, message: '手机号不能为空', trigger: 'blur' },
              { min: 11, max: 11, message: '手机号格式不正确', trigger: 'blur' }
            ]
          }
        },
        phoneCheckInfo: '',  // 手机号验证的错误信息
        oprationProtectManIndex: 0,// 要删除的监护人index
        needGetStudents: false,// 修改的时候 校验表单失败 为 true 需要重新获取数据 在关闭modal的时候
        studentParents: {},// 修改的时候 先深拷贝一份联系人
        // 删除监护人对话框
        removeProtectManDialogVisible: false,
        // removeStudent: {
        //   id: '',
        //   name:''
        // },
        // 禁止选择的日期条件（true为禁止选择）
        studentOperationBirthdayOptions: {
          disabledDate(date) {
            return date.getTime() > ( Date.now() - 24 * 60 * 60 * 1000 )
          }
        },
        // 删除学生对话框
        removeStudentDialogVisible: false,
        removeStudent: {
          id: '',
          name:''
        },
        // 删除监护人对话框
        // removeProtectManDialogVisible: false,
        // removeProtectMan: {
        //   id: '',
        //   name:''
        // },
        // loading状态
        loadingVisible: false,
      }
    },
    computed: {
      /**
       * 年级id
       */
      gradeId: function() {
        return Number(this.$route.params.gradeId)
      },

      /**
       * 班级id
       */
      classId: function() {
        return Number(this.$route.params.classId)
      },
      
      /**
       * 添加/修改学生 当前年级下的班级
       */
      classList: function() {
        var res = []
        this.$store.state.gradeList.forEach(grade => {
          if (grade.gradeId === this.studentOperationForm.gradeId) {
            res = grade.classes
          }
        // console.log(grade)
        })
        console.log(this.studentOperationForm)
        return res
        
      },
      
      /**
       * 添加/修改学生 当前监护人
       */
      protectList: function() {
        var res = []
        this.$store.state.protectList.forEach(protect => {
          if (protect.protectId === this.studentOperationForm.protectId) {
            res = protect.protects ///// ??????
          }
        })
        res = [
          {
            protectId: 1,
            protectName: '爸爸'
          },{
            protectId: 2,
            protectName: '妈妈'
          },{
            protectId: 3,
            protectName: '爷爷'
          },{
            protectId: 4,
            protectName: '奶奶'
          },{
            protectId: 5,
            protectName: '姥爷'
          },{
            protectId: 6,
            protectName: '姥姥'
          },{
            protectId: 7,
            protectName: '保姆'
          },{
            protectId: 8,
            protectName: '其他'
          }
        ];
        return res
      },
    },
    watch: {
      /**
       * 监视班级id
       */
      classId: function(value) {
        if (value === 0) {
          this.studentList = []
          this.$VMessage('info', '当前没有班级，请先创建班级', 3000)
        }
        else {
          this.loadingVisible = true
          this._getStudents()
        }
      }
    },
    methods: {
      /**
       * 手机号验证
       */
      _phoneCheck: function(index) {
        var protectMenArr = this.studentOperationForm.protectMen;
        var msg = ''
        for(var i in protectMenArr){
          var phone = protectMenArr[i].phone;
          var res = [
              {
                protectId: 1,
                protectName: '爸爸'
              },{
                protectId: 2,
                protectName: '妈妈'
              },{
                protectId: 3,
                protectName: '爷爷'
              },{
                protectId: 4,
                protectName: '奶奶'
              },{
                protectId: 5,
                protectName: '姥爷'
              },{
                protectId: 6,
                protectName: '姥姥'
              },{
                protectId: 7,
                protectName: '保姆'
              },{
                protectId: 8,
                protectName: '其他'
              }
            ];
          // 校验手机号格式
          if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(phone))&&phone.length==11) {
            // msg = '不是完整的11位手机号或者正确的手机号前七位';
            msg = '格式不正确';

            var relationTypeInfo = protectMenArr[i].relation_type; // 333
            for(let j in res){
              if(res[j].protectId==relationTypeInfo){
                msg = res[j].protectName+'的手机号,'+msg
                console.log(msg)
                break
              }
            }
            
            this.phoneCheckInfo = {
              i: i,
              msg: msg
            };
            console.log(this.phoneCheckInfo)
            break;
          }
          // 判断手机号的重复情况
          for(let j in protectMenArr){
            if(phone==protectMenArr[j].phone&&j!=i){
              this.phoneCheckInfo = {
                i: i,
                msg: '多个监护人时，手机号不能重复'
              };
              return
            }else{
              this.phoneCheckInfo=""
            }
          }
          // 没有问题的手机号 清空msg信息
          if(i==protectMenArr.length-1){
            this.phoneCheckInfo=""
          }
        }
        
      },
      /**
       * 删除监护人点击
       */
      _delProtectMan: function(index) {
        // 记录要删除的监护人
        this.oprationProtectManIndex = index;
        console.log(index)
        console.log(this.studentList[index])
        // this.removeStudent.id = this.studentList[index].stu_id
        this.removeStudent.name = this.studentOperationForm.name
        this.removeStudent.parent = this.studentOperationForm.protectMen[index].parent_name
        // this.removeStudentDialogVisible = true
        console.log(this.removeStudent)
        // 打开 确认删除 Modal
        this.removeProtectManDialogVisible = true;
        console.log(this.oprationProtectManIndex)
        
      },
      /**
       * 添加监护人点击
       */
      _addProtectManFun: function(index) {
        var protectMen = this.studentOperationForm.protectMen;
        if(protectMen.length<8){
          var objItem = {
            relation_type: 1,
            parent_name: '',
            phone: '',
            parent_id: null
          };
          protectMen.push(objItem);
          this.studentOperationForm.protectMen = protectMen;
        }
        // console.log(protectMan.relation_type)
      },
      /**
       * 删监护人除按钮点击
       */
      _removeProtectManFun: function(student) {

        // 确定要删除的 index
        var index = this.oprationProtectManIndex;

        console.log(this.isAddStudent?'这是添加学生':'这是修改学生')
        // 判断 是 添加用户 还是 修改用户
        if(this.isAddStudent){
          // 从数组里删掉
          var protectMen = this.studentOperationForm.protectMen;
          protectMen.splice(index,1);
          this.studentOperationForm.protectMen = protectMen;
          // 关闭 modal
          this.removeProtectManDialogVisible = false;
          return
        }else{ 
          // 拿 studentId 和 要删除的 parentId
          console.log(this.studentOperationForm.protectMen[index])
          var param = {
           studentId: this.studentOperationForm.id,
           parentId: this.studentOperationForm.protectMen[index].parent_id,
          }
          var protectMen = this.freEditStudent.parents
          for(var i in protectMen){
            if(!param.parentId){
              i = protectMen.length-1
              break
            }
            if(param.parentId==protectMen[i].parent_id){
              // 请求数据接口
              console.log(param)
              this._removeProtectMan(param,index);
              return
            }
          }
          // 修改 学生信息 监护人 后台没有 直接删除
          if(i>protectMen.length-2){
            // 从数组里删掉
            var protectMen = this.studentOperationForm.protectMen;
            protectMen.splice(index,1);
            this.studentOperationForm.protectMen = protectMen;
            // 关闭 modal
            this.removeProtectManDialogVisible = false;
          }
          
          console.log(param)
        }
        
        
        
      },
      /**
       * 删除学生按钮点击
       */
      _removeStudentClick: function(student) {
        this.removeStudent.id = student.stu_id
        this.removeStudent.name = student.stu_name
        this.removeStudentDialogVisible = true
      },

      /**
       * 删除监护人按钮点击
       */
      // _removeStudentClick: function(student) {
      //   this.removeStudent.id = student.stu_id
      //   this.removeStudent.name = student.stu_name
      //   this.removeStudent.protectMan = student.parents[oprationProtectManIndex].name
      //   this.removeStudentDialogVisible = true
      //   console.log(this.removeStudent)
      // },

      /**
       * 学生添加按钮点击
       */
      _addStudentClick: function() {
        this.isAddStudent = true
        this.studentOperationForm.gradeId = this.gradeId
        this.studentOperationForm.classId = this.classId
        // 初始化 监护人信息
        this.studentOperationForm.protectMen = []
        this.studentOperationDialogVisible = true
      },

      /**
       * 修改学生按钮点击
       */
      _editStudentClick: function(student) {
        console.log(student)
        this.freEditStudent = student // 保存修改学生之前状态 删除监护人的时候可以判断是否需要请求接口
        this.isAddStudent = false
        this.studentOperationForm.id = student.stu_id
        this.studentOperationForm.name = student.stu_name
        this.studentOperationForm.gradeId = student.grade_id
        this.studentOperationForm.classId = student.class_id
        this.studentOperationForm.gender = student.gender
        this.studentOperationForm.birthday = student.birthday
        // 学生监护人，必填
        for(var i=0;i< student.parents.length;i++){
          if(!student.parents[i].parent_id){
            // 干掉本条无效数据
            student.parents.splice(i,1)
            i = i-1;
          }
        }
        this.studentOperationForm.protectMen = student.parents
        console.log(this.studentOperationForm.protectMen)
        // 先保存一份联系人
        this.studentParents = JSON.stringify(student.parents);
        console.log('这是修改前保存的联系人')
        console.log(this.studentParents)
        this.studentOperationDialogVisible = true
      },

      /**
       * 确认 添加/修改 学生
       */
      _handleStudentOperation: function() {
        // 表单校验
        this.$refs['studentOperationForm'].validate((valid) => {

          if(this.phoneCheckInfo.msg){
            
            console.log(this.phoneCheckInfo.msg)
            // 手机号验证格式有问题
            this.isAddStudent ? '' : this._getStudents()
            return
          }
          // 判断 表单验证是否都通过
          if (valid) {
            
            // 验证手机号是否正确
            this._phoneCheck()
            // 手机校验失败
            if(this.phoneCheckInfo.msg){
              return
            }
            console.log("到确认了呵呵")
            this.isAddStudent ? this._addStudent() : this._eidtStudent()
          }else{
            // 表单检验数据失败 数据重新获取
            this.needGetStudents = true;
          }
        })
      },

      /**
       * 取消 添加/修改 学生
       */
      _cancelStudentOperation: function() {
        var protectMen = this.studentOperationForm.protectMen;
        
        var studentObj = JSON.stringify(this.studentOperationForm)
        console.log(studentObj)
        
        this.$refs['studentOperationForm'].resetFields()
        // 去掉 信息不全的监护人
        for(var k=0;k<protectMen.length;k++){
          if(protectMen[k].parent_id<1){
            protectMen.splice(k,1)
            k = k-1;
          }
        }
        console.log(1111)
        // 清空 提示信息
        if(this.phoneCheckInfo.msg){
          this.phoneCheckInfo.msg = ''
        }
        console.log(this.studentOperationForm)
        if(this.isAddStudent){
          console.log('这是 添加学生 modal')
          return
        }else{
          
          // if(this.needGetStudents){
          //   this.needGetStudents = false;
          //   this._getStudents();
          //   return
          // }
          var studentList = this.studentList;
          studentObj = JSON.parse(studentObj)
          // // 去掉 信息不全的监护人
          // for(var j=0;j<studentObj.protectMen.length;j++){
          //   if(studentObj.protectMen[j].parent_id<1){
          //     studentObj.protectMen.splice(j,1)
          //     j = j-1;
          //   }
          // }
          console.log(studentObj)
          for(let i in studentList){
            if(studentList[i].stu_id == studentObj.id){
              console.log(this.studentParents)
              // 将 深拷贝的数据 赋值
              // this.studentParents = JSON.stringify(this.studentParents)
              console.log(typeof(this.studentParents))
              // 如果 this.studentParents 没有经过 删除监护人的 string 转换 在此转一下
              if(typeof(this.studentParents)=='object'){
                console.log(123)
                this.studentParents = JSON.stringify(this.studentParents)
              }
              
              studentList[i].parents = JSON.parse(this.studentParents);
              break
            }
          }
        }
      },

      /**
       * 删除学生
       */
      _removeStudent: function() {
        requestDeleteStudent(this.removeStudent.id)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestDeleteStudent SUCCESS', res)
              this.removeStudentDialogVisible = false
              this.$VMessage('success', '删除成功')
              this._getStudents()
            }
            else {
              // console.log('requestDeleteStudent FAIL', res)
              this.$VMessage('error', '删除失败')
            }
          })
          .catch(err => {
            // console.log('requestDeleteStudent FAIL', err)
            this.$VMessage('error', '删除失败')
          })       
      },

      /**
       * 删除监护人
       */
      _removeProtectMan: function(param,index) {
        console.log(param)
        requestDeleteProtectMan(param)
          .then(res => {
            if (res.code === 200) {
              // 从数组里删掉

              // 如果 this.studentParents 没有经过 删除监护人的 string 转换 在此转一下
              if(typeof(this.studentParents)=='object'){
                this.studentParents = JSON.stringify(this.studentParents)
              }
              this.studentParents = JSON.parse(this.studentParents)
              for(var i in this.studentParents){
                console.log(this.studentParents)
                console.log(this.studentOperationForm.protectMen[index])
                if(this.studentParents[i].parent_id==this.studentOperationForm.protectMen[index].parent_id){
                  this.studentParents.splice(i,1);
                  console.log(this.studentParents)
                }
              }
              var protectMen = this.studentOperationForm.protectMen;
              protectMen.splice(index,1);
              this.studentOperationForm.protectMen = protectMen;
              // 重新请求页面数据
              // this._getStudents()
              // 关闭 modal
              this.removeProtectManDialogVisible = false;
            }
            else {
              // console.log('requestDeleteStudent FAIL', res)
              this.$VMessage('error', '删除失败')
            }
          })
          .catch(err => {
            // console.log('requestDeleteStudent FAIL', err)
            this.$VMessage('error', '删除失败')
          })       
      },

      /**
       * 修改学生
       */
      _eidtStudent: function() {
        requestPatchStudent(this.studentOperationForm)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestPatchStudent SUCCESS', res)
              this.studentOperationDialogVisible = false
              this.$VMessage('success', '修改成功')
              this._getStudents()
            }
            else {
              // console.log('requestPatchStudent FAIL', res)
              this.$VMessage('error', '修改失败')
            }
          })
          .catch(err => {
            // console.log('requestPatchStudent FAIL', err)
            this.$VMessage('error', '修改失败')
          })
      },

      /**
       * 添加学生
       */
      _addStudent: function() {
        requestAddStudent(this.studentOperationForm)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              // console.log('requestAddStudent SUCCESS', res)
              this.studentOperationDialogVisible = false
              this.$VMessage('success', '添加成功')
              this._getStudents()
            }
            else {
              // console.log('requestAddStudent FAIL', res)
              this.$VMessage('error', '添加失败')
            }
          })
          .catch(err => {
            // console.log('requestAddStudent FAIL', err)
            this.$VMessage('error', '添加失败')
          })
      },

      /**
       * 获取学生列表
       */
      _getStudents: function() {
        this.loadingVisible = true
        requestGetStudents(this.classId)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)             
            if (res.data.code === 200) {
              // 设置数据
              console.log('学生数据列表')
              console.log(res.data.list)
              this.studentList = res.data.list
              this.countData.total = res.data.count
              this.countData.male = res.data.sex.male_num
              this.countData.female = res.data.sex.female_num
              // 重置表单
              this.$refs['studentOperationForm'].resetFields()
              // 隐藏loading
              if (!this.studentList.length) {
                this.$VMessage('info', '当前班级没有学生，快去添加学生吧', 2000)
              }
            }
            else {
              // console.log('requestGetStudents FAIL', res)
            }
          })  
          .catch(err => {
            // console.log('requestGetStudents FAIL', err)
          })
      },
    },
    created: function() {
      if (this.classId !== 0) {
        this._getStudents()
      }
    },
    mounted: function() {
      if (this.classId === 0) {
        this.$VMessage('info', '当前没有班级，请先创建班级', 3000)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .student-manage-content
    position relative
    height 100%
    padding 24px 20px
    .header
      padding-left 25px
      .count-wrapper
        display inline-block
        vertical-align middle
        margin-left 30px
        .count-item
          margin-right 12px
          font-size 24px
          &.sex-male
            color #98e6e6
          &.sex-female
            color #faaaab
        .total
          position relative
          top -2px
          font-size 14px
          color #99601c
    .student-list-wrapper
      position absolute
      top 75px
      right 0
      bottom 0
      left 20px
      overflow auto
    
</style>

<style lang="stylus" rel="stylesheet/stylus">
  .add-child
    .ivu-modal-wrap
      .ivu-modal 
        width 680px!important
        .ivu-modal-body
          padding 30px 16px 20px
          .ivu-select-dropdown::-webkit-scrollbar-track
            -webkit-box-shadow  inset 0 0 6px rgba(0,0,0,0.3)
            border-radius 10px
            background-color #F5F5F5

          .ivu-select-dropdown::-webkit-scrollbar
            width 6px
            background-color #F5F5F5
          
          .ivu-select-dropdown::-webkit-scrollbar-thumb
            border-radius 10px
            -webkit-box-shadow inset 0 0 6px rgba(0,0,0,.3)
            background-color #888
        
      
          .protect-man-icon
            display inline-block;
            width 14px
            height 16px
            background url('../../../image/del-icon.png') no-repeat center
            transform translateY(2px)
            cursor pointer
    
    .protect-men
      .ivu-form-item
        display inline-block
        .ivu-form-item-content
          margin-left 0!important

          .protect-men-name
            .ivu-input-large
              padding 0 9px 0 8px
              text-align center
          .protect-men-phone
            .ivu-input-large
              padding 0 18px


</style>
