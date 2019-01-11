/** 
 * @Desc: 收藏列表
 */
<template>
  <div class="staff-details">
    <!-- 按钮 -->
    <div class="staff-header">
      <Button size="large" style="margin-left: 16px;" @click="_handleAdd">
        <v-icon type="icon-add-person" :size="16"></v-icon>  
        添加职工
      </Button>
    </div>

    <!-- 数据头部 -->
    <div class="list-header clear-float">
      <Col span="12">姓名</Col>
      <!-- <Col span="3">姓名</Col>
      <Col span="6">姓名</Col> -->
      <Col span="8">班级</Col>
      <Col span="4">手机号</Col>
    </div>

    <!-- 数据内容 -->
    <div class="list-content">
      <ul v-if="staffListVisible">
        <li class="list-item list-padding clear-float" v-for="(staff, index) in staffList" :key="index">
          <Col span="12" class="clear-float">
            <Col span="6" class="no-wrap" v-text="staff.employeeName ? staff.employeeName : '--'"></Col>
            <Col span="6">
              <span v-if="staff.status === 'PENDING'" class="list-status status-unsend">未发送邀请码</span>
              <span v-else-if="staff.status === 'WAITING'" class="list-status status-waite">等待职工确认</span>
              <span v-else-if="staff.status === 'EXPIRED'" class="list-status status-expired">邀请码失效</span>
              <span v-else-if="staff.status === 'JOB'" class="list-status status-job">在职</span>
              <span v-else-if="staff.status === 'QUIT'" class="list-status status-quit">离职</span>
            </Col>
            <Col span="12">
              <Icon 
                type="edit"
                v-if="staff.status === 'JOB' || staff.status === 'QUIT'" 
                class="clickable list-icon"
                @click.native="_handleEdit(staff)"/>
              <Icon 
                type="email" 
                class="clickable list-icon"
                v-if="staff.status != 'JOB' && staff.status != 'QUIT'" 
                @click.native="_handleSendMessage(staff)"/>
              <Icon 
                type="trash-a" 
                class="clickable list-icon" 
                v-if="staff.status != 'JOB'"
                @click.native="_handleRemove(staff)"/>
            </Col>
          </Col>
          <Col v-if="staff.classes[0]['classId']" span="8" class="no-wrap" :title="staff.classes | classNames">
            {{ staff.classes | classNames}}
          </Col>
          <Col v-else span="8" class="no-wrap" title="暂无信息">--</Col>
          <Col span="4" v-text="staff.phone ? staff.phone : '--'"></Col>
        </li>
      </ul>
        <!-- 没有展示的数据 -->
      <ul v-else> 
        <li class="list-item-nodata" style="text-align:center; color: #851">暂无数据</li>
      </ul>
    </div>

    <!-- 添加职工 -->
    <Modal
      v-model="staffAddVisible"
      @on-ok="_handleAddStaff"
      @on-cancel="$refs['addStaffForm'].resetFields()"
      title="添加职工">
      <Form 
        :model="addStaffForm"
        :rules="addStaffFormRule"
        :labelWidth="90"
        style="padding:0 30px;"
        ref="addStaffForm">
        <!-- 姓名 -->
        <FormItem prop="empName" label="职工姓名">
          <Input v-model="addStaffForm.empName" placeholder="请输入职工姓名"/>
        </FormItem>
        <!-- 性别 -->
        <FormItem prop="gender">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="addStaffForm.gender">
            <Radio label="MALE">男</Radio>
            <Radio label="FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 任教班级 -->
        <FormItem label="任教班级" prop="classIds">
          <GradeClassChange @_emitSelectedData="_getSelectedData" ref="gradeChangeBox"></GradeClassChange>
        </FormItem>
        <!-- 入职时间 -->
        <FormItem label="入职时间" prop="hireDate">
          <DatePicker 
            type="date" 
            placeholder="请选择入职时间"
            :value="addStaffForm.hireDate"
            :clearable="false"
            format="yyyy-MM-dd"
            @on-change="(value) => { addStaffForm.hireDate = value }" 
            style="width: 300px"></DatePicker>
        </FormItem>
        <!-- 手机号码 -->
        <FormItem prop="phone" label="手机号码">
          <Input v-model="addStaffForm.phone" placeholder="请输入手机号码" :maxlength="11"/>
        </FormItem>
        <!-- 备注 -->
        <FormItem label="备注信息" prop="textarea">
          <Input v-model="addStaffForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 6}" placeholder="请输入备注信息"></Input>
        </FormItem>
        <div style="padding-left: 10px">
          <Checkbox v-model="SendValue" @on-change="_changeSendValue">提交时发送邀请码</Checkbox>
        </div>
      </Form>
    </Modal>

    <!-- 修改职工 -->
    <Modal
      class="addmodel"
      v-model="staffEditVisible"
      @on-ok="_handleEditStaff"
      @on-cancel="$refs['editStaffForm'].resetFields()"
      title="修改职工">
      <Form 
        :model="editStaffForm"
        :rules="editStaffFormRule"
        :labelWidth="90"
        ref="editStaffForm"
        style="padding:0 50px;">
        <!-- 姓名 -->
        <FormItem label="职工姓名" prop="empName">
          <Input v-model="editStaffForm.empName" placeholder="请输入职工姓名"/>
        </FormItem>
        <!-- 性别 -->
        <FormItem prop="gender">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="editStaffForm.gender">
            <Radio label="MALE">男</Radio>
            <Radio label="FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>
        <!-- 任教班级 -->
        <FormItem label="任教班级" prop="classIds">
          <GradeClassChange @_emitSelectedData="_getSelectedData" :hasSelectedList="hasGradeList" ref="EditgradeChangeBox"></GradeClassChange>
        </FormItem>
        <!-- 入职时间 -->
        <FormItem label="入职时间" prop="hireDate">
          <DatePicker 
            type="date" 
            placeholder="请选择入职时间"
            :value="editStaffForm.hireDate"
            :clearable="false"
            format="yyyy-MM-dd"
            @on-change="(value) => { editStaffForm.hireDate = value }" 
            style="width: 260px"></DatePicker>
        </FormItem>
        <!-- 职业状态 -->
        <FormItem label="在职状态" prop="status" v-if="editStaffForm.status == 'JOB' || editStaffForm.status == 'QUIT' ">
          <Select v-model="editStaffForm.status" placeholder="请选择在职状态" @on-change="_statusChange" :label-in-value="true">
            <Option v-for="item in statusList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <!-- 离职时间 -->
        <FormItem label="离职时间" prop="leaveDate" v-if="leaveFlag">
          <DatePicker 
            type="date" 
            placeholder="请选择离职时间"
            :value="editStaffForm.leaveDate"
            :clearable="false"
            format="yyyy-MM-dd"
            @on-change="(value) => { editStaffForm.leaveDate = value }" 
            style="width: 260px"></DatePicker>
        </FormItem>
        <!-- 手机 -->
        <FormItem label="手机号码" prop="phone">
          <Input :disabled="true" v-model="editStaffForm.phone"/>
        </FormItem>
        <!-- 备注信息 -->
        <FormItem label="备注信息" prop="textarea">
          <Input v-model="editStaffForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 6}" placeholder="请输入备注信息"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 删除职工 -->
    <Modal
      v-model="staffRemoveVisible"
      @on-ok="_handleRemoveStaff"
      title="删除职工" :confirm="true">
      <p>确定要删除职工 <span style="color: red;font-weight:bold;">{{removeStaffForm.empName}}</span> 吗?</p>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import moment from 'moment'
  // 组件
  import VAvatar from 'base/avatar'
  import GradeClassChange from 'component/grade-class-change/grade-class-change'
  import { 
    requestGetStaffs, 
    requestAddStaff, 
    requestPatchStaff, 
    requestDeleteStaff, 
    requestSendMessage 
  } from 'api/staff'
  import { requestCheckExist } from 'api/garden'

  export default {
    name: 'StaffDetails',
    components: {
      VAvatar,
      GradeClassChange
    },
    data: function() {
      const validateTel = (rule, value, callback) => {
        let pattern = /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9]|19[8|9])\d{8}$/ //手机验证
        if (!value) {
          callback(new Error('请输入手机号'));
        } else if( !value.match(pattern) || value.length != 11){
          callback(new Error('请输入正确的手机号'))
        } else {
          if(this.tempTel !== value) {
            requestCheckExist(this.addStaffForm.phone).then(data => {
              this.tempTel = value
              data.code === 202 && callback('此账号已存在') 
              data.code === 200 && callback()
            })
          } else callback()
        }
      }
      return {
        staffAddVisible: false, // 添加dialog显示标识
        staffEditVisible: false, // 修改dialog标识
        staffRemoveVisible: false, // 删除dialog标识
        staffListVisible: false, // 职工列表标识
        staffList: [], // 职工列表
        SendValue: true, //短信发送值
        tempTel: null, //临时的手机号变量
        // 添加职工表单
        addStaffForm: { 
          empName: '',
          phone: '',
          empHead: '',
          gradeName: '',
          className: '',
          gradeId: '',
          classId: '',
          gender: 'MALE',
          remarks: '',
          isSend: 1,
          textarea: '',
          classIds: '',
          hireDate: moment().format('YYYY-MM-DD')
        },
        // 添加职工表单校验 ,谨记gradeName和className的类型
        addStaffFormRule: {
          classIds: [
            { required: true,  message: '请选择班级', trigger: 'blur' }
          ],
          empName: [
            { required: true, message: '请输入职工姓名', trigger: 'blur' },
            { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: validateTel, trigger: 'blur' }
          ],
          gradeName: [
            { required: true,  type: 'number',  message: '请选择年级', trigger: 'change' }
          ],
          className: [
            { required: true,  type: 'number',  message: '请选择班级', trigger: 'change' }
          ],
          hireDate: [
            { required: true,  message: '请选择入职时间', trigger: 'change' }
          ],
        },
    
        // 离职时间显示标识
        leaveFlag: false,
        // 修改职工表单
        editStaffForm: { 
          gender: '',
          classIds: '',
          hireDate: moment().format('YYYY-MM-DD'),
          leaveDate: null
        },
        // 修改职工表单校验
        editStaffFormRule: {
          classIds: [
            { required: true,  message: '请选择班级', trigger: 'blur' }
          ],  
          empName: [
            { required: true, message: '请输入职工姓名', trigger: 'blur' },
            { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
          ],
          gradeName: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
          className: [
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择在职状态', trigger: 'change' }
          ],
          hireDate: [
            { required: true, message: '请选择入职时间', trigger: 'change' }
          ],
          leaveDate: [
            { required: true,  message: '请选择离职时间', trigger: 'change' }
          ],
        },
        // 在离职状态数据
        statusList: [
          {
            value: '在职',
            label: 'JOB'
          }, {
            value: '离职',
            label: 'QUIT'
          }
        ],
        removeStaffForm: {}, // 删除职工表单
        hasGradeList: [] // 当前职工对应的班级数据
      }
    },
    mounted: function() {
      this._getAllStaffsData()
    },
    methods: {
      /** 
       * 获得当前所有的职工信息
       */
      _getAllStaffsData: function() {
        return requestGetStaffs().then( response => {
          if (response.code == 200) {
            this.staffListVisible = true
            this.staffList = response.data.list
          }
        })
      },

      /** 
       * 获得发送短信的标识
       */
      _changeSendValue: function() {
        this.SendValue ? (this.addStaffForm.isSend = 1) : (this.addStaffForm.isSend = 0)
      },

      /** 
       * 添加职工点击
       * @param {object} item: 当前的职工信息对象
       */
      _handleAdd: function(staff) {
        this.$refs['addStaffForm'].resetFields()
        // 调用班级年级联动的初始化方法
        this.$refs.gradeChangeBox._initEvent()
        this.tempTel = null
        this.staffAddVisible = true
      },

      /** 
       * 在职状态选择 
       */
      _statusChange: function(value) {
        this.editStaffForm.status = value.value
        if (value.value === 'QUIT') {
          this.leaveFlag = true
        } else this.leaveFlag = false
      },


      /** 
       * 添加职工确定
       */
      _handleAddStaff: function() { 
        this.$refs['addStaffForm'].validate((valid) => {
          if (valid) {
            this._addStaff()
          } 
        })
      },
      
      /** 
       * 添加职工请求 
       */
      _addStaff: function() {
        requestAddStaff(this.addStaffForm).then(response => {
          if(response.code === 200) {
            this.$VMessage('success', '职工添加成功')
            this.staffAddVisible = false
            // 重新获取数据
            this._getAllStaffsData()
          } else {
            this.$VMessage('error', '职工添加失败')
            this.staffAddVisible = false
            // 重新获取数据
            this._getAllStaffsData()
          }
        })
      },

      /** 
       * 修改员工图标点击
       * @param {object} staff: 当前的职工信息对象
       */
      _handleEdit: function(staff) {
        // console.log('staff:', staff)
        this.$refs['editStaffForm'].resetFields()
        this.$refs.EditgradeChangeBox._initEvent()
        this.hasGradeList = []

        this.editStaffForm.empName = staff.employeeName
        this.editStaffForm.employeeId = staff.employeeId
        this.editStaffForm.phone = staff.phone
        this.editStaffForm.gender = staff.gander
        this.editStaffForm.remarks = staff.remarks ? staff.remarks : null
        this.editStaffForm.status = staff.status
        this.editStaffForm.sendId = staff.send_id
        // 设置入职时间
        this.editStaffForm.hireDate = staff.hireDate ? staff.hireDate : moment().format('YYYY-MM-DD')
        // 设置在职状态
        this.leaveFlag = staff.status === 'JOB' ? false : true

        // 设置离职时间
        this.editStaffForm.leaveDate = staff.termDate 
        // 显示弹窗
        this.staffEditVisible = true
        
        // 设置当前的班级ID字符串
        let arr = []
        staff.classes.map(item => {
          if (item.classId) {
            arr.push(Number(item.classId))
          }
        })
        Array.from(new Set(arr)) 
        this.editStaffForm.classIds = arr.join(',')
        // 将职工的班级ID传递下去
        this.hasGradeList = [].concat(staff.classes)
      },

      /** 
       * 修改表单确定
       */
      _handleEditStaff: function() {
        // console.log('职工编辑:', this.editStaffForm)
        this.$refs['editStaffForm'].validate((valid) => {
          if (valid) {
            this._editStaff()
          } 
        })
      },

      /** 
       * 修改职工请求 
       */
      _editStaff: function() {
        requestPatchStaff(this.editStaffForm).then( response => {
          if(response.code === 200) {
            this.$VMessage('success', '职工修改成功')
            this.staffEditVisible = false
            // 重新获取数据
            this._getAllStaffsData()
          } else {
            this.$VMessage('error', '职工修改失败')
            this.staffEditVisible = false
          }
        })
      },

      /** 
       * 发送短信点击
       * @param {object} staff: 当前的职工信息对象     
       */
      _handleSendMessage: function(staff) {
        const param= {
          phone: staff.phone,
          sendId: staff.send_id
        }
        this._sendMessage(param)
      },

      /** 
       * 请求发送短信
       * @param {object}  
       */
      _sendMessage: function(param) {
        return requestSendMessage(param).then(response => {
          let code = response.code
          switch(code) {
            case 200:
              this.$VMessage('success', '短信发送成功')
              // 重新获取数据
              this._getAllStaffsData()
              break
            case 202:
              this.$VMessage('warn', '发送次数已达上限')
              // 重新获取数据
              this._getAllStaffsData()
            default: 
              this.$VMessage('error', '短信发送失败')
              // 重新获取数据
              this._getAllStaffsData()  
          }
        })
      },

      /** 
       * 删除当前职工
       * @param {object} staff: 当前的职工信息对象     
       */
      _handleRemove: function(staff) {
        this.staffRemoveVisible = true
        this.removeStaffForm.phone = staff.phone
        this.removeStaffForm.empName = staff.employeeName
      },

      /** 
       * 确定删除 
       */
      _handleRemoveStaff: function() {
        return requestDeleteStaff(this.removeStaffForm.phone).then( response => {
          if(response.code == 200) {
            this.$VMessage('success', '职工删除成功')
            this.staffRemoveVisible = false
            // 重新获取数据
            this._getAllStaffsData()
          } else {
            this.$VMessage('error', response.msg)
            this.staffEditVisible = false
          }
        })
      },

      /** 
       * 获取班级选择中的值
      */
      _getSelectedData: function(val) {
        let arr = []
        this.addStaffForm.classIds = ''
        this.editStaffForm.classIds = ''
        // 如果有值，遍历数据
        if (val.length) {
          val.map(item => {
            arr.push(Number(item.classId))
          })
          Array.from(new Set(arr))  
          // 如果点击的是添加职工
          if (this.staffAddVisible) {
            this.addStaffForm.classIds = arr.join(',')
            return
          }
          // 如果点击的是编辑职工
          if (this.staffEditVisible) {
            this.editStaffForm.classIds = arr.join(',')
            return
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'

  .staff-details
    position relative
    width 100%
    height 100%
    color #99601c
    .staff-header
      padding 30px 43px 10px 37px

    /* 数据列表头部 */
    .list-header
      margin 10px 37px 0 43px
      height 36px
      line-height 20px
      font-size 16px
      text-indent 10px
      border-bottom 1px solid #E0CFBA

    /* 数据列表内容 */
    .list-content
      position absolute
      top 126px
      left 0
      right 0
      bottom 10px
      overflow-y auto
      .list-padding 
        padding 0 43px 0 37px
      .list-item-nodata
        height 40px
        line-height 40px
        font-size 14px
      .list-item
        height 40px
        line-height 40px
        font-size 14px
        text-indent 16px
        &:hover
          background-color rgba(117,199,59,.15)
        &:hover .list-icon  
          display inline-block

      .list-item    
        /* 操作图标 */
        .list-icon
          display none
          color #75C73B
          font-size 18px
          vertical-align middle

        /* 职工状态样式 */
        .list-status
          box-sizing content-box
          display inline-block  
          width 100px
          height 24px
          line-height 24px
          border-radius 5px
          text-indent 0
          text-align center
          font-size 12px
          color white
        .status-unsend
          color #ccc
        .status-waite
          color #69c8ff
        .status-expired
          color #FF9902
        .status-job
          color #75C73B
        .status-quit
          color #F84B62
</style>
