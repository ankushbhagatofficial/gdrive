"use client"

import { useEffect } from "react"

export default function page() {
  useEffect(() => {
    window.opener?.postMessage("oatuh.success", window.location.origin)
    window.close()
  }, [])
  return null
}

