import { FaHome } from 'react-icons/fa'
import { RiDeviceRecoverLine } from 'react-icons/ri'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
export default function Aside({ setsidebarp }) {
    const [sideBari, setsideBari] = useState(false)
    setsidebarp(sideBari)
    const [light, setlight] = useState(true)
    const { asPath, pathname } = useRouter();
    useEffect(() => {

        if (pathname === "/") {
            setlight(true)
        } else {
            setlight(false)
        }
    }, [pathname])
    useEffect(() => {
        setsidebarp(sideBari)
    
    }, [sideBari])

    return (
        <>
            <aside className="z-30  bg-white dark:bg-pink-800 ">
                <div className="py-4 text-gray-500 dark:text-gray-100">
                    <a className="flex ml-6 text-lg font-bold text-gray-800 dark:text-gray-100" href="">
                        <img className="mr-2 w-10 h-10" src="BABYMINIDOGE_002-1.png" />
                        <span className="self-center">MINIBABYDOGE</span>
                    </a>

                    <ul className="mt-6">
                        <li className="relative px-6 py-3">
                            <Link href="/">
                                <a   className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${light ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"} `} >
                                    <FaHome />
                                    <span className="ml-4">Dashboard</span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                    <ul className="mt-6">
                        <li className="relative px-6 py-3">
                            <Link href="/recovery">
                                <a  onClick={(e)=>{ setsideBar(!sideBari); e.preventDefault() }} className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${light ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"} `} >
                                    <RiDeviceRecoverLine />
                                    <span className="ml-4">Recovery</span>
                                </a>
                            </Link>
                        </li>
                    </ul>

                </div>
            </aside>
        </>
    )
}
