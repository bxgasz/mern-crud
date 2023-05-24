import React, { memo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useDeleteNoteMutation, useGetNotesQuery } from './notesApiSlice'
import useAuth from '../../hooks/useAuth'

const Notes = ({noteId}) => {
  const { isManager, isAdmin } = useAuth()

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId]
    })
  })

  const navigate = useNavigate()

  const [deleteNote, {
      isSuccess,
      isError,
      error
    }] = useDeleteNoteMutation()

  const handleDelete = async(e) => {
      await deleteNote({ id:noteId })
  }

  useEffect(() => {
      if (isSuccess) {
        navigate('/dash/notes')
      }
    },[isSuccess, navigate])

  if (note) {
    const created = new Date(note.createdAt).toLocaleString('id-ID', {day: 'numeric', month: 'long'})  
    const updated = new Date(note.updatedAt).toLocaleString('id-ID', {day: 'numeric', month: 'long'})  

    const handleEdit = () => navigate(`/dash/notes/${noteId}`)
    
    return (
        <tr className="border-b dark:border-neutral-500">
            <td className="whitespace-nowrap  px-6 py-4 font-medium">1</td>
            <td className="whitespace-nowrap  px-6 py-4">
              {note.completed 
                  ? <span className="bg-teal-500 p-2 px-3 rounded font-bold">Completed</span> 
                  : <span className="bg-rose-500 p-2 px-3 rounded font-bold">Open</span>
              }
            </td>
            <td className="whitespace-nowrap  px-6 py-4">{created}</td>
            <td className="whitespace-nowrap  px-6 py-4">{updated}</td>
            <td className="whitespace-nowrap  px-6 py-4">{note.title}</td>
            <td className="whitespace-nowrap  px-6 py-4">{note.username}</td>
            <td className="whitespace-nowrap  px-6 py-4">
                <button className="bg-cyan-500 p-2 px-3 text-white hover:bg-cyan-600 ease-in-out duration-500 rounded mr-1" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare}/>
                </button>
                {(isAdmin || isManager) && 
                <button className="bg-red-500 p-2 px-3 text-white hover:bg-red-600 ease-in-out duration-500 rounded" onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrashCan}/>
                </button>
                }
            </td>
        </tr>
      )
  } else return null
}
const memoizedNote = memo(Notes)
export default memoizedNote