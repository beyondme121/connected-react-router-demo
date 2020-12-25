import { take, put } from 'redux-saga/effects'
import * as types from './action-types'
export default function * rootSage () {
  // 订阅
  yield take(types.ASYNC_ADD)
  // 触发订阅
  yield put({type: types.ADD})
}

// import {put,take} from 'redux-saga/effects';
// import * as types from './action-types';

// export default function* rootSaga() {
//     for (let i=0;i<3;i++){
//         yield take(types.ASYNC_ADD);
//         yield put({type:types.ADD});
//     }
//     console.log('已经达到最大值');
// }