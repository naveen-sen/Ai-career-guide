"use client"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useFetch from '@/hooks/use-fetch'
import { resumeSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Download, Edit, Loader, Loader2, Monitor, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { saveResume } from '../../../../../actions/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import EntryForm from './entry-form'
import { entriesMarkdown } from '@/lib/helper'
import MDEditor from '@uiw/react-md-editor'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'



function ResumeBuilder({initialContent}) {
    const [activeTab, setActiveTab] = useState('edit');
    const [resumeMode, setResumeMode] = useState('preview');
    const [previewContent,setPreviewContent] = useState(initialContent)
    const [isGenerating,setIsGenerating] = useState(false)

    const {user} = useUser()

    const {control,register,handleSubmit,watch,formState:{errors}} = useForm({
        resolver:zodResolver(resumeSchema),
        defaultValues:{
            contact:{},
            summary:'',
            skills:'',
            experience:[],
            education:[],
            projects:[],
        }
    })

    const {loading:isSaving,fn:saveResumeFn,data:saveResult,error:saveError,} = useFetch(saveResume)

    const formValues = watch()

    useEffect(()=>{
        if(initialContent) setActiveTab("preview")
    }, [initialContent])

    useEffect(()=>{
        if(activeTab === 'edit'){
            const newContent = getCombinedContent()
            setPreviewContent(newContent ? newContent:initialContent)
        }
    },[formValues,activeTab])

    const getContactMarkdown = ()=>{
        const {contact} = formValues
        const parts = []
        if(contact.email) parts.push(`${contact.email}`)
        if(contact.mobile) parts.push(`${contact.mobile}`)
        if(contact.linkedIn) parts.push(`[LinkedIn]${contact.linkedIn}`)
        if(contact.twitter) parts.push(`[Twitter]${contact.twitter}`)

        return parts.length > 0 ?
         `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
        
    }

    const getCombinedContent = ()=>{
        const {summary,skills,experience,education,projects} = formValues

        return [
            getContactMarkdown(),
            summary && `## Summary\n${summary}`,
            skills && `## Skills\n${skills}`,
            entriesMarkdown(experience,"Work Experience"),
            entriesMarkdown(education,"Education"),
            entriesMarkdown(projects,"Projects"),    
        ]
        .filter(Boolean)
        .join("\n\n")
    }

    useEffect(()=>{
        if(saveResult && !isSaving){
            toast.success("Resume Saved Successfully")
        }
        if(saveError){
            toast.error(saveError.message || "Failed to save resume")
        }
    },[saveResult,saveError,isSaving])

    const onSubmit = async ()=>{
        try{
            await saveResumeFn(previewContent)
        }catch(error){
            console.log("Resume save error",error)
        }
    }

    const generatePDF = async()=>{
        setIsGenerating(true)
        try{
            const html2pdf = (await import('html2pdf.js')).default;

            const element = document.getElementById("resume-to-pdf");

            if (!element) {
            throw new Error("Resume content not found",errors);
        }

        await new Promise((r) => setTimeout(r, 500));
            const opt = {
                margin : [15,15],
                filename: "resume.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            }

            

            await html2pdf().set(opt).from(element).save()
            toast.success("PDF created successfully")
        }catch(error){
            console.log("PDF generation error",error)

        }finally{
            setIsGenerating(false)
        }
    }
  return (
    <div className='space-y-2'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <h1 className='font-bold text-3xl md:text-6xl  bg-gradient-to-b from-rose-900 via-zinc-800 to-slate-700 tracking-tighter text-transparent  bg-clip-text pb-5'>Resume Builder</h1>
        
        <div className='space-x-2'>
            <Button variant="destructive" onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            >   
            {isSaving ?(
                <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin'/>
                Saving...
                </>
            ):(
                <>
                <Save className='h-4 w-4 mr-2' />
                Save Resume
                </>
            )}
            </Button>
            <Button onClick={generatePDF} disabled={isGenerating}>
                {
                    isGenerating?(
                        <>
                        <Loader className='h-4 w-4 mr-2 animate-spin'/>Generating...
                        </>
                    ):(
                        <>
                            <Download className='h-4 w-4 mr-2' />
                            Download PDF
                        </>
                    )
                }
                
            </Button>
            </div>
        </div>

        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl ">
                <TabsList>
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="w-full">
                    <form className='space-y-8 w-full' onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full'>
                            <h3 className='text-lg font-medium pt-5 pb-5'>Contact Information</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50'>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium mb-2'>Email</label>
                                <Input 
                                    {...register("contact.email")}
                                    type="email"
                                    placeholder="your@email.com"
                                    error={errors.contact?.email?.message}
                                    className='mt-2'
                                />
                            {errors.contact?.email && <p className='text-red-500 text-sm'>{errors.contact.email.message}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Mobile Number</label>
                                <Input 
                                    {...register("contact.mobile")}
                                    type="tel"
                                    placeholder="+91 0123456789"
                                    error={errors.contact?.mobile?.message}
                                    className='mt-2'
                                />
                            {errors.contact?.mobile && <p className='text-red-500 text-sm'>{errors.contact.mobile.message}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>LinkedIn</label>
                                <Input 
                                    {...register("contact.linkedIn")}
                                    type="url"
                                    placeholder="https://www.linkedin.com/in/your-profile"
                                    error={errors.contact?.linkedIn?.message}
                                    className='mt-2'
                                />
                            {errors.contact?.linkedIn && <p className='text-red-500 text-sm'>{errors.contact.linkedIn.message}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-sm font-medium'>Twitter/X</label>
                                <Input 
                                    {...register("contact.twitter")}
                                    type="url"
                                    placeholder="https://twitter.com/your-profile"
                                    error={errors.contact?.twitter?.message}
                                    className='mt-2'
                                />
                            {errors.contact?.twitter && <p className='text-red-500 text-sm'>{errors.contact.twitter.message}</p>}
                                </div>
                            </div>

                            <div>
                                <h3 className='text-lg font-medium pt-5 pb-5'>Summary</h3>
                                <Controller
                                name='summary'
                                control={control}
                                render={({field})=>(
                                    <Textarea {...field}
                                    className='h-32'
                                    placeholder='Write a brief summary of your professional background and career goals.'
                                    error={errors.summary?.message}
                                    />
                                    
                                )}
                            />
                            {errors.summary && <p className='text-red-500 text-sm'>{errors.summary.message}</p>}
                            </div>
                            <div>
                                <h3 className='text-lg font-medium pb-5 pt-5'>Skills</h3>
                                <Controller
                                name='skills'
                                control={control}
                                render={({field})=>(
                                    <Textarea {...field}
                                    className='h-32'
                                    placeholder='List your key skills and areas of expertise.'
                                    error={errors.skills?.message}
                                    />
                                    
                                )}
                            />
                            {errors.skills && <p className='text-red-500 text-sm'>{errors.skills.message}</p>}
                            </div>

                            <div>
                                <h3 className='text-lg font-medium pb-5 pt-5'>Education</h3>
                                <Controller
                                name='education'
                                control={control}
                                render={({field})=>(
                                    <EntryForm
                                    type='education'
                                    entries={field.value}
                                    onChange={field.onChange}
                                    />
                                    
                                )}
                            />
                            {errors.education && <p className='text-red-500 text-sm'>{errors.education.message}</p>}
                            </div>

                            <div>
                                <h3 className='text-lg font-medium pb-5 pt-5'>Work Experience</h3>
                                <Controller
                                name='experience'
                                control={control}
                                render={({field})=>(
                                    <EntryForm
                                    type='experience'
                                    entries={field.value}
                                    onChange={field.onChange}
                                    />
                                    
                                )}
                            />
                            {errors.experience && <p className='text-red-500 text-sm'>{errors.experience.message}</p>}
                            </div>

                            <div>
                                <h3 className='text-lg font-medium pb-5 pt-5'>Projects</h3>
                                <Controller
                                name='project'
                                control={control}
                                render={({field})=>(
                                    <EntryForm
                                    type='project'
                                    entries={field.value}
                                    onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.projects && <p className='text-red-500 text-sm'>{errors.projects.message}</p>}
                            </div>

                        </div>
                    </form>
                </TabsContent>
                <TabsContent value="preview">
                    <Button variant='link' type='button' className='mb-2'
                    onClick={()=>setResumeMode(resumeMode==='preview' ? "edit" : "preview")}
                    >
                        
                        {resumeMode==='preview' ?(
                            <>
                                <Edit className='w-4 h-4 mr-2'/>
                                Edit Resume
                            </>
                        ):(
                            <>
                                <Monitor className='h-4 w-4 mr-2'/>
                                Show Preview
                            </>
                        )}
                        
                    </Button>
                    {resumeMode!=='preview' && (
                        <div className='flex p-3 items-center border-2 border-accent text-red-500 rounded mb-2 '>
                            <AlertTriangle className='w-5 h-5 mr-2'/>
                            <span>
                                You will lose edited markdown if you update the form data
                            </span>
                        </div>
                    )}
                    <div>
                        <MDEditor
                        value={previewContent}
                        onChange={setPreviewContent}
                        height={800}
                        preview={resumeMode}
                        />
                    </div>

                    <div
                        id="resume-to-pdf"
                        style={{
                            opacity: 0,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: -9999,
                            backgroundColor: "#ffffff", // ✅ Use hex instead of Tailwind tokens
                            color: "black",   
                            padding: "20px",
                            fontFamily: 'Arial, sans-serif',
                            width: "100%"
                        }}
                        >
                        <MDEditor.Markdown
                            source={previewContent}
                            style={{
                            backgroundColor: "#ffffff",  // ✅ Avoid Tailwind-generated colors
                            color: "black", 
                            }}
                        />
                    </div>
                    
                </TabsContent>
            </Tabs>

            

        </div>
    </div>
  )
}

export default ResumeBuilder