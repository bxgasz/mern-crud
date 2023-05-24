import React, { useEffect, useRef, useState } from 'react'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Link, Outlet } from 'react-router-dom'
import Spinner from '../../component/Spinner'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effetcRan = useRef(false)
  
  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, {
    isUninitialized,
    isLoading,
    isSuccess,
    isError,
    error
  }] = useRefreshMutation()
  
  useEffect(() => {
    if (effetcRan.current === true || process.env.NODE_ENV !== 'development') {
        const verifyRefreshToken = async () => {
            console.log('verifying refresh token')
            try {
                await refresh()
                setTrueSuccess(true)
            } catch (error) {
                console.log(error)
            }
        }
        if (!token && persist) verifyRefreshToken()
    }
    return () => effetcRan.current = true
  }, [])

  let content
  if (!persist) {
    console.log('no persist')
    content = <Outlet/>
  } if (isLoading) {
    console.log('loading')
    content = <Spinner/>
  } if (isError) {
    console.log('error')
    content = (
        <p>{error?.data?.message} <Link to='/login'>Please Login Again</Link></p>
    )
  }  if (isSuccess && trueSuccess) {
    console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    console.log('token and uinit')
    console.log(isUninitialized)
    content = <Outlet/>
  }

  return content
}

export default PersistLogin