// import 'tailwindcss/tailwind.css'
import { useEffect, useReducer } from 'react'
import '../styles/globals.css'
import Layout from '../components/Layout'

import { AddressContext } from '../store/addressContext'
import  AddressReducer from '../store/addressReducer'

function MyApp({ Component, pageProps }) {

  const [address, dispatch] = useReducer(AddressReducer)

  useEffect(() => {
    if (!address)
    {
      dispatch({
        type: 'UPDATE_ADDRESS',
        payload: window.ethereum.selectedAddress
      })
      }
  },[])

  return (
    <AddressContext.Provider value={{ state: address, dispatch: dispatch }}>
    <>
      <Layout dispatch={dispatch} address={address} >
        <Component address={address} {...pageProps} />
      </Layout>
    </>
    </AddressContext.Provider>
  )
}

export default MyApp
