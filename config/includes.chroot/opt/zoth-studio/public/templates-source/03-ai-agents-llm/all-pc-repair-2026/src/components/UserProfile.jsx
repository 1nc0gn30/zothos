import React from 'react';
import Avatar from '@mui/material/Avatar';

const UserProfile = () => {
  return (
    <Avatar
      src="/assets/portrait.jpg"
      alt="Chris Lex"
      sx={{ width: 120, height: 120 }}
    />
  );
};

export default UserProfile;
