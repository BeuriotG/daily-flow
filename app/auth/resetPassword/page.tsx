'use client'
import { useAuth } from "@/hooks/useAuth"
import { useReducer, useState } from "react"
import { useRouter } from "next/navigation"
export default function ResetPassword() {

    const router = useRouter()
    const { updatePassword } = useAuth()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')



    function clearForm() {
        setNewPassword('')
        setConfirmPassword('')

    }

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match")
            clearForm()
            return
        }
        const { error, data } = await updatePassword(newPassword)
        if (error) {
            setMessage(error.message)
        }
        if (data) {
            setMessage("Password updated")
            router.push('/auth/login')
        }

    }

    return (
        <div className="layout-container-auth-page">
            <div className="layout-container-auth-page-form">
                <h1 className="text-auth-page-title-h2">Reset Password</h1>
                <form className="layout-container-auth-page-form-content" onSubmit={handleUpdatePassword}>
                    <input className="input-auth-page" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <input className="input-auth-page" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button className='btn btn-sign-up'>Update Password</button>
                    <p className={`${message === "Password updated" ? "text-auth-client-success-message" : "text-auth-client-error-message"}`}>{message}</p>
                </form>
            </div>
        </div>
    )
}