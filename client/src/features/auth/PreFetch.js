import React, { useEffect } from 'react'
import { store } from '../../app/store'
import { notesApiSLice } from '../notes/notesApiSlice'
import { usersApiSLice } from '../users/usersApiSlice'
import { Outlet } from 'react-router-dom'

const PreFetch = () => {
  
  useEffect(() => {
    store.dispatch(notesApiSLice.util.prefetch('getNotes', 'notesList', { force: true }))
    store.dispatch(usersApiSLice.util.prefetch('getUsers', 'usersList', { force: true }))
  }, [])

  return <Outlet/>
}

export default PreFetch