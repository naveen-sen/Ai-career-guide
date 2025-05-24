import React from 'react'
import { getAssessmnets } from '../../../../actions/interview'
import { Performance } from './_components/performance';
import QuizList from './_components/quizList';
import StatsCard from './_components/stats-card';

async function InterviewPage() {
  const assessments = await getAssessmnets();
  return (
    <div>
      <h1 className='text-6xl font-bold gradient-title bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 tracking-tighter text-transparent bg-clip-text pb-2 pr-2'>Interview Preparation</h1>

      <div>
        <StatsCard assessments={assessments}/>
        <Performance assessments={assessments}/>
        <QuizList assessments={assessments}/>
      </div>
    </div>
  )
}

export default InterviewPage