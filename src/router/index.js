import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 登录
const Login = r => require.ensure([], () => r(require('page/login')), 'Login')

//编辑
const Editor = r => require.ensure([], () => r(require('page/editor-file/editor.vue')), 'Editor')
//预览
const Previewer = r => require.ensure([],() => r(require('page/previewer-file/previewer.vue')),'Previewer')

// 忘记密码
const ForgetPassword = r => require.ensure([], () => r(require('page/forget-password')), 'ForgetPassword')
const IdentityCheck = r => require.ensure([], () => r(require('page/forget-password/identity-check')), 'IdentityCheck')
const ResetPassword = r => require.ensure([], () => r(require('page/forget-password/reset-password')), 'ResetPassword')
const ResetComplete = r => require.ensure([], () => r(require('page/forget-password/reset-complete')), 'ResetComplete')

// 注册
const Register = r => require.ensure([], () => r(require('page/register')), 'Register')
const Authentication = r => require.ensure([], () => r(require('page/register/authentication')), 'Authentication')
const SetPassword = r => require.ensure([], () => r(require('page/register/set-password')), 'SetPassword')
const RegisterComplete = r => require.ensure([], () => r(require('page/register/register-complete')), 'RegisterComplete')

// 学生管理
const StudentManage = r => require.ensure([], () => r(require('page/student-manage')), 'StudentManage')
const StudentManageContent = r => require.ensure([], () => r(require('page/student-manage/student-manage-content')), 'StudentManageContent')

// 教学管理
const TeachingManage = r => require.ensure([], () => r(require('page/teaching-manage')), 'TeachingManage')
const CourseTableManage = r => require.ensure([], () => r(require('page/teaching-manage/course-table-manage')), 'CourseTableManage')
const PrepareLessonBoard = r => require.ensure([], () => r(require('page/teaching-manage/prepare-lesson-board')), 'PrepareLessonBoard')
const PrepareLessonDetail = r => require.ensure([], () => r(require('page/teaching-manage/prepare-lesson-detail')), 'PrepareLessonDetail')

// 职工管理
const StaffManagement = r => require.ensure([], () => r(require('page/staff-management')), 'StaffManagement')
const StaffDetails = r => require.ensure([], () => r(require('page/staff-management/staff-details')), 'StaffDetails')
const TodayAttendance = r => require.ensure([], () => r(require('page/staff-management/today-attendance')), 'TodayAttendance')
const MonthReport = r => require.ensure([], () => r(require('page/staff-management/month-report')), 'MonthReport')
const AttendanceDetail = r => require.ensure([], () => r(require('page/staff-management/attendance-detail')), 'AttendanceDetail')


// 控制中心
const ControlCenter = r => require.ensure([], () => r(require('page/control-center')), 'ControlCenter')
const GardenInfo = r => require.ensure([], () => r(require('page/control-center/garden-info')), 'GardenInfo')

// 办公管理
const OfficeManage = r => require.ensure([], () => r(require('page/office-manage')), 'OfficeManage')
const GardenDocument = r => require.ensure([], () => r(require('page/office-manage/garden-document')), 'GardenDocument')
const TemplateManage = r => require.ensure([], () => r(require('page/office-manage/template-manage')), 'TemplateManage')
const ClassifyFileManage = r => require.ensure([],() => r(require('page/office-manage/classify-file-manage')),'ClassifyFileManage')

// 财务管理
const FinanceManage = r => require.ensure([], () => r(require('page/finance-manage')), 'FinanceManage')
const FinanceExcel = r => require.ensure([], () => r(require('page/finance-manage/finance-excel')), 'FinanceExcel') // demo
const ChargePlan = r => require.ensure([],() => r(require('page/finance-manage/charge-plan')),'ChargePlan') // 计划
const AddChargePlan = r => require.ensure([],() => r(require('page/finance-manage/charge-plan/addplan')),'AddChargePlan') // 添加计划
const ChargeIn = r => require.ensure([],() => r(require('page/finance-manage/charge-in')),'ChargeIn') // 收费
const ChargeSetting = r => require.ensure([],() => r(require('page/finance-manage/charge-setting')),'ChargeSetting') // 收费设置
const ChargeSettingDetail = r => require.ensure([],() => r(require('page/finance-manage/charge-setting-detail')),'ChargeSettingDetail') // 收费设置
const RefundIn = r => require.ensure([],() => r(require('page/finance-manage/refund-in')),'RefundIn') // 退费
const RefundLeave = r => require.ensure([],() => r(require('page/finance-manage/refund-leave')),'RefundLeave') // 请假管理
const RefundSetting = r => require.ensure([],() => r(require('page/finance-manage/refund-setting')),'RefundSetting') // 退费设置
const ReportformsIncome = r => require.ensure([],() => r(require('page/finance-manage/reportforms-income')),'ReportformsIncome') // 收入
const ReportformsExpenses = r => require.ensure([],() => r(require('page/finance-manage/reportforms-expenses')),'ReportformsExpenses') // 支出

