'use client'

import {createContext, useContext} from 'react'

type UserContextType = {
    userID: string
}

export const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within UserProvider")
    return context
}
