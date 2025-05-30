"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import QuizResult from './quiz-result'

const QuizList = ({assessments}) => {
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  return (
    <div className='py-4 px-4'>
      <Card>
        <CardHeader className='flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0'>
          <div>
            <CardTitle className='text-3xl md:text-4xl'>Recent Quiz</CardTitle>
              <CardDescription>
                <p>Review your recent quiz attempts</p>
            </CardDescription>
          </div>
          <Button onClick={() => router.push('/interview/mock')}>Take Quiz</Button>
        </CardHeader>
        <CardContent>
          <div>
            {assessments.map((assessment,index) => (
              <Card key={assessment.id} className='mb-4 cursor-pointer'>
                <CardHeader className='flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0'>
                  <div>
                    <CardTitle className='text-lg font-semibold'>Quiz. {index+1}</CardTitle>
                  </div>
                  <CardDescription className='text-sm text-muted-foreground'>
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm font-medium pb-1'>Score: {assessment.quizScore.toFixed(1)}%</p>
                  <p className='text-sm text-muted-foreground'>{assessment.improvementTip}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm"  onClick={() => setSelectedQuiz(assessment,index)}>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
    </Card>

    <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
      <DialogContent className="max-w-8xl w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle></DialogTitle>
          <QuizResult result={selectedQuiz} onStartNew={() => router.push('/interview/mock')}
          hideStartNew
        />
        </DialogHeader>
      </DialogContent>
    </Dialog>


    </div>
  )
}

export default QuizList