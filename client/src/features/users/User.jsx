import React, {memo, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useDeleteUserMutation, useGetUsersQuery } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const User = ({ userId, number }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId]
    })
  })

  const navigate = useNavigate()

  const [deleteUser, {
    isSuccess,
    isError,
    error
  }] = useDeleteUserMutation()

  const onDeleteUserClicked = async(e) => {
    await deleteUser({ id: userId })
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/dash/users')
    }
  },[isSuccess, navigate])

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`)
    const userRolesString = user.roles.toString().replaceAll(',', ', ')
    const cellStatus = user.active ? '' : 'opacity-80'

    return (
        <tr className="border-b dark:border-neutral-500">
            <td className="whitespace-nowrap  px-6 py-4 font-medium">{number +1}</td>
            <td className="whitespace-nowrap  px-6 py-4">{user.username}</td>
            <td className="whitespace-nowrap  px-6 py-4">{userRolesString}</td>
            <td className="whitespace-nowrap  px-6 py-4">
                <button className="bg-cyan-500 p-2 px-3 text-white hover:bg-cyan-600 ease-in-out duration-500 rounded mr-1" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare}/>
                </button>
                <button className="bg-red-500 p-2 px-3 text-white hover:bg-red-600 ease-in-out duration-500 rounded" onClick={onDeleteUserClicked}>
                    <FontAwesomeIcon icon={faTrashCan}/>
                </button>
            </td>
        </tr>
      )
  } else return null
}
const memoizedUser = memo(User)
export default memoizedUser