"use client"

import Link from "next/link"
import { Google } from "@/actions/OAuth"
import { useRouter } from "next/navigation"
import { SyntheticEvent, useState, ChangeEvent } from "react"

export default function page() {
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState()
  const [error, setError] = useState()
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setData(prev => ({
      ...prev, [name]: value
    }))
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push("/files")
    } else {
      const data = await res.json()
      if (data.message)
        setError(data.message)
    }

  }
  return (
    <div className="flex h-dvh justify-center items-center">
      <form onSubmit={handleSubmit} className="flex gap-4 p-4 flex-col rounded-xl bg-neutral-800 w-150 max-w-[80%]">
        <div>
          <h1 className="text-xl font-bold">Login to your account</h1>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Email Address</label>
          <input onChange={handleOnChange} className="rounded border-2 border-white/20 outline-0 focus:border-white/80 p-1" type="email" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Password</label>
          <input onChange={handleOnChange} className="rounded border-2 border-white/20 outline-0 focus:border-white/80 p-1" type="password" />
        </div>

        {error &&
          <span className="text-sm text-red-500">{error}</span>
        }

        <button className="flex justify-center items-center bg-white text-black rounded py-2 text-sm font-semibold">Login</button>

        <button onClick={() => Google()} type="button" className="flex justify-center items-center bg-white text-black rounded py-2 text-sm font-semibold">Continue with Google</button>

        <span className="text-center text-sm">Don't have an account <Link className="underline" href="/register" >register</Link></span>
      </form>
    </div>
  )

}

