import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import mySaga from './action/action'
const logger = createLogger()
const sagaMiddleware = createSagaMiddleware()

const store = createStore(reducers, applyMiddleware(logger,sagaMiddleware))

sagaMiddleware.run(mySaga)
export default store