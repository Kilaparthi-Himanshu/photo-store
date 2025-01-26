'use client';

import Image from "next/image";
import { useRef, useEffect } from "react";

export default function PhotoModal({ src, alt, onClose }) {
    const imageRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (imageRef.current && !imageRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!src) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div ref={imageRef} className="bg-gray-800 p-4 rounded-lg relative border border-gray-600 flex flex-col">
                <button onClick={onClose} className="text-gray-300 hover:text-white mb-2 self-end">
                    Close
                </button>
                <div className="relative w-[80vw] h-[80vh]">
                    <Image 
                        src={src} 
                        alt={alt}
                        fill={true}
                        style={{objectFit: 'contain', objectPosition: 'center'}}
                        className="rounded-lg" 
                    />
                </div>
            </div>
        </div>
    )
}