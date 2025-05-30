"use server"
import React from 'react'
import { getCoverletter, getCoverLetters } from '../../../../actions/cover-letter'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CoverLetterList from './_components/cover-letter-list'
import Link from 'next/link'

export async function coverLetterPage() {
  const coverLetters = await getCoverLetters()
  return (
    <div>
      <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 tracking-tighter text-transparent bg-clip-text pr-2 pb-2 ">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
    </div>
  )
}

export default coverLetterPage