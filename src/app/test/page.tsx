import TestComp from "./_component/mpWebcomp";
import { TestData } from "@/types/types";
import Start from "./_component/start";
import Image from "next/image";

export const getData = async () => {
    try {
            const response = await fetch(`http://localhost:3000/api/models`);
            const result = await response.json();
            return result;
    } catch(err) {
        console.log(err);
    }
};

export default async function TestPage({ params }: { params: { slug : string } }){

    const { slug } = params;

    const data : TestData = await getData();

    //height:"calc(var(--vh, 1vh)*100)"
    return(
        <>
            <div style={{position:"absolute", width: "100vw", height: "100vh"}}>
                <Image src={data.back} fill={true} style={{objectFit: "cover"}} priority={true} alt="background image" />
            </div>
            <Start data = {data} />
        </>
    )
}