import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fetchProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Missing Token');
  }

  const response = await axios('http://localhost:7001/api/profile', {
    headers: {
      'x-access-token': token,
    },
  });

  const profile = response.data;

  return profile;
};

const fetchUsers = async (userId) => {
  const response = await axios(`http://localhost:7001/api/users/${userId}`);
  const users = response.data;
  return users;
};

const withUser = (Component, options = { renderNull: true }) => (props) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    async function loadUser() {
      try {
        const profile = await fetchProfile();
        const users = await fetchUsers(profile.id);
        setUserData(users);
      } catch (error) {
        console.error(error);
      }
    }
    loadUser();
  }, []);

  if (userData === undefined && options.renderNull === true) {
    return null;
  }

  return <Component {...props} user={userData} />;
};

export default withUser;