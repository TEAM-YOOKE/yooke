import React, { createContext, useState } from "react";

export const AvailableRoutesContext = createContext();

export const AvailableRoutesProvider = ({ children }) => {
  const [availableRoutes, setAvailableRoutes] = useState(null);
  const [cachedSearches, setCachedSearches] = useState({});

  return (
    <AvailableRoutesContext.Provider
      value={{
        availableRoutes,
        setAvailableRoutes,
        cachedSearches,
        setCachedSearches,
      }}
    >
      {children}
    </AvailableRoutesContext.Provider>
  );
};
