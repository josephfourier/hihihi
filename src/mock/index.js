import Mock from 'mockjs'
import userAPI from './user'

Mock.mock(/\/manage\/menu/, userAPI.getAccessed)

export default Mock
