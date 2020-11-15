import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer,
        productDetailReducer
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userUpdateProfileReducer
} from './reducers/userReducers'
import {
    orderCreateReducer,
    orderDetailsReducer,
    orderPayReducer,
    orderMyListReducer
} from './reducers/orderReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMyList: orderMyListReducer,
})
const cartItemsFromStorage = localStorage.getItem('cartItems') === 'undefined' || 'null'
    ? []
    : JSON.parse(localStorage.getItem('cartItems'))
  
const userInfoFromStorage = localStorage.getItem('userInfo') === 'undefined' || 'null'
    ? null
    : JSON.parse(localStorage.getItem('userInfo'))

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    === {} || 'null'
    ? {}
    : JSON.parse(localStorage.getItem('shippingAddress'))

 //   console.log(localStorage.getItem('cartItems'));
const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: {
        userInfo: userInfoFromStorage
    }
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(
    applyMiddleware(...middleware)));

export default store



