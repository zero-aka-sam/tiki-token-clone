import React, { useState } from 'react';
import { BiSun } from 'react-icons/bi';
import { BsMoon } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Navbar({ setmodep, setsidebarp, address, dispatch }) {
    const [sideBar, setsideBar] = useState(false);

    const loadDividends = (e) => {
        e.preventDefault();
        dispatch({
            type: 'UPDATE_ADDRESS',
            payload: e.target.value,
        });
    };

    setsidebarp(sideBar);
    // console.log(sideBar)
    const [mode, setmode] = useState(true);
    setmodep(mode);
    // console.log(setmodep)
    function Mode() {
        if (mode === false) {
            return (
                <BsMoon
                    onClick={() => {
                        setmode(!mode);
                    }}
                    className="text-xl cursor-pointer focus:outline-none"
                />
            );
        }
        return (
            <BiSun
                onClick={() => {
                    setmode(!mode);
                }}
                className="text-xl cursor-pointer dark:text-white focus:outline-none"
            />
        );
    }
    return (
        <>
            <nav className="bg-gray-50 dark:bg-pink-800 shadow">
                <div className="flex flex-row justify-between  mx-auto items-center py-2  px-5 max-w-screen-lg ">
                    <div className="p-2 border border-pink-800  rounded">
                        <Mode />
                    </div>
                    <div className="rounded relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                        <input
                            type="text"
                            className="rounded py-2 border block w-full text-sm focus:outline-none dark:text-gray-600 form-input leading-5 focus:border-gray-700 dark:border-gray-700 focus:shadow-outline-purple dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-grey-300 pl-8 text-gray-800 focus:ring-2 focus:ring-gray-400"
                            placeholder="Paste your address here"
                            defaultValue={address}
                            onChange={(e) => {
                                loadDividends(e);
                            }}
                        />
                    </div>
                    <div>
                        <GiHamburgerMenu
                            onClick={() => {
                                setsideBar(!sideBar);
                            }}
                            className="cursor-pointer block lg:hidden text-2xl dark:text-white text-black m-1"
                        />
                    </div>
                </div>
            </nav>
        </>
    );
}
