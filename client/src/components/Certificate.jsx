import React, { useEffect, useState } from 'react'

const Certificate = ({ connectRef, username, subject, percentage, date }) => {

    const [certificationId, setCertificationId] = useState('');

    useEffect(() => {
        // Function to generate certification ID
        const generateCertificationId = () => {
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const randomNum = Math.floor(10000 + Math.random() * 90000); // random 5-digit number
            return `BUZZ-${formattedDate}-${randomNum}`;
        };

        // Set certification ID when component mounts
        const newId = generateCertificationId();
        setCertificationId(newId);
    }, []);

    return (
        <div
            ref={connectRef}
            className="flex flex-col justify-between items-center relative bg-[#ffffff] border-8 border-[#e879f9] p-10 shadow-2xl"
            style={{
                width: "1122px",
                height: "793px",
                backgroundColor: "#ffffff"
            }}
        >

            {/* Certificate Title */}
            <div className='flex flex-col items-center'>
                <h1 className="text-5xl md:text-7xl font-bold uppercase text-[#c026d3] z-10 mt-5">
                    Certificate
                </h1>
                <p className="text-2xl md:text-4xl font-bold uppercase text-[#c026d3] z-10 mt-2">
                    of Achievement
                </p>
            </div>

            {/* Main Content */}
            <div className="text-center z-10 mt-6">
                <p className="text-lg md:text-xl font-medium" style={{ color: "#374151" }}>
                    This is to proudly certify that
                </p>

                <h2 className="text-3xl md:text-4xl font-bold my-2 underline" style={{ color: "#111827", textDecorationColor: "#e879f9" }}>
                    {username}
                </h2>

                <p className="text-lg md:text-xl" style={{ color: "#374151" }}>
                    has successfully completed the quiz on
                </p>

                <h3 className="text-2xl md:text-3xl font-semibold my-2" style={{ color: "#1f2937" }}>
                    {subject}
                </h3>

                <p className="text-lg md:text-xl" style={{ color: "#374151" }}>
                    with an outstanding score of
                </p>

                <h4 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: "#e12afb" }}>
                    {percentage}%
                </h4>
            </div>

            {/* Footer Section */}
            <div className="w-full flex justify-between items-center mt-5 px-4 z-10">

                {/* Left side */}
                <div className="text-left">
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                        Provided by
                    </p>
                    <h2 className="text-3xl font-Warnes! font-semibold" style={{ color: "#e12afb" }}>
                        BuzzIQ
                    </h2>
                </div>

                {/* Right side */}
                <div className="text-right">
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                        Date
                    </p>
                    <p className="text-xl font-semibold" style={{ color: "#374151" }}>
                        {date}
                    </p>

                    {/* Certification ID */}
                    {certificationId && (
                        <>
                            <p className="text-sm mt-2" style={{ color: "#6b7280" }}>
                                Certification ID
                            </p>
                            <p className="text-sm font-semibold" style={{ color: "#374151" }}>
                                {certificationId}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center mt-6 z-10" style={{ color: "#9ca3af" }}>
                *This certificate is part of a learning project and does not officially declare a user proficient in the subject.*
            </p>

        </div>
    )
}

export default Certificate