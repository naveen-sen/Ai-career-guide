"use client"
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, formatDistanceToNow } from 'date-fns';
import { Brain, BrainCircuit, BrainCogIcon, Briefcase, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';


function DashboardView({ insights }) {
    const salaryData = insights.salaryRange.map((range)=>({
        name:range.role,
        min:range.min/1000,
        max:range.max/1000,
        median:range.median/1000
    }))

    const getDemandLevel = (level)=>{
        switch(level.toLowerCase()){
            case "high":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }

    const getMarketOutLook = (outlook)=>{
        switch(outlook.toLowerCase()){
            case "positive":
                return {icon:TrendingUp,color:"bg-green-500"};
            case "neutral":
                return {icon:LineChart,color:"bg-yellow-500"};
            case "negative":
                return {icon:TrendingDown,color:"bg-red-500"};
            default:
                return {icon:LineChart,color:"bg-gray-500"};
        }
    }
    
    const OutLookIcon = getMarketOutLook(insights.marketOutLook).icon;
    const outlookColor = getMarketOutLook(insights.marketOutLook).color

    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");

    const nextUpdateDate = formatDistanceToNow(
        new Date(insights.nextUpdate),
        {addSuffix:true}
    )

  return (
    <div className='space-y-2'>
        <div className='flex justify-between items-center'>
            <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Market Outlook</CardTitle>
                    <TrendingUp className={`h-4 w-4 ${outlookColor}`} />
                </CardHeader>
                <CardContent>
                    <div className='text-xl font-bold'>{insights.marketOutLook}</div>
                    <p className='text-xs text-muted-foreground pt-2'>Next Update {nextUpdateDate}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle>Industry Growth</CardTitle>
                    <TrendingUp className='h-4 w-4 text-green-500' />	
                </CardHeader>
                <CardContent>
                    <div className='text-xl font-bold'>{insights.growthRate.toFixed(1)}%</div>
                    <Progress value={insights.growthRate} className='mt-2' />
                    <p className='text-xs text-muted-foreground pt-2'>Next Update {nextUpdateDate}</p>
                </CardContent>
        </Card>


            <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>Demand Level</CardTitle>
                <Briefcase className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                <div className='text-xl font-bold'>{insights.demandLevel}</div>
                <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevel(insights.demandLevel)}`}></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>Top Skills</CardTitle>
                <BrainCircuit className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                <div className='flex flex-wrap gap-2'>
                    {insights.topSkills.map((skill)=>(
                        <Badge key={skill} variant='secondary'>{skill}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>Salary Range By Role</CardTitle>
                <CardDescription>
                    <p className='text-xs text-muted-foreground  '>Displaying Minimum, Median and Maximum Salaries (in INR)</p>
                </CardDescription>
            </CardHeader>
            <CardContent className='w-full'>
                <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"
                            tick={{ fontSize: 16 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={150}
                    />
                    <YAxis />
                    <Tooltip content={({active,payload,label})=>{
                        return(
                            <div className='bg-background border rounded-lg p-2 shadow-md'>
                                <p className='font-medium'>{label}</p>
                                {payload.map((item)=>(
                                    <p key={item.name} className='text-sm'>{item.name}: {item.value}K</p>
                                ))}
                            </div>
                        )
                    }} />
                    <Bar dataKey="min" fill="#8884d8" />
                    <Bar dataKey="median" fill="#ffc658" />
                    <Bar dataKey="max" fill="#82ca9d" />
                </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Key Industry Trends</CardTitle>
                <CardDescription >
                    <p className='text-sm font-muted-foreground pl-2'>Current Skills Shaping the Industry</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className='space-y-0'>
                    {insights.keyTrends.map((trend)=>(
                        <li key={trend} className='flex items-start space-x-2'>
                        <div className='h-2 w-2 rounded-full bg-primary mt-2'></div>
                            <span className='space-y-0 pl-4'>
                                {trend}
                            </span>
                    </li>))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-2xl font-bold'>Recommended Skills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-wrap gap-2'>
                    {insights.recommendedSkill.map((skill)=>(
                        <Badge key={skill} variant='secondary'>{skill}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
        </div>
    </div>
  )
}

export default DashboardView
