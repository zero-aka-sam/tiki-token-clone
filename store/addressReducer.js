const AddressReducer = (state, action) => {
   const { type, payload } = action
   switch (type) {
      default:
         return null
     case 'UPDATE_ADDRESS':
       console.log('in reducer', payload)
         return payload
     case 'LOG_OUT':
         return {
            ...state,
            isLoggedIn: false,
         }
      case 'RESET_PASSWORD':
         console.log('resetting password')
         return {
            ...state,
            isLoggedIn: false,
         }
      case 'SIGNUP':
         console.log('signing up')
         return {
            ...state,
            isLoggedIn: false,
         }
   }
}

export default AddressReducer