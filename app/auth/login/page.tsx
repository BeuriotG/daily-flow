"use client"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Auth() {

    interface FormLoginOrSignUp {
        email: string,
        password: string,
        passwordConfirm: string
    }

    const { signUp, login, user, resetPasswordForEmail } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user])

    const [isLoading, setIsLoading] = useState(false)



    const [isSigningUp, setIsSigningUp] = useState(false)

    const [formLogin, setFormLogin] = useState<Partial<FormLoginOrSignUp>>({
        email: '',
        password: '',
    })
    const [formSignUp, setFormSignUp] = useState<FormLoginOrSignUp>({
        email: '',
        password: '',
        passwordConfirm: '',
    })

    const [message, setMessage] = useState({ message: '', error: true })



    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const { error } = await login(formLogin.email!, formLogin.password!)
        if (error) {
            setMessage({ message: error.message, error: true })
        }
        clearForm()
        setIsLoading(false)
        router.push('/')
    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const { error, message } = await signUp(formSignUp.email, formSignUp.password, formSignUp.passwordConfirm)
        if (error) {
            setMessage({ message: error.message, error: true })
        }
        if (message) {
            setMessage({ message: message, error: true })
        }
        clearForm()
        setIsLoading(false)
    }


    async function resetPassword() {
        const email = prompt("Enter your email")
        if (email) {
            const { data, error } = await resetPasswordForEmail(email)
            if (error) {
                setMessage({ message: error.message, error: true })
            } else if (data) {
                setMessage({ message: "An email has been sent to reset your password", error: false })
            }
        }
    }

    function switchForm() {
        setIsSigningUp(!isSigningUp)
        clearForm()
        clearErrorMessage()
    }

    function clearForm() {
        setFormSignUp({
            email: '',
            password: '',
            passwordConfirm: '',
        })
        setFormLogin({
            email: '',
            password: '',
        })
    }

    function clearErrorMessage() {
        setMessage({ message: '', error: true })
    }

    return (
        <div className="layout-container-auth-page">

            <h1 className="text-auth-page-title-h1">Daily-Flow is your simplified task manager</h1>
            {!isSigningUp ? <div className="layout-container-auth-page-form">
                <h2 className="text-auth-page-title-h2">Log In to your daily-flow</h2>
                <form onSubmit={handleLogin} className="layout-container-auth-page-form-content">

                    <input className="input-auth-page" required type="email" name="email" id="email" placeholder="Email" value={formLogin.email} onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })} />
                    <input className="input-auth-page" required type="password" name="password" id="password" placeholder="Password" value={formLogin.password} onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })} />
                    <button className="btn btn-sign-up mt-4" disabled={isLoading} type="submit">{isLoading ? "Loading..." : "Log In"}</button>
                    <p className="text-auth-client-message">Don't have an account? <span className="text-auth-client-message-link" onClick={switchForm}>Sign Up</span></p>
                    <p className="text-auth-client-message-link" onClick={() => resetPassword()}>Forgot your password?</p>
                    <p className={`text-auth-client-error-message ${message.error ? 'text-auth-client-error-message' : 'text-auth-client-success-message'}`}>{message.message}</p>
                </form>
            </div>
                :
                <div className="layout-container-auth-page-form">
                    <h2 className="text-auth-page-title-h2">Welcome to daily-flow</h2>
                    <form onSubmit={handleSignUp} className="layout-container-auth-page-form-content">

                        <input className="input-auth-page" required type="email" name="email" id="email" placeholder="Email" value={formSignUp.email} onChange={(e) => setFormSignUp({ ...formSignUp, email: e.target.value })} />
                        <input className="input-auth-page" required type="password" name="password" id="password" placeholder="Password" value={formSignUp.password} onChange={(e) => setFormSignUp({ ...formSignUp, password: e.target.value })} />
                        <input className="input-auth-page" required type="password" name="passwordConfirm" id="passwordConfirm" placeholder="Confirm Password" value={formSignUp.passwordConfirm} onChange={(e) => setFormSignUp({ ...formSignUp, passwordConfirm: e.target.value })} />
                        <button className="btn btn-sign-up mt-4" disabled={isLoading} type="submit">{isLoading ? "Loading..." : "Sign Up"}</button>
                        <p className="text-auth-client-message">Already have an account? <span className="text-auth-client-message-link" onClick={switchForm}>Log In</span></p>
                        <p className="text-auth-client-message-link" onClick={() => resetPassword()}>Forgot your password?</p>
                        <p className={`text-auth-client-error-message ${message.error ? 'text-auth-client-error-message' : 'text-auth-client-success-message'}`}>{message.message}</p>
                    </form>
                </div>}

        </div>
    )
}