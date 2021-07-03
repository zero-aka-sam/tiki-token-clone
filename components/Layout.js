import Navbar from './Navbar'
import { useState } from 'react'
import Aside from './Aside'

export default function Layout({ children, dispatch, address }) {
  const [modep, setmodep] = useState(true)
  const [sidebarp, setsidebarp] = useState(false)


  return (
    <div className={modep ? "dark h-screen" : " h-screen"}>
      <div className="flex  bg-gray-50 dark:bg-gray-900 ">
        <div className={`z-30 flex-shrink-0  w-64  bg-white dark:bg-gray-800 fixed lg:block h-screen  lg:relative -mt-11 top-10 transition-all duration-1000  ${sidebarp?" lg:left-0 left-0 ":"lg:left-0 -left-96"}`}>
          <Aside setsidebarp={setsidebarp} />
        </div>
        <div className="flex flex-col flex-1 w-full h-screen ">
          <div className=" dark:bg-gray-900 bg-gray-50 ">
              <Navbar dispatch={dispatch} address={address} setmodep={setmodep} setsidebarp={setsidebarp}/>
          {children}
          </div>
     
        </div>

      </div>
      </div>
  )
}