// demo-首页
const DemoHome = r => require.ensure([], () => r(require('page/demo-home')), 'DemoHome')
// demo-园长
const DemoKinderInfo = r => require.ensure([], () => r(require('page/demo-kinderInfo')), 'DemoKinderInfo')
// demo-园所
const DemoGardenInfo = r => require.ensure([], () => r(require('page/demo-gardenInfo')), 'DemoGardenInfo')

// 路由对象
const routers = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: ForgetPassword,
    redirect: '/forget-password/identity-check',
    children: [
      {
        path: 'identity-check',
        name: 'identity-check',
        component: IdentityCheck,
        meta: {
          title: '填写信息'
        }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: '重置密码'
        }
      },
      {
        path: 'reset-complete',
        name: 'reset-complete',
        component: ResetComplete,
        meta: {
          title: '完成'
        }
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    redirect: '/register/authentication',
    children: [
      {
        path: 'authentication',
        name: 'authentication',
        component: Authentication,
        meta: {
          title: '填写信息'
        }
      },
      {
        path: 'set-password',
        name: 'set-password',
        component: SetPassword,
        meta: {
          title: '设置密码'
        }
      },
      {
        path: 'register-complete',
        name: 'register-complete',
        component: RegisterComplete,
        meta: {
          title: '完成'
        }
      }
    ]
  },
  {
    path: '/student-manage',
    name: 'student-manage',
    component: StudentManage,
    meta: {
      title: '学生管理',
      requireAuth: true
    },
    children: [
      {
        path: ':gradeId/:classId',
        name: 'student-detail',
        component: StudentManageContent,
        meta: {
          title: '学生管理',
          requireAuth: true
        },
      }
    ]
  },
  {
    path: '/teaching-manage',
    name: 'teaching-manage',
    component: TeachingManage,
    meta: {
      title: '课表管理',
      requireAuth: true
    },
    children: [
      {
        path: 'course-table-manage/:gradeId',
        name: 'course-table-manage',
        component: CourseTableManage,
        meta: {
          mark: 'course-table-manage',
          title: '课表管理',
          requireAuth: true
        }
      },
      {
        path: 'prepare-lesson-board',
        name: 'prepare-lesson-board',
        component: PrepareLessonBoard,
        meta: {
          mark: 'prepare-lesson-manage',
          title: '备课看板',
          requireAuth: true
        }
      },
      {
        path: 'prepare-lesson-detail',
        name: 'prepare-lesson-detail',
        component: PrepareLessonDetail,
        meta: {
          mark: 'prepare-lesson-manage',
          title: '备课明细',
          requireAuth: true
        }
      },
    ]
  },
  {
    path: '/staff-management',
    name: 'staff-management',
    component: StaffManagement,
    redirect: '/staff-management/staff-details',
    children: [
      {
        path: 'staff-details',
        name: 'staff-details',
        component: StaffDetails,
        meta: {
          mark: 'staff-detail-manage',
          title: '职工明细',
          requireAuth: true
        }
      },
      {
        path: 'today-attendance',
        name: 'today-attendance',
        component: TodayAttendance,
        meta: {
          mark: 'staff-attendance-manage',
          title: '今日考勤',
          requireAuth: true
        }
      },
      {
        path: 'month-report',
        name: 'month-report',
        component: MonthReport,
        meta: {
          mark: 'staff-attendance-manage',
          title: '月度报表',
          requireAuth: true
        }
      },
      {
        path: 'attendance-detail',
        name: 'attendance-detail',
        component: AttendanceDetail,
        meta: {
          mark: 'staff-attendance-manage',
          title: '考勤明细',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/control-center',
    name: 'control-center',
    component: ControlCenter,
    redirect: '/control-center/garden-info',
    children: [
      {
        path: 'garden-info',
        name: 'garden-info',
        component: GardenInfo,
        meta: {
          title: '园所信息',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/office-manage',
    name: 'office-manage',
    component: OfficeManage,
    redirect: '/office-manage/garden-document',
    children: [
      {
        path: 'garden-document',
        name: 'garden-document',
        component: GardenDocument,
        meta: {
          title: '全园文档',
          requireAuth: true
        }
      },
      {
        path: 'template-manage',
        name: 'template-manage',
        component: TemplateManage,
        meta: {
          title: '模板管理',
          requireAuth: true
        }
      },
      {
        path:'classify-file-mange',
        name:'classify-file-mange',
        component:ClassifyFileManage,
        meta:{
          title:'文档分类',
          requireAuth:true
        }
      }
    ]
  },
  {
    path: '/finance-manage',
    name: 'finance-manage',
    component: FinanceManage,
    redirect: '/finance-manage/charge-plan',
    children: [
      {
        path: 'charge-plan',
        name: 'charge-plan',
        component: ChargePlan,
        meta: {
          mark: 'finance-income-manage',
          title: '计划',
          requireAuth: true
        }
      },
      {
        path: 'charge-plan-add',
        name: 'charge-plan-add',
        component: AddChargePlan,
        meta: {
          mark: 'finance-income-manage',
          title: '计划',
          requireAuth: true
        }
      },
      
      {
        path: 'charge-in',
        name: 'charge-in',
        component: ChargeIn,
        meta: {
          mark: 'finance-income-manage',
          title: '收费',
          requireAuth: true
        }
      },
      {
        path: 'charge-setting',
        name: 'charge-setting',
        component: ChargeSetting,
        meta: {
          mark: 'finance-income-manage',
          title: '设置',
          requireAuth: true
        }
      },
      {
        path: 'charge-setting-detail',
        name: 'charge-setting-detail',
        component: ChargeSettingDetail,
        meta: {
          mark: 'finance-income-manage',
          title: '明细',
          requireAuth: true
        }
      },
      {
        path: 'refund-in',
        name: 'refund-in',
        component: RefundIn,
        meta: {
          mark: 'finance-refund-manage',
          title: '退费',
          requireAuth: true
        }
      },
      {
        path: 'refund-leave',
        name: 'refund-leave',
        component: RefundLeave,
        meta: {
          mark: 'finance-refund-manage',
          title: '请假管理',
          requireAuth: true
        }
      },
      {
        path: 'refund-setting',
        name: 'refund-setting',
        component: RefundSetting,
        meta: {
          mark: 'finance-refund-manage',
          title: '退费设置',
          requireAuth: true
        }
      },
      {
        path: 'reportforms-income',
        name: 'reportforms-income',
        component: ReportformsIncome,
        meta: {
          mark: 'finance-report-manage',
          title: '收入',
          requireAuth: true
        }
      },
      {
        path: 'reportforms-expenses',
        name: 'reportforms-expenses',
        component: ReportformsExpenses,
        meta: {
          mark: 'finance-report-manage',
          title: '支出',
          requireAuth: true
        }
      },
      {
        path: 'finance-excel',
        name: 'finance-excel',
        component: FinanceExcel,
        meta: {
          title: '财务报表',
          requireAuth: true
        }
      },
    ]
  },
  {
    path: '/editor',
    name:'editor',
    component: Editor,
    meta:{
      title: '编辑',
      requireAuth:true
    }
  },
  {
    path:'/previewer',
    name:'preview',
    component: Previewer,
    meta:{
      title: '预览',
      requireAuth:true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: DemoHome,
    meta: {
      title: '首页',
      requireAuth: true
    }
  },
  {
    path: '/kinder-info',
    name: 'kinder-info',
    component: DemoKinderInfo,
    meta: {
      title: '园长信息',
      requireAuth: true
    }
  },
  {
    path: '/gardens-info',
    name: 'gardens-info',
    component: DemoGardenInfo,
    meta: {
      title: '园所信息',
      requireAuth: true
    }
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new Router({
  linkActiveClass: 'router-active',
  routes: routers
})

export default router