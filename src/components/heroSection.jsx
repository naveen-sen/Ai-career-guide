"use client"
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'

function HeroSection() {
    const imageRef = useRef(null);
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
            <h1 className='gradient-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 font-extrabold tracking-tighter text-transparent bg-clip-text pb-2 pr-2'>
                Your AI Career Coach For<br/>
                Professional Success
            </h1>
            <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
            </p>
        </div>
        <div>
            <a href='/dashboard'>
                <Button size='lg' className='px-8 mr-2'>
                    Get Started
                </Button>
            </a>
            <a href='/dashboard'>
                <Button size='lg' className='px-8' variant='secondary'>
                    Demo
                </Button>
            </a>
        </div>

        <div className='hero-image-wrapper mt-5 md:mt-0'>
            <div ref={imageRef} className='hero-image'>
                <img 
                    src='/banner.jpg'
                    width={1280}
                    height={720}
                    alt='Sensai Image'
                    className='w-fit rounded-lg shadow-2xl border mx-auto'
                    priority
                />
            </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection