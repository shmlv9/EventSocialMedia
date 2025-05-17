'use client'

import {UserContext} from '@/context/userContext'
import {ReactNode} from 'react'


export default function ClientWrapper({userID, children}: {
    userID: string,
    children: ReactNode
}) {
    return (
        <UserContext.Provider value={{userID}}>
            {children}
        </UserContext.Provider>
    )
}