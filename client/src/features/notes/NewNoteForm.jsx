import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAddNewNoteMutation } from './notesApiSlice'

const NewNoteForm = ({ users }) => {
  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation() 

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [userId, setUserId] = useState(users[0].id)

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
  const onUserIdChanged = e => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  console.log({user: userId, title, text})

  const onSaveNoteClick = async(e) => {
    e.preventDefault()
    if (canSave) {
        await addNewNote({user: userId, title: title, text: text})
    }
  }

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
          <form action="" className="mt-2 flex flex-col" onSubmit={onSaveNoteClick}>
            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="text" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500`} placeholder="Title of content"
              id='title' name='title' autoComplete='off' value={title} onChange={onTitleChanged}
              />
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
                <textarea placeholder='text' name="text" id="text" className='flex-shrink flex-grow flex-auto leading-normal w-px rounded px-3 py-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500' onChange={onTextChanged} value={text}></textarea>
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

export default NewNoteForm