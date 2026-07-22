import { signIn } from "next-auth/react"

export async function Google(callback?: (any)): Promise<void> {
  // callback()
  const popup = window.open("about:blank", "_blank")
  const res = await signIn("google", { redirect: false, redirectTo: "/close" })
  if (popup && res?.url) {
    popup.location.href = res.url
  } else {
    popup?.close()
  }
}

