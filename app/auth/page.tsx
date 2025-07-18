"use client"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Auth() {

    const { signUp, signIn, user, resetPasswordForEmail } = useAuth()
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [emailSignUp, setEmailSignUp] = useState('')
    const [passwordSignUp, setPasswordSignUp] = useState('')
    const [emailSignIn, setEmailSignIn] = useState('')
    const [passwordSignIn, setPasswordSignIn] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user])

    function switchForm() {
        setIsSigningUp(!isSigningUp)
        clearForm()
        clearErrorMessage()
    }

    function clearForm() {
        setEmailSignUp('')
        setPasswordSignUp('')
        setEmailSignIn('')
        setPasswordSignIn('')
        setPasswordConfirm('')
    }

    function clearErrorMessage() {
        setMessage('')
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const { error, message } = await signUp(emailSignUp, passwordSignUp, passwordConfirm)
        if (error) {
            console.log(error)
        }
        if (message) {
            setMessage(message)
        }
        clearForm()
        setIsLoading(false)
        router.push('/')
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const { error } = await signIn(emailSignIn, passwordSignIn)
        if (error) {
            console.log(error)
        }
        clearForm()
        setIsLoading(false)
    }

    async function resetPassword() {
        const email = prompt("Enter your email")
        if (email) {
            const { data, error } = await resetPasswordForEmail(email)
            if (error) {
                console.log(error)
            }
            if (data) {
                console.log(data)
            }
        }
    }

    return (
        <div className="layout-container-auth-page">

            <h1 className="text-auth-page-title-h1">Daily-Flow is your simplified task manager</h1>
            <div className="layout-container-auth-page-form">
                <h2 className="text-auth-page-title-h2">{isSigningUp ? "Welcome to daily-flow" : "Sign In to your daily-flow"}</h2>
                <form onSubmit={isSigningUp ? handleSignUp : handleSignIn} className="layout-container-auth-page-form-content">

                    <input className="input-auth-page" type="email" name="email" id="email" placeholder="Email" value={isSigningUp ? emailSignUp : emailSignIn} onChange={(e) => isSigningUp ? setEmailSignUp(e.target.value) : setEmailSignIn(e.target.value)} />
                    <input className="input-auth-page" type="password" name="password" id="password" placeholder="Password" value={isSigningUp ? passwordSignUp : passwordSignIn} onChange={(e) => isSigningUp ? setPasswordSignUp(e.target.value) : setPasswordSignIn(e.target.value)} />
                    {isSigningUp && <input className="input-auth-page" type="password" name="passwordConfirm" id="passwordConfirm" placeholder="Confirm Password" value={isSigningUp ? passwordConfirm : ''} onChange={(e) => setPasswordConfirm(e.target.value)} />}
                    <button className="btn btn-sign-up mt-4" disabled={isLoading} type="submit">{isLoading ? "Loading..." : isSigningUp ? "Submit email" : "Sign In"}</button>
                    <p className="text-auth-client-message">{isSigningUp ? "Already have an account?" : "Don't have an account?"} <span className="text-auth-client-message-link" onClick={switchForm}>{isSigningUp ? "Sign In" : "Sign Up"}</span></p>
                    <p className="text-auth-client-message-link" onClick={() => resetPassword()}>Forgot your password?</p>
                </form>
                <p className="text-auth-error-message">{message}</p>
            </div>

        </div>
    )
}