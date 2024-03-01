"use client"
import MpWebComp from "./testcomp"
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

    },[])

    return(
        <MainUi mpModels = {data} embed={embed} embedMiddle={embedMiddle} />
    )

}