// import 'tailwindcss/tailwind.css'

import { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { AddressContext } from '../store/addressContext';
import AddressReducer from '../store/addressReducer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    const [address, dispatch] = useReducer(AddressReducer);

    useEffect(() => {
        if (!address)
            dispatch({
                type: 'UPDATE_ADDRESS',

                payload: window.ethereum.selectedAddress,
            });
    }, []);

    return (
        <AddressContext.Provider value={{ state: address, dispatch }}>
            <>
                <Layout dispatch={dispatch} address={address}>
                    <Component address={address} {...pageProps} />
                </Layout>
            </>
        </AddressContext.Provider>
    );
}

export default MyApp;
