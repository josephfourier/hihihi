const menus = {
  'code': 1,
  'message': 'success',
  'data': [
    { 'permissionId': 139, 'systemId': 28, 'pid': 0, 'name': '学工系统', 'type': 0, 'permissionValue': '', 'uri': '', 'icon': '', 'status': 1, 'ctime': 1519884912469, 'orders': 1519884912469 },
    { 'permissionId': 140, 'systemId': 28, 'pid': 0, 'name': '综合管理', 'type': 1, 'permissionValue': '', 'uri': '', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519884944276, 'orders': 1519884944276 },
    { 'permissionId': 141, 'systemId': 28, 'pid': 0, 'name': '奖惩管理', 'type': 1, 'permissionValue': '', 'uri': '', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519884959227, 'orders': 1519884959227 },
    { 'permissionId': 142, 'systemId': 28, 'pid': 0, 'name': '资助管理', 'type': 1, 'permissionValue': '', 'uri': '', 'icon': 'zjy-icon zjy-icon-fund', 'status': 1, 'ctime': 1519884975049, 'orders': 1519884975049 },
    { 'permissionId': 128, 'systemId': 28, 'pid': 142, 'name': '资助管理子项', 'type': 2, 'permissionValue': '', 'uri': '/test/test', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519884975049, 'orders': 1519884975049 },
    { 'permissionId': 128, 'systemId': 28, 'pid': 142, 'name': '资助管理子项2', 'type': 2, 'permissionValue': '', 'uri': '/test/test2', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519884975049, 'orders': 1519884975049 },
    { 'permissionId': 143, 'systemId': 28, 'pid': 143, 'name': '统计分析', 'type': 2, 'permissionValue': '', 'uri': '/statistical/index', 'icon': '', 'status': 1, 'ctime': 1519885027337, 'orders': 1519885027337 },
    { 'permissionId': 143, 'systemId': 28, 'pid': 0, 'name': '统计与分析', 'type': 1, 'permissionValue': '', 'uri': '', 'icon': 'zjy-icon zjy-icon-statistical', 'status': 1, 'ctime': 1519885027337, 'orders': 1519885027337 },
    { 'permissionId': 144, 'systemId': 28, 'pid': 0, 'name': '基础配置', 'type': 1, 'permissionValue': '', 'uri': '', 'icon': 'zjy-icon zjy-icon-basic', 'status': 1, 'ctime': 1519885059765, 'orders': 1519885059765 },
    { 'permissionId': 145, 'systemId': 28, 'pid': 144, 'name': '账号权限管理', 'type': 2, 'permissionValue': 'swms:permission:read', 'uri': '/accountpermission/index', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519885237262, 'orders': 1519885237262 },
    { 'permissionId': 146, 'systemId': 28, 'pid': 144, 'name': '流程审批设置', 'type': 2, 'permissionValue': 'swms:approvalprocess:read', 'uri': '/approvalprocess/index', 'icon': 'zmdi zmdi-widgets', 'status': 1, 'ctime': 1519885368136, 'orders': 1519885368136 }
  ]
}
export default {
  getAccessed () {
    return menus
  }
}
