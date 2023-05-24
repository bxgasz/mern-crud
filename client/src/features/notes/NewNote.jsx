import React from 'react'
import NewNoteForm from './NewNoteForm'
import Spinner from '../../component/Spinner'
import { useGetUsersQuery } from '../users/usersApiSlice'

const NewNote = () => {
  const { users } = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => {
      user: data?.ids.map(id => data?.entities[id])
    }
  })

  if (!users?.length) return <Spinner/>
  const content = <NewNoteForm users={users}/>
  return content
}

export default NewNote