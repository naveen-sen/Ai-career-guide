import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Trophy } from 'lucide-react';
import React from 'react'

const StatsCard = ({ assessments }) => {
    const getAverageScore = () => {
        if (!assessments || assessments.length === 0) return 0;
        const totalScore = assessments.reduce((acc, assessment) => acc + assessment.quizScore, 0);
        return (totalScore / assessments.length).toFixed(2);
    }

    const getLatestAssessment = ()=>{
        if(!assessments?.length) return null;
        return assessments[assessments.length-1];
    }

    const getTotalQuestions = ()=>{
        if(!assessments?.length) return 0;
        return assessments.reduce((acc, assessment) => acc + assessment.questions.length, 0);
    }
  return (
    <div className='py-8 px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 '>
                    <CardTitle>Average Score</CardTitle>
                            <Trophy className={`h-4 w-4 text-yellow-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className='text-xl font-bold'>{getAverageScore()}%</div>
                            <p className='text-xs text-muted-foreground pt-2'>Across All Assessments</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 '>
                    <CardTitle>Questions Practiced</CardTitle>
                            <Brain className={`h-4 w-4`} />
                    </CardHeader>
                    <CardContent>
                        <div className='text-xl font-bold'>{getTotalQuestions()}</div>
                            <p className='text-xs text-muted-foreground pt-2'>Total Questions</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 '>
                    <CardTitle>Latest Score</CardTitle>
                            <Target className={`h-4 w-4 text-yellow-500`} />
                    </CardHeader>
                    <CardContent>
                        <div className='text-xl font-bold'>{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                            <p className='text-xs text-muted-foreground pt-2'>Recent Quiz</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default StatsCard