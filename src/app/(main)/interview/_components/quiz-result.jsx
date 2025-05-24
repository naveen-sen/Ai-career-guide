import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

const QuizResult = ({result,hideStartNew = false, onStartNew}) => {
    if(!result) return null
  return (
    <div>
        <h1 className='flex items-center gap-2 text-3xl gradient-title pl-5'>
            <Trophy className='h-6 w- 6 text-yellow-500'/>
            Quiz Results
        </h1>
        <CardContent className='space-y-2'>
            <div className='flex flex-col justify-center text-center mx-auto pb-5 ' style={{ width: 200, height: 200 }}>
                {/* <h3 className='text-2xl font-bold'>{result.quizScore.toFixed(1)}%</h3> */}
                <CircularProgressbar 
                    value={result.quizScore} 
                    text={`${result.quizScore.toFixed(1)}%`}
                    className='w-full mt-2'
                    styles={{
                        path: {
                            stroke: `#22c55e`, // green-500
                            strokeLinecap: 'round',
                        },
                        text: {
                            fill: '#22c55e',
                            fontSize: '16px',
                        }
                    }} 
                />
            </div>

            {result.improvementTip && (
                <div className='bg-muted p-4 rounded-lg'>
                    <p className='font-medium'>Improvement Tip</p>
                    <p className='text-muted-foreground'>{result.improvementTip}</p>
                </div>
            )}

            <div className='text-lg font-semibold mt-4 pb-3'>
                <h3 className='text-2xl font-medium pb-3 pl-2 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-800 text-transparent bg-clip-text'>Question Review</h3>
                {result.questions.map((q,index)=>(
                    <div className='border rounded-lg p-4 space-y-2' key={index}>
                        <div className='flex items-start justify-between gap-2'>
                            <p className='font-medium'>Q.{index + 1} {q.question}</p>
                            {q.isCorrect ? (
                                <CheckCircle2 className='h-5 w-5 text-green-500 flex shrink-0'/>
                            ) : (
                                <XCircle className='h-5 w-5 text-red-500 flex shrink-0'/>
                            )}
                        </div>

                        <div>
                            <p className='text-sm text-muted-foreground'>Ans {q.userAnswer}</p>
                            {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
                        </div>
                        <div className='text-sm bg-muted p-2 rounded'>
                            <p className='font-medium text-muted-foreground'>Explanation:</p>
                            <p className='text-muted-foreground'>{q.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>

        {!hideStartNew && (
            <CardFooter>
                <Button onClick={onStartNew} className='w-full'>Start New Quiz</Button>
            </CardFooter>
        )}
    </div>
  )
}

export default QuizResult