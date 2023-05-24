import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons'
import Spinner from './Spinner'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/notes(\/)?$/

const DashHeader = () => {
  const [nav, setNav] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const {isManager, isAdmin} = useAuth()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  const handleNav = () => {
    setNav(!nav)
  } 

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  const onLogoutClicked = () => sendLogout()

  if (isLoading) return <Spinner/>
  if (isError) return <p>Error: { error.message }</p>

  return (
    <header>
        <div className="text-white flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4">
          <Link to='/dash'>
            <h1 className="w-full text-3xl font-bold text-cyan-300">MERN.APP</h1>
          </Link>
          <ul className="hidden md:flex font-bold">
            <li className="p-4">
              <Link to="/dash">
                <p>Welcome</p>
              </Link>
            </li>
            { (isManager || isAdmin) && 
            <li className="p-4">
              <Link to="/dash/users">
                Users
              </Link>
            </li>
            }
            <li className="p-4">
              <Link to="/dash/notes">
                Notes
              </Link>
            </li>
            <li className="p-4 font-bold">
            <button onClick={onLogoutClicked} className="text-red-500 hover:text-red-800 rounded-md ease-in-out duration-300">Logout</button>
            </li>
          </ul>
          <div onClick={handleNav} className=' md:hidden'>
            {!nav ? <FontAwesomeIcon icon={faClose} className='text-2xl'/> : <FontAwesomeIcon icon={faBars} className='text-2xl'/>}
          </div>
          <div className={!nav ? 'fixed left-0 top-0 border-r w-[50%] lg:w-[25%] h-full border-r-blue-950 bg-[#111827] ease-in-out duration-500' : 'fixed top-0 h-full w-[50%] left-[-100%] ease-in-out duration-500' }>
            <h1 className="w-full text-3xl font-bold text-cyan-300 p-4 mt-4">MERN.APP</h1>
            <ul className="p-4 uppercase">
            <li className="p-4">
              <Link to="/dash" onClick={handleNav}>
                <p>Welcome</p>
              </Link>
            </li>
            <li className="p-4">
              <Link to="/dash/users" onClick={handleNav}>
                Users
              </Link>
            </li>
            <li className="p-4">
              <Link to="/dash/notes" onClick={handleNav}>
                Notes
              </Link>
            </li>
            <li className="p-4 font-bold">
            <button onClick={onLogoutClicked} className="text-red-500 hover:text-red-800 rounded-md ease-in-out duration-300">Logout</button>
            </li>
            </ul>
          </div>
        </div>
      </header>
  )
}

export default DashHeader