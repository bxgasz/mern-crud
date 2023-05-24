import React from 'react'
import { useGetNotesQuery } from './notesApiSlice'
import Notes from './Notes'
import { Link } from 'react-router-dom'
import Spinner from '../../component/Spinner'
import useAuth from '../../hooks/useAuth'

const NotesList = () => {
  const { username, isAdmin, isManager } = useAuth()
  let content = null

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  if (isLoading) content = <Spinner />
  if (isError) {
    content = (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <Link to='/dash/notes/new'>
              <button className="bg-blue-500 p-2 px-3 my-3 text-white hover:bg-blue-600 ease-in-out duration-500 rounded font-bold">
                  Add New Notes
              </button>
            </Link>
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead
                  className="border-b font-medium text-white">
                  <tr>
                    <th scope="col" className=" px-6 py-4">#</th>
                    <th scope="col" className=" px-6 py-4">Status</th>
                    <th scope="col" className=" px-6 py-4">Created</th>
                    <th scope="col" className=" px-6 py-4">Updated</th>
                    <th scope="col" className=" px-6 py-4">Titile</th>
                    <th scope="col" className=" px-6 py-4">Owner</th>
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
    const { ids, entities } = notes

    let filteredIds
    if (isManager || isAdmin) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(noteId => entities[noteId].username === username)
    }
    
    const tableContent = ids?.length && filteredIds.map(noteId => <Notes key={noteId} noteId={noteId}/>)

    content = (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <Link to='/dash/notes/new'>
              <button className="bg-blue-500 p-2 px-3 my-3 text-white hover:bg-blue-600 ease-in-out duration-500 rounded font-bold">
                  Add New Notes
              </button>
            </Link>
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead
                  className="border-b font-medium text-white">
                  <tr>
                    <th scope="col" className=" px-6 py-4">#</th>
                    <th scope="col" className=" px-6 py-4">Status</th>
                    <th scope="col" className=" px-6 py-4">Created</th>
                    <th scope="col" className=" px-6 py-4">Updated</th>
                    <th scope="col" className=" px-6 py-4">Titile</th>
                    <th scope="col" className=" px-6 py-4">Owner</th>
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

export default NotesList