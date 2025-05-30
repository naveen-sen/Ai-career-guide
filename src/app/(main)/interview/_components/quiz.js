"use client"
import useFetch from '@/hooks/use-fetch';
import React, { useEffect, useState } from 'react'
import { generateQuiz, saveQuizResult } from '../../../../../actions/interview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarLoader } from 'react-spinners';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import QuizResult from './quiz-result';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers,setAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

   

    const {
        loading:generatingQuiz,
        fn:generateQuizFn,
        data:quizData,
    } = useFetch(generateQuiz)

    const {
        loading:savingQuiz,
        fn:saveQuizResultFn,
        setData: setResultData,
        data: resultData,
    } = useFetch(saveQuizResult)

    console.log("Result",resultData)

     useEffect(()=>{
        if(quizData){
            setAnswers(new Array(quizData?.questions?.length).fill(null))
            setCurrentQuestion(0)
        }
    },[quizData])

    const handleAnswer = (answer)=>{
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
        setShowExplanation(true);
    }
    
    const handleNext = () => {
        setShowExplanation(false);
        if(currentQuestion < quizData.length - 1){
            setCurrentQuestion(currentQuestion + 1);
        } else {
            finishQuiz()
        }
    }

    const calculateScore = ()=>{
        let correct = 0;

        answers.forEach((answer, index) => {
            if (answer === quizData[index].correctAnswer) {
                correct++;
            }
            });
        let score =  (correct / quizData.length) * 100
        return score
    }


    const finishQuiz = async ()=>{
        let score = calculateScore()
        try{
            await saveQuizResultFn(quizData, answers, score);
            toast.success("Quiz Completed")
        }catch(error){
            console.log(error.message)
            toast.error("Something went wrong"+error.message)
        }
    }

    const startNewQuiz = ()=>{
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplanation(false)
        generateQuizFn()
        setResultData(null )
    }

    
    if(generatingQuiz){
        return <BarLoader className="mt-4" width={"100%"} color="gray" />
    }

    if(resultData){
        return <QuizResult result={resultData} onStartNew={startNewQuiz}/>
    }

    

    if(!quizData){
        return(
            <div className='flex pt-2'>
            <Card >
                <CardHeader>
                    <CardTitle>Ready to test your knowledge</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>This quiz contains 10 questions specific to your industry and skills. Take you time and choose the best option for each question</p>
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full' onClick={generateQuizFn}>Start Quiz</Button>
                    </CardFooter>
            </Card>
            </div>
        )
    }

    if (!quizData || quizData.length === 0) {
        return <div>No questions available</div>;
    }

    const question = quizData[currentQuestion];
  return (
    <div className='flex pt-4'>
        <Card >
                <CardHeader>
                    <CardTitle>Question {currentQuestion + 1} of {quizData.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-lg font-medium pb-2'>{question.question}</p>

                        <RadioGroup className='space-y-2'
                            onValueChange={handleAnswer}
                            value={answers[currentQuestion]}
                        >
                            {question.options.map((option,index)=>{
                                return(
                                    <div className="flex items-center space-x-2 ">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                                )
                            })}
                            
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {showExplanation && (
                        <Button
                            onClick={() => setShowExplanation(true)}
                            variant="outline"
                            disabled={!answers[currentQuestion]}
                        >
                            Show Explanation
                        </Button>
                        )}
                        <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion] || savingQuiz}
                        className="ml-auto"
                        >
                        {savingQuiz && (
                            <BarLoader className="mt-4" width={"100%"} color="gray" />
                        )}
                        {currentQuestion < quizData.length - 1
                            ? "Next Question"
                            : "Finish Quiz"}
                        </Button>
                    </CardFooter>
            </Card>
    </div>
  )
}

export default Quiz