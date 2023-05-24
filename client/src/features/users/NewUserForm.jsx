import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { ROLES } from '../../config/roles'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!#$%]{4,12}$/

const NewUserForm = () => {
  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation() 

  const navigate = useNavigate()

  const [dropdown, setDropdown] = useState(false)

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(["Employee"])

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
    if (isSuccess) {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  },[isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const onRolesChanged = (value) => {
    if (roles.includes(value)) {
      setRoles(roles.filter((option) => option !== value));
    } else {
      setRoles([...roles, value]);
    }
  };

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

  const onUserSaveClicked = async(e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, roles })
    }
  }

  // const options = Object.values(ROLES).map(role => {
  //   return (
  //     <option key={role} value={role}>{role}</option>
  //   )
  // })

  const opt = Object.values(ROLES).map(role => {return {value: role, label:role}})

  const validRolesClass = !Boolean(roles.length) ? "" : ""

  const errContent = (error?.data?.message) ?? ''

  const content = (
    <section className="flex items-center justify-center mt-10">
      <div className="w-[80%] bg-white shadow-md rounded-md p-4">
        <div className="font-bold text-2xl text-[#0F172A] flex justify-center mt-5">
          <h1>Add New Users</h1>
        </div>
        <hr className="mt-2 h-1 w-32 bg-blue-500 rounded mx-auto" />
        {isError && <div className="error w-full mt-4 h-15 p-2 rounded font-bold text-red-500 bg-red-300 border border-red-400">{errContent} <FontAwesomeIcon icon={faCircleExclamation}/></div>}
        <div className="py-4">
          <form action="" className="mt-2 flex flex-col" onSubmit={onUserSaveClicked}>
            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="text" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500 ${!validUsername && username ? `border-red-500 focus:border-red-500` : validUsername ? `border-green-500 focus:border-green-500` : '' }`} placeholder="Username 3-20 letters"
              id='username' name='username' autoComplete='off' value={username} onChange={onUsernameChanged}
              />
            </div>

            <div className="flex flex-wrap w-full relative h-15 items-center rounded mb-6">
              <input type="password" className={`flex-shrink flex-grow flex-auto leading-normal w-px h-10 rounded px-3 self-center relative text-md outline-none border-2 border-blue-100 focus:border-blue-500 ${!validPassword && password ? `border-red-500 focus:border-red-500` : validPassword ? `border-green-500 focus:border-green-500` : '' }`} placeholder="Password" id='password' name='password' autoComplete='off' value={password} onChange={onPasswordChanged}/>
            </div>

            <div className="inline-block w-full relative h-15 items-center rounded mb-6">
              {/* <select
                id="multiple-select"
                multiple
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={roles}
                onChange={(e) => onRolesChanged(e.target.value)}
              >
                {options}
              </select> */}

                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm font-medium text-left bg-white border-blue-100 shadow-sm focus:outline-none border-2 focus:border-blue-500 rounded"
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

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full ease-in-out duration-300 mx-auto my-4 disabled:bg-blue-300" disabled={!canSave}>Submit <FontAwesomeIcon icon={faSave}/></button>
          </form>
        </div>
      </div>
    </section>
  )

  return content
}

export default NewUserForm