import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { entrySchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react'
import {React, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { improveWithAI } from '../../../../../actions/resume'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'

const formatDisplayDate = (dateString)=>{
    if(!dateString) return "";
    const date = parse(dateString,'yyyy-MM',new Date());
    return format(date,"MM-yyyy");
}

const EntryForm = ({type,entries=[],onChange}) => {

    const [isAdding,setIsAdding] = useState(false)

    const {reset,register,handleSubmit:handleValidation,watch,formState:{errors},setValue} = useForm({
            resolver:zodResolver(entrySchema),
            defaultValues:{
                title:"",
                organization:"",
                startDate:"",
                endDate:"",
                description:"",
                current:false,
            }
        })

        const {
            loading:isImproving,
            fn:improveWithAIFn,
            data:improvedContent,
            error:improveError
        } = useFetch(improveWithAI)

        const handleDelete = (index)=>{
            const newEntries = entries.filter((_,i)=>i!==index)
            onChange(newEntries)
        }

        const handleAdd = handleValidation((data)=>{
            const formattedEntry = {
                ...data,
                startDate: formatDisplayDate(data.startDate),
                endDate: data.current ? "": formatDisplayDate(data.endDate),
            }

            onChange([...entries,formattedEntry])

            reset()
            setIsAdding(false)
        })

        const handleImproveDescription = async ()=>{
            const description = watch("description");
            if(!description){
                toast.error("Please Enter Description First")
                return;
            }

            await improveWithAIFn({type:type.toLowerCase(),current:description})
        }

        useEffect(()=>{
            if(improvedContent && !isImproving){
                setValue("description",improvedContent)
                toast.success("Description Improved Successfully")
            }
        },[improvedContent,isImproving,improveError])

        const current = watch("current")
  return (
    <div>
        <div>
            {entries.map((item, index) => {
    return (
        <Card key={index} className="mb-4">
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                    {item.title} @ {item.organization}
                </CardTitle>
                <Button 
                    variant='ghost' 
                    size='sm'
                    className='h-8 w-8 p-0' 
                    onClick={() => handleDelete(index)}
                >
                    <X className='h-4 w-4 hover:text-destructive' />
                </Button>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>
                    {item.current
                        ? `${item.startDate} - Present`
                        : `${item.startDate} - ${item.endDate}`}
                </p>
                <p className='mt-2 text-sm whitespace-pre-wrap'>{item.description}</p>
             </CardContent>
          </Card>
         );
        })}
        </div>
        {isAdding && (
            <Card>
                <CardHeader>
                    <CardTitle>Add {type}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Input
                            placeholder='Title'
                            {...register("title")}
                            error={errors.title}
                            />
                            {errors.title && (
                                <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Input
                            placeholder='Organization/company'
                            {...register("organization")}
                            error={errors.organization}
                            />
                            {errors.organization && (
                                <p className='text-red-500 text-sm mt-1'>{errors.organization.message}</p>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div space-y-2>
                            <Input
                            type='month'
                            placeholder='Start Date'
                            {...register("startDate")}
                            error={errors.startDate}
                            />
                            {errors.startDate && (
                                <p className='text-red-500 text-sm mt-1'>{errors.startDate.message}</p>
                            )}
                        </div>
                        <div space-y-2>
                            <Input
                            type='month'
                            placeholder='End Date'
                            {...register("endDate")}
                            disabled={current}
                            error={errors.endDate}
                            />
                            {errors.endDate && (
                                <p className='text-red-500 text-sm mt-1'>{errors.endDate.message}</p>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <input
                        type='checkbox'
                        {...register("current")}
                        checked={current}
                        onChange={(e)=>{
                            setValue("current",e.target.checked)
                            if(e.target.checked){
                                setValue("endDate","");
                            }
                        }}
                        />
                        <label htmlFor='current'>Current {type}</label>
                    </div>
                    <div>
                        <Textarea
                        placeholder={`Describe your ${type.toLowerCase()} `}
                        {...register("description")}
                        error={errors.description}
                        />
                        {errors.description && (
                            <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>
                        )}
                    </div>

                    <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={handleImproveDescription}
                    disabled={isImproving || !watch("description")}
                    >
                        {isImproving?(
                            <>
                                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                Improving...
                            </>
                        ):(
                            <>
                                <Sparkles className='h-4 w-4 mr-2' />
                                Improve with AI
                            </>
                        )}
                    </Button>
                </CardContent>
                <CardFooter className='flex justify-end space-x-2'>
                    <Button type='button' variant='primary' onClick={ ()=>{reset()
                    setIsAdding(false)
                     }}>
                        Cancel
                    </Button>
                    <Button
                     type='button'
                     onClick={handleAdd}
                    >
                        <PlusCircle className='h-4 w-4 mr-2'/>
                            Add Entry
                        
                    </Button>
                </CardFooter>
                
            </Card>

        )}
        {
            !isAdding && (
                <Button
                className='w-full'
                variant='outline'
                onClick={()=>setIsAdding(true)}
            >
               <PlusCircle className='h-4 w-4 mr-2'/>
               Add {type}
            </Button>
        )}
    </div>
  )
}

export default EntryForm