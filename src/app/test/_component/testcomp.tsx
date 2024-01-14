"use client"
import dynamic from 'next/dynamic';
const MatterportViewer = dynamic(() => import('@matterport/r3f').then(module => ({ default: module.MatterportViewer })), {ssr: false})
// import '@matterport/webcomponent'
import { MpSdk } from '@matterport/r3f'
import React, { useEffect, useState, Suspense } from 'react';

// const useMatterportSdk = () => import('@matterport/r3f').then(module => ({ default: module.useMatterportSdk }));

export default function TestComp(){

    // const mpSdk = useMatterportSdk();

    return(
        <Suspense fallback={<div>Loading...</div>}>
            <MatterportViewer
                m="nnuReNVjN1A"
                assetBase="matterport-assets/"
                applicationKey={process.env.NEXT_PUBLIC_MPSDKKEY}
                onPlaying={(mpSdk: MpSdk) => {
                    mpSdk.Camera.rotate(-10, 0);
                }}
            />
        </Suspense>
    )
}