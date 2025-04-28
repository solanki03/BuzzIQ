import React from 'react'

const RateUsButton = ({name, onClick = () => { } }) => {
    return (
        <button className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,#2dd4bf,#3b82f6,#8b5cf6)] before:[filter:blur(calc(0.8*1rem))] bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,#2dd4bf,#3b82f6,#8b5cf6)] hover:scale-105 active:scale-95 h-10 px-4 py-2 inline-flex" onClick={onClick} >
            <div className="flex items-center">
                    <span className="ml-1 text-white lg:inline p-1">{name}</span>
            </div>
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                <svg className="size-4 text-gray-500 transition-all duration-200 group-hover:text-yellow-300" data-slot="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" fillRule="evenodd" />
                </svg>
            </div>
        </button>
    )
}

export default RateUsButton