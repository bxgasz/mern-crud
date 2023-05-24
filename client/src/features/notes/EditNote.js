import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetNotesQuery } from './notesApiSlice'
import EditNoteForm from './EditNoteForm'
import Spinner from '../../component/Spinner'
import useAuth from '../../hooks/useAuth'
import { useGetUsersQuery } from '../users/usersApiSlice'

const EditNote = () => {
  const { id } = useParams()
  const { username, isManager, isAdmin } = useAuth()

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    })
  })

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    })
  })

  if (!note || !users?.length) return <Spinner/>

  if (!isManager || !isAdmin) {
    if (note.username !== username) {
      return <p>No Access</p>
    }
  }

  const content = note && users ? <EditNoteForm note={note} users={users}/> : <Spinner />

  return content
}

export default EditNote