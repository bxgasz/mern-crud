import React from 'react'
import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import Spinner from '../../component/Spinner'
import { useGetUsersQuery } from './usersApiSlice'

const EditUser = () => {
  const { id } = useParams()

  const { user } = useGetUsersQuery("userList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id]
    })
  })

  if(!user) return <Spinner/>
  const content = <EditUserForm user={user}/>
  return content
}

export default EditUser