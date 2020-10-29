import React, { useState, useEffect } from 'react'
import axios from 'axios'

const withUser = (Component, options = { renderNull: true }) => props => {
  const [userData, setUserData] = useState(null)
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    axios('http://localhost:7001/api/profile', {
      headers: {
        'x-access-token': token,
      },
    })
      .then(response => {
        const id = response.data.userId
        setUserId(id)
      })
      .catch(error => {
        setError(true)
        console.log(error)
      })
  }, [])

  useEffect(() => {
    axios(`http://localhost:7001/api/users/${userId}`).then(response => {
      //console.log(response.data)
      setUserData(response.data)
    })
  }, [userId])

  if (!userData && options.renderNull) return null
  return <Component {...props} user={userData} />
}

export default withUser
