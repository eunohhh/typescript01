import TestComp from "./_component/mpWebcomp";
import { TestData } from "@/types/types";
import Start from "./_component/start";
import Image from "next/image";
import { storage } from "@/firebase/firebaseinit";
import { ref, getDownloadURL, listAll, StorageReference } from "firebase/storage";

export const getData = async () => {
    try {
            const response = await fetch(`http://localhost:3000/api/models`);
            const result = await response.json();
            return result;
    } catch(err) {
        console.log(err);
    }
};

export const getModel = async (data : TestData) => {

    const getUrls = async (model: TestData, type: string) => {
        let parentFolder: string = '';
        switch (type) {
            case "video":
                parentFolder = "videos";
                break;
            case "object":
                parentFolder = "glbs";
                break;
            case "plane":
                parentFolder = "planes";
                break;
        }
        const reference = ref(storage, `${parentFolder}/assets${model.route}`);
        const list = await listAll(reference);
        const urlPromises = list.items.map(itemRef => getDownloadURL(itemRef));

        // 모든 URL을 병렬로 가져옵니다.
        const urls = await Promise.all(urlPromises);

        // 가져온 URL을 적절한 모델 배열에 추가합니다.
        if (type === 'video') {
            model.vidsUrl.push(...urls);
        } else if (type === 'object') {
            model.objsUrl.push(...urls);
        } else if (type === 'plane') {
            model.planesUrl.push(...urls);
        } else if (type === 'bgm'){
            const bgmsRef = ref(storage, `bgms/assets${model.route}`);
            const bgmList = await listAll(bgmsRef);
            const bgmUrlPromises = bgmList.items.map(itemRef => getDownloadURL(itemRef));

            const bgmUrls = await Promise.all(bgmUrlPromises);
            model.bgmsUrl.push(...bgmUrls);

            const cdRef = ref(storage, `images/assets/bgmLogo${model.route}`);
            const cdlist = await listAll(cdRef);
            const cdUrlPromises = cdlist.items.map(itemRef => getDownloadURL(itemRef));

            const cdUrls = await Promise.all(cdUrlPromises);
            model.cdUrl.push(...cdUrls);
        }
    }

    const matchedModel = data;
    const imagesRef = ref(storage, 'images');
    const isObjects = matchedModel.object[0];
    const isDownLogo = matchedModel.downLogo[0];
    const isVideo = matchedModel.video[0];
    const isPlane = matchedModel.plane[0];
    const isBgm = matchedModel.isBgm[0];
    const isLogo = matchedModel.logo[0];
    matchedModel.backUrl = '';
    matchedModel.logoUrl = '';
    matchedModel.lowLogoUrl = '';
    matchedModel.songNames = [];
    matchedModel.bgmsUrl = [];
    matchedModel.cdUrl = [];
    matchedModel.vidsUrl = [];
    matchedModel.objsUrl = [];
    matchedModel.planesUrl = [];

    if(isDownLogo){
        const imgRef = ref(imagesRef, `assets/downLogo${matchedModel.route}${matchedModel.route}.png`);
        const downLogoUrl = await getDownloadURL(imgRef);          
        matchedModel.lowLogoUrl = downLogoUrl; // 어레이일 필요가 없어서
    };

    if(isObjects) await getUrls(matchedModel, "object");
    if(isVideo) await getUrls(matchedModel, "video");
    if(isPlane) await getUrls(matchedModel, "plane");
    if(isBgm) await getUrls(matchedModel, 'bgm');
    if(isLogo){
        const logoRef = ref(imagesRef, `assets/logo`);
        const list = await listAll(logoRef);
        const urlPromises = list.items.map(itemRef => getDownloadURL(itemRef));
        const urls : string[] = await Promise.all(urlPromises);

        for(const url of urls){
            if(url.includes(matchedModel.unique)){
                matchedModel.logoUrl = url;
            }
        }
    }

    return matchedModel;
}

export default async function TestPage({ params }: { params: { slug : string } }){

    const { slug } = params;

    const data : TestData = await getData();
    const model : TestData = await getModel(data);

    //height:"calc(var(--vh, 1vh)*100)"
    return(
        <>
            <div style={{position:"absolute", width: "100vw", height: "100vh"}}>
                <Image src={data.back} fill={true} style={{objectFit: "cover"}} priority={true} alt="background image" />
            </div>
            <Start data = {model} />
        </>
    )
}