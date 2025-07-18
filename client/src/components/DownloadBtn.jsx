import React from 'react'

const DownloadBtn = ({ name, onClick = () => { } }) => {
    return (
        <button
            className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-sm md:text-base rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline-2 focus:outline-[#F0ABFC] focus:outline-offset-4 overflow-hidden"
            onClick={onClick}
        >
            <span className="relative z-20 text-[#F0ABFC]">{name}</span>
            <svg
                width="23px"
                height="23px"
                className="ml-1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16.9C16.3477 18 15.9 18.4477 15.9 19C15.9 19.5523 16.3477 20 16.9 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H7.1C7.65228 20 8.1 19.5523 8.1 19C8.1 18.4477 7.65228 18 7.1 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11V16.5858L9.70711 15.2929C9.31658 14.9024 8.68342 14.9024 8.29289 15.2929C7.90237 15.6834 7.90237 16.3166 8.29289 16.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071L15.7071 16.7071C16.0976 16.3166 16.0976 15.6834 15.7071 15.2929C15.3166 14.9024 14.6834 14.9024 14.2929 15.2929L13 16.5858V11Z"
                        fill="#F0ABFC"
                    ></path>
                </g>
            </svg>

            <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#B873F8] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#B873F8] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#B873F8] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#B873F8] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
        </button>
    )
}

export default DownloadBtn