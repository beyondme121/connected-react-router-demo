import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import rootSaga from './rootSaga'
let sagaMiddleware = createSagaMiddleware() // 创建中间件
let store = applyMiddleware(sagaMiddleware)(createStore)(reducers)
sagaMiddleware.run(rootSaga)

export default store


// import {createStore, applyMiddleware} from 'redux';
// import reducer from './reducer';
// import createSagaMiddleware from 'redux-saga';
// import rootSaga from './sagas';
// let sagaMiddleware=createSagaMiddleware();
// let store=applyMiddleware(sagaMiddleware)(createStore)(reducer);
// sagaMiddleware.run(rootSaga);
// window.store=store;
// export default store;