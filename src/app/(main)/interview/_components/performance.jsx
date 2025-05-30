"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Performance = ({assessments}) => {
  const [chart,setChart] = useState([]);

  useEffect(()=>{
    const newChart = assessments.map(assessment => ({
      date:format(new Date(assessment.createdAt), 'MMM dd'),
      score: assessment.quizScore,
    }));
    setChart(newChart);
  },[assessments]);
  return (
    <div>
      <div className='py-4 px-4'>
        <Card>
          <CardHeader>
            <div className='flex justify-between items-center '>
              <CardTitle className='text-2xl font-bold pl-2'>Performance Trends
              </CardTitle>
              <Trophy className={`h-7 w-7 text-yellow-500`}  />
            </div>
              
              <CardDescription className='pl-2'>Your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className=' h-[300px]'>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart

                  data={chart}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={({active,payload})=>{
                    if(active && payload?.length){
                      return (
                        <div className='bg-background border rounded-lg p-2 shadow-lg'>
                          <p className='text-sm font-medium'>Score: {payload[0].value.toFixed(1)}%</p>
                          <p className='text-xs text-muted-foreground'>Date: {payload[0].payload.date}</p>
                        </div>
                      )
                    }
                  }}/>
                  {/* <Legend /> */}
                  <Line type="monotone" dataKey="score" stroke="gray" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
