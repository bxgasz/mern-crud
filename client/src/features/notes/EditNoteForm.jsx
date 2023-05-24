import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useUpdateNoteMutation } from './notesApiSlice'

const EditNoteForm = ({ users, note }) => {
  const [updateNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateNoteMutation() 

  const navigate = useNavigate()

  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)
  const [userId, setUserId] = useState(note.user)

  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setText('')
      setUserId([])
      navigate('/dash/notes')
    }
  },[isSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onTextChanged = e => setText(e.target.value)
  const onCompletedChanged = e => setCompleted(prev => !prev)
  const onUserIdChanged = e => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
        await updateNote({ id: note.id, user: userId, title, text, completed })
    }
  }

  const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
  const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

  const options = users.map(user => {
    return (
        <option
            key={user.id}
            value={user.id}
        > {user.username}</option >
    )
  })

  const errContent = (error?.data?.message) ?? 'Failed to submit Data!'

  const content = (
    <section className="flex items-center justify-center mt-10">
      <div className="w-[80%] bg-white shadow-md rounded-md p-4">
        <div className="font-bold text-2xl text-[#0F172A] flex justify-center mt-5">
          <h1>Add New Notes</h1>
        </div>
        <hr className="mt-2 h-1 w-32 bg-blue-500 rounded mx-auto" />
        {isError && <div className="error w-full mt-4 h-15 p-2 rounded font-bold text-red-500 bg-red-300 border border-red-400">{errContent} <FontAwesomeIcon icon={faCircleExclamation}/></div>}
        <div className="py-4">
          <form action="" className="mt-2 flex flex-col" onSubmit={onSaveNoteClicked}>
            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="text" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500`} placeholder="Title of content"
              id='title' name='title' autoComplete='off' value={title} onChange={onTitleChanged}
              />
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
                <textarea placeholder='text' name="text" id="text" className='flex-shrink flex-grow flex-auto leading-normal w-px rounded px-3 py-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500' onChange={onTextChanged} value={text}></textarea>
            </div>

            <div className="flex items-center mb-4">
                <input id="note-completed" type="radio" value="" name="completed" className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300" checked={completed} onChange={onCompletedChanged}/>
                <label htmlFor="note-completed" className="ml-2 text-sm font-medium text-blue-500">Completed</label>
            </div>

            <div className="inline-block w-full relative h-15 items-center rounded mb-6">
                <select id="username" name="username" className="w-full p-2 px-3 rounded border-2 outline-none border-blue-100 focus:border-blue-500" value={userId} onChange={onUserIdChanged}>
                    {options}
                </select>
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full ease-in-out duration-300 mx-auto my-4 disabled:bg-blue-300" disabled={!canSave}>Submit <FontAwesomeIcon icon={faSave}/></button>
          </form>
        </div>
      </div>
    </section>
  )

  return content
}

export default EditNoteForm