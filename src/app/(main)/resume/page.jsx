import React from 'react'
import { getResume } from '../../../../actions/resume'
import ResumeBuilder from './_components/resumeBuilder'

async function ResumePage() {
  const resume = await getResume()
  return (
    <div>
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  )
}

export default ResumePage