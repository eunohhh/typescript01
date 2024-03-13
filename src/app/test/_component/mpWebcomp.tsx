"use client"
import dynamic from 'next/dynamic';
const MatterportViewer = dynamic(() => import('@matterport/r3f').then(module => ({ default: module.MatterportViewer })), {ssr: false})
// import '@matterport/webcomponent'
import { MpSdk } from '@matterport/r3f'
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { TestData } from '@/types/types';

// const mpSdk = useMatterportSdk();
// useMatterportSdk 훅은 r3f 캔버스 컴포넌트의 자식들(예를들어 Box 등) 에서만 사용 가능
// 같은 레벨에서 쓸거면 onPlaying 에서 받아서 써야함!!!

interface TestCompProps {
    mpModels: TestData;
}

export default function MpWebComp({
    mpModels, 
    isLoading,
    handleLoading
} : { 
    mpModels : TestData,
    isLoading : boolean,
    handleLoading : (mpSdk : MpSdk) => void;
}){

    const mpWrapperRef = useRef<HTMLDivElement>(null);

    const handleReady = () => {
        const mpDom = document.querySelector('#mpviewer')?.shadowRoot;

        // Apply external styles to the shadow dom
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '/mpcustom.css');

        // Attach the created element to the shadow dom
        mpDom?.appendChild(linkElem);
    }

    useEffect(()=>{
        if(!mpWrapperRef.current) return;

        /** ============ EventListener-IOSsounduUnlocker =============== */ 
        function unLocker(){
            if (document.activeElement === mpWrapperRef.current?.firstElementChild) {
                console.log('%c Yes! The click happened inside the iframe!', 'background: #333333; color: #8dceff');
                // if(mpModels.video[0]) { 
                //     videoRef.current.muted = false;
                //     videoRef.current.pause(); 
                // }
                // if(mpModels.isBgm[0]) { audioRef.current.muted = false }
                window.focus();
                // remove this event listener since it's no longer needed
                window.removeEventListener('click', unLocker);
            };
        };
        
        window.addEventListener('click', unLocker);

        return () => {
            window.removeEventListener('click', unLocker);
        };

    },[mpWrapperRef.current])


    // 조각모음 nnuReNVjN1A

    // 집 NKeB4M7xhbj

    return(
        <Suspense fallback={<div>Loading...</div>}>
            <div style={{ opacity : isLoading ? "0" : "1"}} ref={mpWrapperRef}>
                <MatterportViewer
                    id="mpviewer"
                    m="nnuReNVjN1A"
                    src="&newtags=1&lang=en&play=1&title=0&brand=0&qs=1&help=0"
                    assetBase="matterport-assets/"
                    applicationKey={process.env.NEXT_PUBLIC_MPSDKKEY}
                    onConnected={handleReady}
                    onPlaying={handleLoading}
                />
            </div>
        </Suspense>
    )
}