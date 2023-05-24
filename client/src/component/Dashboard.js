import React from 'react'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const Dashboard = () => {
  return (
    <>
      <DashHeader/>
        <div className='h-[34rem] '>
          <Outlet />
        </div>
      <DashFooter />
    </>
  )
}

export default Dashboard