/* eslint-disable prettier/prettier */
// UserContext.js
import React, {createContext, useState} from 'react';

export const UserContext = createContext({});

export const UserProvider = ({children}:any) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
