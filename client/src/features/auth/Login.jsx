import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faCircleExclamation, faBackward } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Spinner from '../../component/Spinner'
import { useLoginMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import usePersist from '../../hooks/usePersist'

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = (e) => setPersist(prev => !prev)

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({accessToken}))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  if (isLoading) return <Spinner />

  const content =  (
    <section className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-96 bg-white shadow-md rounded-md p-4">
        <div className="font-bold text-2xl text-[#0F172A] flex justify-center mt-5">
          <h1>Login</h1>
        </div>
        <hr className="mt-2 h-1 w-32 bg-blue-500 rounded mx-auto" />
        {errMsg && <div className="error w-full mt-4 h-15 p-2 rounded font-bold text-red-500 bg-red-300 border border-red-400" ref={errRef} aria-live='assertive'>{errMsg} <FontAwesomeIcon icon={faCircleExclamation}/></div>}
        <div className="py-4">
          <form action="" className="mt-2 flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="text" className="flex-shrink flex-grow flex-auto leading-normal w-px h-10 border-grey-light rounded pl-14 pr-2 self-center relative text-md outline-none border-2 border-white focus:border-blue-500" placeholder="Username" value={username} onChange={handleUserInput} autoComplete='off' ref={userRef} required/>
              <span className="flex items-center leading-normal px-3 border-0 text-2xl absolute">
                <FontAwesomeIcon icon={faUser} className='text-md text-blue-600'/>
              </span>
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="password" className="flex-shrink flex-grow flex-auto leading-normal w-px h-10 border-grey-light rounded pl-14 pr-2 self-center relative text-md outline-none border-2 border-white focus:border-blue-500" placeholder="Password" value={password} onChange={handlePwdInput} required/>
              <span className="flex items-center leading-normal px-3 border-0 text-2xl absolute">
                <FontAwesomeIcon icon={faLock} className='text-md text-blue-600'/>
              </span>
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <label htmlFor="persist">
                <input type="checkbox" name="" id="persist" onChange={handleToggle} checked={persist} />
                Trush This Device
              </label>

              {/* <label
                class="relative flex cursor-pointer items-center rounded-full p-3"
                for="checkbox"
                data-ripple-dark="true"
              >
                <input
                  type="checkbox"
                  class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:bg-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                  id="checkbox"
                  
                />
                <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </label> */}
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full ease-in-out duration-300 mx-auto my-4">Login</button>

          </form>
        </div>
      </div>

      <div className="w-96 h-10 bg-white shadow-md rounded mx-auto mt-3">
        <div className="text-center p-2 font-semibold hover:text-zinc-700 active:text-blue-500 ease-in-out duration-200">
          <Link to='/'>
            Back to the welcome page <FontAwesomeIcon icon={faBackward}/>
          </Link>
        </div>
      </div>
    </section>
  )

  return content
}

export default Login
