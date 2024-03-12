"use client"
import { TestData } from "@/types/types";
import { useState, useEffect } from "react";
import MainUi from "./mainui";

export default function Start({data} : { data : TestData}){

    const [embed, setEmbed] = useState(false); // 400 이하 임베드
    const [embedMiddle, setEmbedMiddle] = useState(false); // 400 ~ 600 임베드

    useEffect(()=>{

        if(window.innerHeight < 400 && window.parent){
            setEmbed(true);
        } else if(window.innerHeight >= 400 && window.innerHeight <= 600){
            setEmbedMiddle(true);
        }

        /** ============ set screensize =============== */
        function setScreenSize() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        /** ====== Generate a resize event if the device doesn't do it ====== */  
        window.addEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
        window.addEventListener('resize', setScreenSize);
        window.dispatchEvent(new Event("resize"));

        return () => {
            // if(timerRef.current) clearTimeout(timerRef.current);
            window.removeEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
            window.removeEventListener('resize', setScreenSize);
        };

    },[])

    return(
        <MainUi mpModels = {data} embed={embed} embedMiddle={embedMiddle} />
    )

}