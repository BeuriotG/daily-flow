import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"


export default function Auth() {

    const { signUp, signIn } = useAuth()
    const [emailSignUp, setEmailSignUp] = useState('')
    const [passwordSignUp, setPasswordSignUp] = useState('')
    const [emailSignIn, setEmailSignIn] = useState('')
    const [passwordSignIn, setPasswordSignIn] = useState('')
    const [message, setMessage] = useState('')

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
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-red-500">{message}</p>
            <div className="flex items-center justify-center gap-10">
                <div>
                    <h1>You are not registered yet</h1>
                    <form onSubmit={handleSignUp} className="grid grid-cols-1 gap-4 px-5 py-5 w-[300px] h-[300px] bg-red-500 ">
                        <label htmlFor="email">Email</label>
                        <input className="bg-white text-black" type="email" name="email" id="email" placeholder="Enter a valid email" value={emailSignUp} onChange={(e) => setEmailSignUp(e.target.value)} />
                        <label htmlFor="password">Password</label>
                        <input className="bg-white text-black" type="password" name="password" id="password" value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} />
                        <button className="bg-white text-black" type="submit">Submit email</button>
                    </form>
                </div>
                <div>
                    <h1>You are already registered</h1>
                    <form onSubmit={handleSignIn} className="grid grid-cols-1 gap-4 px-5 py-5 w-[300px] h-[300px] bg-red-500 ">
                        <label htmlFor="email">Email</label>
                        <input className="bg-white text-black" type="email" name="email" id="email" placeholder="Enter a valid email" value={emailSignIn} onChange={(e) => setEmailSignIn(e.target.value)} />
                        <label htmlFor="password">Password</label>
                        <input className="bg-white text-black" type="password" name="password" id="password" value={passwordSignIn} onChange={(e) => setPasswordSignIn(e.target.value)} />
                        <button className="bg-white text-black" type="submit">Submit email</button>
                    </form>
                </div>
            </div>
        </div>
    )
}