'use client'

import { useDebounce } from '@uidotdev/usehooks'
import { getErrorMessage } from '@workspace/lib'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components/pagination'
import { useState } from 'react'

import { useGetRewardPrograms } from '../api/get-reward-programs'
import { RewardProgramForm } from './reward-program-form'
import { RewardProgramItemSkeleton } from './reward-program-item-skeleton'
import { RewardProgramItem } from './rewards-program-item'

export function RewardProgramsView() {
  const [page, setPage] = useState(1)
  const [openCreate, setOpenCreate] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data, error, isLoading } = useGetRewardPrograms({
    page,
    search: debouncedSearch,
  })

  const rewardPrograms = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="grid gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-pretty text-xl font-semibold">Reward Programs</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>Add Program</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Reward Program</DialogTitle>
            </DialogHeader>
            <RewardProgramForm
              onSuccess={() => {
                setOpenCreate(false)
              }}
              onCancel={() => setOpenCreate(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search programs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="grid gap-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => <RewardProgramItemSkeleton key={index} />)}

        {!isLoading && error && <div>Error: {getErrorMessage(error)}</div>}

        {!isLoading && !error && rewardPrograms.length === 0 && (
          <div>No reward programs found.</div>
        )}

        {!isLoading &&
          !error &&
          rewardPrograms.length > 0 &&
          rewardPrograms.map((program) => <RewardProgramItem key={program.id} program={program} />)}
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={meta.currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="p-2 text-sm">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                className={
                  meta.currentPage === meta.totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
