import React, { useEffect } from 'react'
import { usePuterStore } from '~/lib/putter'
import {useLocation, useNavigate} from "react-router"



const meta = () => ([
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account " },
])

const auth = () => {

    const { isLoading,auth  } = usePuterStore();
    const location = useLocation()
    const next = location.search.split('next=')[1] || '/'    
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading && auth.isAuthenticated) navigate(next);
        // if (!isLoading && auth.isAuthenticated) {
        //     return null;
        }, [auth.isAuthenticated, isLoading,navigate,next])


    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className='gradient-border shadow-lg'>
                <section className="bg-white flex flex-col gap-8 rounded-2xl p-10">
                    <div className= "flex flex-col items-center gap-2 text-center " >
                        <h1> Welcome </h1>
                        <h2>Log into Continue Your Job Journey</h2>

                    </div>
                    <div>
                        {isLoading ?(
                            <button className='auth-button animate-pulse'>
                                <p> Signing you in ...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className='auth-button' onClick={() => auth.signOut()}>
                                        <p> Log Out </p>
                                    </button> 
                                ) : (
                                    <button className='auth-button' onClick={() => auth.signIn()}>
                                        <p> Log in  </p>
                                    </button> 
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    
  )
}

export default auth
