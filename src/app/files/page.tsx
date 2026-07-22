"use client"

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FolderIcon from "@iconify-react/mdi/folder";
import FileIcon from "@iconify-react/mdi/file";
import FilePdfBoxIcon from "@iconify-react/mdi/file-pdf-box";
import FileWordIcon from "@iconify-react/mdi/file-word";
import FileExcelIcon from "@iconify-react/mdi/file-excel";
import FilePowerpointIcon from "@iconify-react/mdi/file-powerpoint";
import FileImageIcon from "@iconify-react/mdi/file-image";
import FileVideoIcon from "@iconify-react/mdi/file-video";
import FileMusicIcon from "@iconify-react/mdi/file-music";
import FolderZipIcon from "@iconify-react/mdi/folder-zip";
import FileDocumentIcon from "@iconify-react/mdi/file-document";
import KeyboardArrowRightIcon from '@iconify-react/mdi/keyboard-arrow-right';
import DotsVerticalIcon from '@iconify-react/mdi/dots-vertical';
import LoadingIcon from '@iconify-react/mdi/loading';
import LinkIcon from '@iconify-react/mdi/link';
import TrayDownloadIcon from '@iconify-react/mdi/tray-download';
import RenameBoxOutlineIcon from '@iconify-react/mdi/rename-box-outline';
import InformationOutlineIcon from '@iconify-react/mdi/information-outline';
import UserPlusOutlineIcon from '@iconify-react/mdi/user-plus-outline';
import TrashCanOutlineIcon from '@iconify-react/mdi/trash-can-outline';


const getIcon = (mimeType: string) => {
  switch (mimeType) {
    case "application/vnd.google-apps.folder":
      return FolderIcon;

    case "application/pdf":
      return FilePdfBoxIcon;

    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return FileWordIcon;

    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return FileExcelIcon;

    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return FilePowerpointIcon;

    case "image/jpeg":
    case "image/png":
    case "image/webp":
    case "image/gif":
      return FileImageIcon;

    case "video/mp4":
      return FileVideoIcon;

    case "audio/mpeg":
      return FileMusicIcon;

    case "application/zip":
      return FolderZipIcon;

    case "text/plain":
      return FileDocumentIcon;

    default:
      return FileIcon;
  }
};

type File = {
  id: string,
  name: string,
  mimeType: string,
}

export default function page() {
  const [history, setHistroy] = useState<{ id: string, name: string }[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("id") ?? 'root'
  const [files, setFiles] = useState<File[]>()
  const [loading, setLoading] = useState(false)
  const [menu, setMenu] = useState<string | boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleMenuClose = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return

      setMenu(false)
    }
    document.addEventListener("mousedown", handleMenuClose)
    return () => document.removeEventListener("mousedown", handleMenuClose)
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/files/list/" + folderId)
        setFiles(res.data.files)
        setHistroy(res.data.paths)
        setLoading(false)

      } catch (error) {

      }
    }

    fetchData()
  }, [searchParams])

  const changePath = (path: { name: string, id: string }, index: number) => {
    if (path.id !== "root")
      router.push("/files?id=" + path.id)
    else
      router.push("/files")

  }

  const handleClick = (file: File) => {
    console.log(file)
    if (file.mimeType === "application/vnd.google-apps.folder")
      router.push("/files?id=" + file.id)
    else
      router.push("/api/files/view/" + file.id)
    // setHistroy(prev => ([...prev, { id: file.id, name: file.name }]))
  }

  if (loading) return (
    <div className="flex justify-center items-center h-dvh">
      <LoadingIcon className="animate-spin" height="3em" />
    </div>
  )

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex gap-1 items-center text-lg font-semibold'>
        {history.map((item, index) => (
          <div key={item.id} className="flex gap-1 items-center">
            <span
              onClick={() => changePath(item, index)}
              className='rounded-full px-4 py-2 hover:bg-neutral-700/50 cursor-pointer'>{item.name}
            </span>
            {index < history.length - 1 && <span>
              <KeyboardArrowRightIcon height="1em" />
            </span>}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'>
        {files?.map(file => {
          const Icon = getIcon(file.mimeType)
          return (
            <div
              key={file.id}
              className="flex justify-between items-center border-2 border-white/10 gap-2 cursor-pointer bg-neutral-700/50 rounded p-2"
            >

              <button
                disabled={loading}
                className="flex items-center gap-2 cursor-pointer min-w-0 w-full"
                onClick={() => handleClick(file)}
                type="button">
                <Icon className='shrink-0' height='1em' />
                <span className="truncate">{file.name}</span>
              </button>

              <div className="relative">
                <button ref={menuButtonRef} onClick={() => setMenu(menu === file.id ? false : file.id)} className='flex hover:bg-neutral-900/50 rounded-full p-1 justify-center items-center cursor-pointer' type="button">
                  <DotsVerticalIcon height="1em" />
                </button>

                {menu === file.id &&
                  <div ref={menuRef} className="absolute z-10 flex flex-col top-full mt-1 right-0 bg-neutral-800 rounded-md overflow-hidden">
                    <button className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                      <UserPlusOutlineIcon height="1.2em" />
                      Share
                    </button>
                    <button className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                      <LinkIcon height="1.2em" />
                      Copy link
                    </button>
                    {file.mimeType !== "application/vnd.google-apps.folder" &&
                      <button onClick={() => window.location.href = `/api/files/download/${file.id}`} className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                        <TrayDownloadIcon height="1.2em" />
                        Download
                      </button>
                    }
                    <button className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                      <RenameBoxOutlineIcon height="1.2em" />
                      Rename
                    </button>
                    <button className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                      <TrashCanOutlineIcon height="1.2em" />
                      Move to trash
                    </button>
                    <button className="flex items-center gap-1 text-sm font-semibold text-nowrap py-2 px-4 hover:bg-neutral-900/50 cursor-pointer" type="button">
                      <InformationOutlineIcon height="1.2em" />
                      View information
                    </button>
                  </div>
                }

              </div>


            </div>
          )
        })}

      </div>
    </div>
  )
}

