'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import Link from 'next/link'

export default function HeaderClient({ user }) {
  return (
    <header className='fixed top-0 w-[100vw] border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto px-4 h-18 flex items-center justify-between'>

        <div className='flex items-start justify-start'>
          <a href='/'>
            <img src='/logo.png' alt='Logo' className='h-10 w-auto' />
          </a>
        </div>

        <div className='flex space-x-4 justify-end items-end'>
          <SignedIn>
            <a href='/dashboard'>
              <Button className='flex items-center'>
                <LayoutDashboard className='w-5 h-5' />
                <span className='hidden md:block '>Industry Insights</span>
              </Button>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className='flex items-center'>
                  <StarsIcon className='w-5 h-5 mr-2' />
                  <span className='hidden md:block '>Growth Tools</span>
                  <ChevronDown className='w-4 h-4 ml-2' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={'/resume'}>
                  <Button className='flex items-center w-full'>
                    <FileText className='w-5 h-5 mr-2' />
                    <span className='hidden md:block '>Build Resume</span>
                  </Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/ai-cover-letter'}>
                  <Button className='flex items-center w-full mr-2'>
                    <PenBox className='w-5 h-5 mr-2' />
                    <span className='hidden md:block '>Cover Letter</span>
                  </Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/interview'}>
                    <Button className='flex items-center w-full'>
                      <GraduationCap className='w-5 h-5 mr-2' />
                      <span className='hidden md:block '>Interview Prep</span>
                    </Button>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <Link href='/signin'>
              <Button >Sign In</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                  userButtonAvatar: 'h-10 w-10 rounded-full',
                  userButtonPopoverCard: 'w-[200px] shadow-xl',
                  userButtonPopoverAction: 'w-full text-left',
                  userPreviewMainIdentifier: 'font-semibold'
                },
              }}
            />
          </SignedIn>

        </div>

      </nav>
    </header>
  )
}
