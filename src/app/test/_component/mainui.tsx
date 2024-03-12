"use client"
import { TestData } from '@/types/types';
import styles from '../page.module.css';
import React, { useState, useEffect, useRef } from "react";
import HelpLoader from './_loaders/helploader';
import MpWebComp from './mpWebcomp';
import { MpSdk } from '@matterport/r3f';
import showcaseLoader from './_utils/showcaseLoader';

interface TestCompProps {
    mpModels: TestData;
}

const mouseHelpText = '마우스 휠을 통해 줌 인 줌 아웃이 가능합니다.\n마우스 드래그를 통해 공간을 둘러볼 수 있습니다.';
const keyboardHelpText = '키보드 방향키를 통해 위치를 이동할 수 있습니다.';

export default function MainUi ({
    mpModels, 
    embed, 
    embedMiddle } : { 
    mpModels : TestData,
    embed : Boolean,
    embedMiddle : Boolean
}) {

    const [ webCompLoaded, setWebCompLoaded ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true); 
    const [ opacityT, setOpacityT ] = useState(1); // 타이틀 오퍼시티
    const [ opacityL, setOpacityL ] = useState(1); // 로딩 오퍼시티
    const [ startClassName, setClassName ] = useState(styles.start_button_box); // 스타트시 로고 노출
    const [ pointerEv, setPointerEv ] = useState("none" as React.CSSProperties["pointerEvents"]); // 기본 포인터 동작 none으로 시작(엔터 클릭 못하게)
    const [ opacity, setOpacity ] = useState(0); // 스타트버튼 오퍼시티

    const playBtn = useRef<HTMLDivElement>(null);

    const handleLoading = (mpSdk : MpSdk) => {
        setWebCompLoaded(true); // 웹컴포넌트 로드 상태 트루

        showcaseLoader(mpSdk, mpModels); // 쇼케이스 로더 => 대부분의 작업을 여기서??

    };

    const handleStart = () => {
        if(embed && window.parent) { 
            window.open(window.location.href);
        } else {
            setIsLoading(false);
            setOpacity(0);
        }
    };

    useEffect(() => {
        // console.log(webCompLoaded)
        if(webCompLoaded){
            setOpacityL(0);
            setOpacity(1);
            setPointerEv("all");
        }
    }, [webCompLoaded])

    return(
        <>
            { mpModels.video[0] && ( 
                // <VideoComp mpModels={mpModels} bindArr={bindArr}/> 
                <div></div>
            )}
            { isLoading && ( 
                <div className={styles.loading_page} >
                    <div className={styles.tint}>
                        <div className={styles.basic_title} style={{ height : opacityT === 0 ? "30px" : "fit-content", fontSize : opacityT === 0 ? "1rem" : "5vh" }} dangerouslySetInnerHTML={{__html : mpModels.title }}></div>
                        <div className={styles.start_button} >
                            
                            <div className={styles.helpbox} style={{height: embedMiddle && "70%"}}>
                                <div className={styles.helpboxflex} style={{display : embed && "none", height : embedMiddle && "50%"}}>
                                    <div style={{position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                                        <div className={styles.mousebox}>
                                            <div className={styles.mouse}></div>
                                        </div>
                                        <div className={styles.textone}>
                                            <div className={styles.helptextbox}>
                                                <p className={styles.helptext} style={{whiteSpace: "pre-line", position: "relative", width: "100%"}}>{mouseHelpText}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{position: "relative", width: "100%", height: "100%", flexDirection: "column", display: "flex"}}>
                                        <div className={styles.keyboardbox}>
                                            <div className={styles.keyboard}></div>
                                        </div>
                                        <div className={styles.texttwo}>
                                            <div className={styles.helptextbox}>
                                                <p className={styles.helptext} style={{whiteSpace: "pre-line", position: "relative", width: "100%"}}>{keyboardHelpText}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.helpbottom} style={{position:"relative", width: "100%", display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", boxSizing: "border-box"}}>
                                    <HelpLoader opacity={opacityL} embed={embed} embedMiddle={embedMiddle} />
                                    <div 
                                        className={startClassName} 
                                        ref={playBtn} 
                                        style={{ 
                                            pointerEvents: pointerEv, 
                                            opacity : opacity, 
                                            top: embed && "2.5rem", 
                                            fontSize: embedMiddle ? "1.5rem" : 
                                            embed ? "1.2rem" : "1rem", 
                                            width: embedMiddle ? "6rem" : embed && "5rem", 
                                            height: embedMiddle ? "2.5rem" : embed && "2rem",
                                            zIndex: "20"
                                        }}
                                        onClick={handleStart}>
                                            <p style={{ display: startClassName === styles.change ? "none" : "block"}}>enter</p>
                                    </div>
                                </div>

                                {/* { mpModels.downLogo[0] && !embed && ( <div className={styles.basic_logo} style={{ backgroundImage : `url('${mpModels.lowLogoUrl}')`, backgroundSize : 'contain', backgroundRepeat : "no-repeat", backgroundPosition :"center"}}></div> )} */}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* {fullyReady && (<DropdownTagList iframe={selIframe.current} bindArr={bindArr} mpModels={mpModels} modelInfo={modelInfo}></DropdownTagList>)} */}

            <MpWebComp mpModels = {mpModels} isLoading = {isLoading} handleLoading = {handleLoading} />

            {/* <div className={styles.container_showcase}>
                <iframe 
                    title="mpIframe"
                    id="myIframe" 
                    ref={selIframe} 
                    className={styles.showcaseTop}
                    width="100%" 
                    height="100%" 
                    allow="geolocation"
                    // sandbox="allow-scripts allow-same-origin"
                    allowFullScreen
                    src={process.env.NEXT_PUBLIC_BUNDLEADDRESS + params}
                    style={{ zIndex : zIndex, filter : (isInfoPopup||isPopup) ? "blur(1px)" : "none" }}
                    onLoad={handleLoad}>
                </iframe>
            </div> */}
        </>
    )
}