import React from 'react'
import Typed from 'react-typed'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

  const { username, status } = useAuth()
  
  return (
    <div className='h-[34rem] w-full flex flex-col justify-center items-center'>
      <Typed strings={['Welcome..']} className="md:text-5xl sm:text-4xl text-xl font-bold pl-2 text-cyan-500" typeSpeed={120} backSpeed={140} loop/>
      <div className='text-white font-bold mt-2'>
        <p>{username} as {status}</p>
      </div>
    </div>
  )
}

export default Welcome