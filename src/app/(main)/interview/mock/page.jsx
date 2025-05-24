import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Quiz from '../_components/quiz'

function MockInterviewPage() {
  return (
    <div>
      <div className='flex flex-col space-y-2 mx-2'>
        <Link href={'/interview'}>
          <Button variant={'link'} className='gap-2 pl-0'>
            <ArrowLeft className='h-4 w-4'/>Back to Interview</Button>
        </Link>

        <div>
          <h1 className='text-5xl bg-gradient-to-b from-slate-400 via-amber-200 to-slate-600 font-extrabold tracking-tighter text-transparent bg-clip-text '>Mock Interview</h1>
          <p className='text-muted-foreground pb-5'>
            Test your knowledge and skills with industry-specific questions
          </p>
        </div>
      </div>

      <Quiz/>
    </div>
  )
}

export default MockInterviewPage