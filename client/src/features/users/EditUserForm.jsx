import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!#$%]{4,12}$/

const EditUserForm = ({ user }) => {

  const [updateUser, {
       isLoading,
       isSuccess,
       isError,
       error
   }] = useUpdateUserMutation()    
  const [deleteUser, {
       isSuccess: isDelSuccess,
       isError: isDelError,
       error: delError
   }] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [dropdown, setDropdown] = useState(false)

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)

  const handleCheckboxChange = (optionId) => {
    if (roles.includes(optionId)) {
      setRoles(roles.filter((option) => option !== optionId));
    } else {
      setRoles([...roles, optionId]);
    }
  };

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  },[isSuccess, isDelSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const onActiveChanged = () => setActive(prev => !prev)

  const onSaveUserClickerd = async(e) => {
    if (password) {
        await updateUser({ id:user.id, username, password, roles, active })
    } else {
        await updateUser({ id:user.id, username, roles, active })
    }
  }

  const onDeleteUserClicked = async(e) => {
    await deleteUser({ id: user.id })
  }

  const opt = Object.values(ROLES).map(role => {return {value: role, label:role}})

  let canSave
  if (password) {
    canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading
  }

  const errContent = (error?.data?.message || delError?.data?.message) ?? 'Failed to update'

  const content = (
    <section className="flex items-center justify-center mt-10">
      <div className="w-[80%] bg-white shadow-md rounded-md p-4">
        <div className="font-bold text-2xl text-[#0F172A] flex justify-center mt-5">
          <h1>Edit Users</h1>
        </div>
        <hr className="my-2 h-1 w-32 bg-blue-500 rounded mx-auto" />
        {isError || isDelError && <div className="error w-full mt-4 h-15 p-2 rounded font-bold text-red-500 bg-red-300 border border-red-400">{errContent} <FontAwesomeIcon icon={faCircleExclamation}/></div>}
        <div className="py-4">
          <form action="" className="mt-2 flex flex-col" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
            <input type="text" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500 ${!validUsername && username ? `border-red-500 focus:border-red-500` : validUsername ? `border-green-500 focus:border-green-500` : '' }`} placeholder="Username 3-20 letters"
              id='username' name='username' autoComplete='off' value={username} onChange={onUsernameChanged}
              />
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="password" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500 ${!validPassword && password ? `border-red-500 focus:border-red-500` : validPassword ? `border-green-500 focus:border-green-500` : '' }`} placeholder="Password" id='password' name='password' autoComplete='off' value={password} onChange={onPasswordChanged}/>
            </div>

            <div className="flex items-center mb-4">
                <input id="user-active" type="radio" value="" name="user-active" className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300" checked={active} onChange={onActiveChanged}/>
                <label htmlFor="user-active" className="ml-2 text-sm font-medium text-blue-500">Active</label>
            </div>

            <div className="inline-block w-full relative h-15 items-center rounded mb-6">
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-sm font-medium text-left bg-white border-blue-100 shadow-sm focus:outline-none border-2 focus:border-blue-500 rounded ${!Boolean(roles.length) ? '' : ''}`}
                  onClick={() => setDropdown(!dropdown)}>
                  Select Roles
                </button>
                {dropdown && 
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-2">
                      {opt.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            className="mr-2 form-checkbox"
                            value={option.value}
                            checked={roles.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                }
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full ease-in-out duration-300 mx-auto my-4" disabled={!canSave} onClick={onSaveUserClickerd}>Submit <FontAwesomeIcon icon={faSave}/></button>
          </form>
        </div>
      </div>
    </section>
  )

  return content
}

export default EditUserForm