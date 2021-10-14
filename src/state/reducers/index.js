import { combineReducers } from 'redux'
import blockDataReducer from './blockDataReducer'

const reducers = combineReducers({
  blockData: blockDataReducer
})

export default reducers