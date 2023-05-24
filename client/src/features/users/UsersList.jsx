import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import User from './User'
import { Link } from 'react-router-dom'
import Spinner from '../../component/Spinner'

const UsersList = () => {
  let content = null

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('userList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  if (isLoading) content = <Spinner/>
  if (isError) {
    content = (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <Link to='/dash/users/new'>
              <button className="bg-blue-500 p-2 px-3 my-3 text-white hover:bg-blue-600 ease-in-out duration-500 rounded font-bold">
                  Add New Users
              </button>
            </Link>
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead
                  className="border-b font-medium text-white">
                  <tr>
                    <th scope="col" className=" px-6 py-4">#</th>
                    <th scope="col" className=" px-6 py-4">Username</th>
                    <th scope="col" className=" px-6 py-4">Roles</th>
                    <th scope="col" className=" px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className='text-white'>
                  <tr>
                    <td colSpan="7" className='py-5 font-bold'>{error?.data?.message}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>  
    )
  }

  if (isSuccess) {
    const { ids } = users
    
    const tableContent = ids?.length && ids.map((userId, index) => <User key={userId} userId={userId} number={index}/>)

    content = (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <Link to='/dash/users/new'>
              <button className="bg-blue-500 p-2 px-3 my-3 text-white hover:bg-blue-600 ease-in-out duration-500 rounded font-bold">
                  Add New Users
              </button>
            </Link>
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead
                  className="border-b font-medium text-white">
                  <tr>
                    <th scope="col" className=" px-6 py-4">#</th>
                    <th scope="col" className=" px-6 py-4">Username</th>
                    <th scope="col" className=" px-6 py-4">Roles</th>
                    <th scope="col" className=" px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className='text-white'>
                  {tableContent}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default UsersList