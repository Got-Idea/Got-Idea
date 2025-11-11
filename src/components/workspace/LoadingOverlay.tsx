import React, { FC, useState, useEffect, useRef } from 'react';
import { AnimatedLogoIcon } from '../Icons';

const loadingMessages = [
    { percent: 0, text: 'Warming up the AI...' }, { percent: 20, text: 'Analyzing your prompt...' }, { percent: 45, text: 'Drafting the HTML structure...' }, { percent: 65, text: 'Styling with modern CSS...' }, { percent: 85, text: 'Adding JavaScript functionality...' }, { percent: 95, text: 'Putting on the finishing touches...' }
];

const LoadingOverlay: FC = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(loadingMessages[0].text);
    const messageRef = useRef(loadingMessages[0].text);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (Math.random() * 1.5) + 0.5;
                if (newProgress >= 99) { clearInterval(interval); return 99; }
                const currentMessageDef = loadingMessages.slice().reverse().find(m => newProgress >= m.percent);
                if (currentMessageDef && currentMessageDef.text !== messageRef.current) { setMessage(currentMessageDef.text); messageRef.current = currentMessageDef.text; }
                return newProgress;
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 bg-black/60 z-40 flex flex-col items-center justify-center backdrop-blur-sm text-white p-4 transition-opacity duration-300 ease-in-out">
            <div className="w-full max-w-sm text-center">
                <AnimatedLogoIcon className="w-16 h-16 mx-auto text-white" />
                <p className="mt-6 text-lg font-semibold tracking-wide">{message}</p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-4 overflow-hidden relative"><div className="bg-white h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div><div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_2s_linear_infinite]"></div></div>
                <p className="text-sm text-white/80 mt-2 font-mono">{Math.floor(progress)}%</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
