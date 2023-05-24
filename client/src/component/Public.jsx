import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Typed from 'react-typed'

const Public = () => {
  const [nav, setNav] = useState(true)

  const handleNav = () => {
    setNav(!nav)
  }
  
  return (
    <div className="">
      <header>
        <div className="text-white flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4">
          <h1 className="w-full text-3xl font-bold text-cyan-300">MERN.APP</h1>
          <ul className="hidden md:flex font-bold">
            <li className="p-4">
              <Link to="/login">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ease-in-out duration-300">Login</button>
              </Link>
            </li>
            <li className="p-4">
              <Link to="/">
                <button className="py-2 px-5 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md ease-in-out duration-300 font-bold">Register</button>
              </Link>
            </li>
          </ul>
          <div onClick={handleNav} className=' md:hidden'>
            {!nav ? <FontAwesomeIcon icon={faClose} className='text-2xl'/> : <FontAwesomeIcon icon={faBars} className='text-2xl'/>}
          </div>
          <div className={!nav ? 'fixed left-0 top-0 border-r w-[50%] lg:w-[25%] h-full border-r-blue-950 bg-[#111827] ease-in-out duration-500' : 'fixed top-0 h-full w-[50%] left-[-100%] ease-in-out duration-500' }>
            <h1 className="w-full text-3xl font-bold text-cyan-300 p-4 mt-4">MERN.APP</h1>
            <ul className="p-4 uppercase">
              <li className="py-4 border-b border-cyan-100">
                <Link to="/login">Login</Link>
              </li>
              <li className="py-4">Register</li>
            </ul>
          </div>
        </div>
      </header>
      
      <section className="hero">
        <div className="text-white">
          <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
            <p className='text-cyan-300 font-bold p-2'>Training with small project</p>
            <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-2'>MERN APP</h1>
            <div className="flex justify-center items-center py-2">
              <p className="md:text-5xl sm:text-4xl text-xl font-bold">Learning By</p>
              <Typed strings={['Doing..', 'Watching..', 'Hearing..']} className="md:text-5xl sm:text-4xl text-xl font-bold pl-2" typeSpeed={120} backSpeed={140} loop/>
            </div>
            <p className="md:text-2xl text-xl font-bold text-white opacity-25 pt-2">By Building this small project i finish with my MERN crash course</p>
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-700 text-[#0F172A] font-bold py-2 px-4 rounded-md ease-in-out duration-300 w-[200px] mx-auto my-4">Get Started</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Public