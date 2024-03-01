"use client"
import dynamic from 'next/dynamic';
const MatterportViewer = dynamic(() => import('@matterport/r3f').then(module => ({ default: module.MatterportViewer })), {ssr: false})
// import '@matterport/webcomponent'
import { MpSdk } from '@matterport/r3f'
import React, { useEffect, useState, Suspense } from 'react';
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

    return(
        <Suspense fallback={<div>Loading...</div>}>
            <div style={{ opacity : isLoading ? "0" : "1"}}>
                <MatterportViewer
                    m="nnuReNVjN1A"
                    assetBase="matterport-assets/"
                    applicationKey={process.env.NEXT_PUBLIC_MPSDKKEY}
                    onPlaying={handleLoading}
                />
            </div>
        </Suspense>
    )
}