"use client"
import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"
import { useState } from "react"


export default function Auth() {

    const { signUp, signIn } = useAuth()
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [emailSignUp, setEmailSignUp] = useState('')
    const [passwordSignUp, setPasswordSignUp] = useState('')
    const [emailSignIn, setEmailSignIn] = useState('')
    const [passwordSignIn, setPasswordSignIn] = useState('')
    const [message, setMessage] = useState('')

    function switchForm() {
        setIsSigningUp(!isSigningUp)
        clearForm()
    }

    function clearForm() {
        setEmailSignUp('')
        setPasswordSignUp('')
        setEmailSignIn('')
        setPasswordSignIn('')
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { error, message } = await signUp(emailSignUp, passwordSignUp)
        if (error) {
            console.log(error)
        }
        if (message) {
            setMessage(message)
        }
        clearForm()
    }

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        signIn(emailSignIn, passwordSignIn)
        redirect('/')
    }

    return (
        <div className="layout-container-auth-page">
            <p className="text-red-500">{message}</p>
            <div className="layout-container-auth-page-form">
                <h1 className="text-auth-page-title">{isSigningUp ? "Welcome to daily-flow" : "Sign In to your daily-flow"}</h1>
                <form onSubmit={isSigningUp ? handleSignUp : handleSignIn} className="layout-container-auth-page-form-content">

                    <input className="input-auth-page" type="email" name="email" id="email" placeholder="Email" value={isSigningUp ? emailSignUp : emailSignIn} onChange={(e) => isSigningUp ? setEmailSignUp(e.target.value) : setEmailSignIn(e.target.value)} />
                    <input className="input-auth-page" type="password" name="password" id="password" placeholder="Password" value={isSigningUp ? passwordSignUp : passwordSignIn} onChange={(e) => isSigningUp ? setPasswordSignUp(e.target.value) : setPasswordSignIn(e.target.value)} />
                    <button className="btn btn-sign-up mt-4" type="submit">{isSigningUp ? "Submit email" : "Sign In"}</button>
                    <p className="text-auth-client-message">{isSigningUp ? "Already have an account?" : "Don't have an account?"} <span className="text-auth-client-message-link" onClick={switchForm}>{isSigningUp ? "Sign In" : "Sign Up"}</span></p>
                </form>
            </div>

        </div>
    )
}