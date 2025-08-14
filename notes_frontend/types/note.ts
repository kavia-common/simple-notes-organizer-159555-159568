export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  tags: string[]
  folderId: string | null
  pinned: boolean
}
