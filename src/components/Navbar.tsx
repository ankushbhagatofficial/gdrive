import Link from "next/link";

type Props = {
  auth?: {}
}

export default function Navbar({ auth }: Props) {
  return (
    <div>
      <nav className="flex h-15 px-4 items-center bg-neutral-800 justify-between">
        <div>
          <h1 className="text-lg font-bold">
            gDrive
          </h1>
        </div>
        <div>
          <Link className="font-semibold text-sm bg-blue-800 p-2.5 px-4 rounded-full" href="/login">Sign in</Link>
        </div>
      </nav>
    </div>
  )
}

