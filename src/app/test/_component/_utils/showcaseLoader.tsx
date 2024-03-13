import { MpSdk } from '@matterport/r3f';
import makeWhiteSky from './makewhitesky';
import { IObserver, IObservable, ISubscription, App, Tag, Vector3, Color } from '@/types/sdk';
import { TestData, VideoXyz, customTagData, Control } from '@/types/types';
import customImporter from './customImporter';
import { makeVideo, vidController } from '../_utils/makevideo'
import { RefObject } from 'react';

export default async function showcaseLoader(mpSdk : MpSdk, mpModels : TestData, videoRef : RefObject<HTMLVideoElement> | undefined ) : Promise<(customTagData[] | Tag.Attachment[])[]> {
    try{
        // console.log(mpSdk)
        /** ========= hide pointer ========= */
        const hidepointer = (mpSdk : MpSdk) : void => {
            mpSdk.Settings.update("features/cursor", false)
                .then(function (data : boolean) {
                    console.log('CURSOR : ' + data);
                });
        };
        /* ========= hide pucks ========= */
        const sweepPucks = (mpSdk : MpSdk) : void => {
            mpSdk.Settings.update("features/sweep_pucks", false)
                .then(function (data : boolean) {
                    console.log('PUCK : ' + data);
                });
        };
        /* ========= hide tag nav ========= */
        const hideTagNav = (mpSdk : MpSdk) : void => {
            mpSdk.Tag.toggleNavControls(false);
        };

        /** ======== watching tag state ======== */
        const newTagOn = (mpSdk : MpSdk) : void => { 
            mpSdk.Tag.openTags.subscribe({
                prevState: {
                    hovered: null,
                    docked: null,
                    selected: null,
                },
                onChanged(newState: { selected: [(null | undefined)?]; } ) {
                    const [selected = null] = newState.selected; // destructure and coerce the first Set element to null
                    if (selected !== this.prevState.selected) {
                        if (selected) {
                            // if 밖에서 dispatch 하면, 근처 클릭으로도 스테이트 변경됨 주의
                            // dispatch(setTagSid(selected)); // 리덕스 스테이트로 처리 
                            // dispatch(setIspopup(!isPopup));
                            // dispatch(setTagSid(selected));
                        }
                    }
                    this.prevState = {
                        ...newState,
                        selected,
                    };
                },
            })
        };

        const tagSubscribe = async (mpSdk : MpSdk) => {
            let tagArr : Array<object> = [];
            let attachArr : Array<object> = [];

            const tagPromise = new Promise<object[]>((resolve, reject) => {
                mpSdk.Tag.data.subscribe({
                    onAdded: function (index : object) {
                        mpSdk.Tag.allowAction(index, {
                            docking : false,
                            navigating : true,
                            opening : false
                        });
                    },
                    onCollectionUpdated(collection : object) {
                        // console.log('태그목록 ', collection);
                        for(const value of Object.values(collection)){
                            tagArr = [...tagArr, {...value}];
                        };
                        resolve(tagArr);
                    }
                });
            });
            
            const attachPromise = new Promise<object[]>((resolve, reject) => {
                mpSdk.Tag.attachments.subscribe({
                    onCollectionUpdated(collection : object) {
                        // console.log('첨부파일 ', collection )
                        for(const value of Object.values(collection)){
                            attachArr = [...attachArr, value];
                        };
                        resolve(attachArr);
                    },
                });
            })

            const [ tags, attachs ] = await Promise.all([tagPromise, attachPromise]);

            return [ tags, attachs ];
        }

        const appStateCheck = (mpSdk : MpSdk, tags : object[], attachs : object[]) => {
            mpSdk.App.state.subscribe(function (appState : App.State) {   
                if(appState.phase === mpSdk.App.Phase.PLAYING){
                    if(tags.length >= 1) {
                        console.log('%c data receiving completed!', 'background: #333333; color: #8dceff');
                    }else{
                        console.log('%c This model has no tag data', 'background: #333333; color: #8dceff');
                    }
                    if(attachs.length >= 1) {
                        console.log('%c attachments receiving completed!', 'background: #333333; color: #8dceff');
                    }else{
                        console.log('%c This model has no attachments!', 'background: #333333; color: #8dceff');
                    }
                }
            });
        }

        const setTagAttachment = (tagData : customTagData[]) => {
            const regexExp = /\{([^\]\[\r\n]*)\}/; //do not set global flag

            if(tagData.length > 0) {
                const mapped = tagData.map((e, i) =>{
                    let attachments : string[] = [];
                    if(e.attachments !== undefined){
                        attachments = [ ...e.attachments, ...e.customAttach ];
                    }else{
                        attachments = [...e.customAttach];
                    }
                    return {
                        ...e,
                        sortt : e.description.match(regexExp), //[1]
                        attachments : attachments
                    }
                });

                mapped.sort(function(a, b) { 
                    const upperCaseA = a.label.toUpperCase();
                    const upperCaseB = b.label.toUpperCase();
                    if(upperCaseA > upperCaseB) return 1;
                    if(upperCaseA < upperCaseB) return -1;
                    return 0;
                });

                return mapped;
            } else {
                return [];
            }
        }

        const setUniqueCategory = (tagData : customTagData[]) => {
            if(tagData.length > 0){
                const minus = tagData.filter(e => e.sortt !== null);
                const set = new Set(minus.map(item => {
                    return item.sortt && item.sortt[1] ? item.sortt[1] : "";
                }));
                const uniqueArr = [...set]; 

                uniqueArr.sort((a, b) => {
                    // a 또는 b가 undefined일 수 있으므로, 빈 문자열로 대체하여 비교합니다.
                    return a.localeCompare(b);
                });;

                return uniqueArr.filter(item => item !== ""); // 빈 문자열 제거
            }else{
                return [];
            };
        }

        const classify = (tagData : customTagData[], uniqueArr : string[]) => {
            if(tagData.length > 0){
                const unCategorized = tagData.filter(e => e.sortt === null);

                const categorized = tagData.filter((e, i) => { 
                    if(Array.isArray(e.sortt) && uniqueArr.includes(e.sortt[1])) return e;
                });

                categorized.sort(function(a, b) { 
                    const upperCaseA = a.label.toUpperCase();
                    const upperCaseB = b.label.toUpperCase();
                    if(upperCaseA > upperCaseB) return 1;
                    if(upperCaseA < upperCaseB) return -1;
                    return 0;
                });

                const sumArr = [...unCategorized, ...categorized];

                return [sumArr, unCategorized, categorized];
            }else{
                return [[], [], []];
            }
            
        }

        /** ============ scene object ============ */
        const makeSceneObject = async (mpSdk : MpSdk, videoRef : RefObject<HTMLVideoElement> | undefined, videoxyz : VideoXyz, control : Control) => {
            let video : HTMLVideoElement | null;
            if(videoRef !== undefined) video = videoRef.current

            const skyFactory = () => {
                return new makeWhiteSky(mpSdk);
            };
            mpSdk.Scene.register('makeSky', skyFactory);

            const VideoFactory = () => {
                return new makeVideo(mpSdk, video, videoxyz, control.isControl);
            };
            if(mpModels.video[0]) mpSdk.Scene.register('makeVideo', VideoFactory);
            const ppFactory = () => {
                return new vidController(videoxyz, control, mpSdk, video);
            };
            if(control.isControl) mpSdk.Scene.register('makePp', ppFactory);

            const lights = {
                "initial_light": {
                    "enabled": true,
                    "color": {"r": 0.5,"g": 0.5,"b": 0.5},
                    "intensity": 0.1
                },
            }

            const [sceneObject] = await mpSdk.Scene.createObjects(1);
            sceneObject.addNode().addComponent('mp.ambientLight', lights.initial_light); //amb light
            sceneObject.addNode().addComponent('makeSky', skyFactory);

            if(mpModels.video[0]){
                sceneObject.addNode().addComponent('makeVideo', VideoFactory); 
                if(control.isControl) sceneObject.addNode().addComponent('makePp', ppFactory);
            }

            sceneObject.start();
        }
        

        /** =================== init ===================== */
        // 포인터, 퍽, 태그내비게이션 숨기기
        hidepointer(mpSdk);
        sweepPucks(mpSdk);
        hideTagNav(mpSdk);

        // 태그 동작방식 변경
        newTagOn(mpSdk);
        // 매터포트로부터 태그데이터 가져오기
        const [ tags, attachs ] = await tagSubscribe(mpSdk);
        // 앱 스테이트 체크
        appStateCheck(mpSdk, tags, attachs);
        // 모델삽입있을 경우에만 작동하는 커스텀 임포터
        let [ customTagData, customTagAttachData, videoXyz, controlXyz ] : [ customTagData[], Tag.Attachment[], VideoXyz, Control ]= await customImporter(mpSdk, mpModels, tags, attachs);  
        // 태그 기본 설정 : 커스텀첨부와 기존첨부 하나로 합치기, 소트추출, 전체 소팅되어 있음
        customTagData = setTagAttachment(customTagData);
        // 드롭다운 생성을 위한 고유 카테고리 어레이 생성, 소팅 되어있음
        const uniqueCategory = setUniqueCategory(customTagData);
        // 드롭다운 생성을 위한 태그 합친것(분류안됨+분류됨), 분류안됨, 분류됨
        const [sumArr, unCategorized, categorized] = classify(customTagData, uniqueCategory);

        makeSceneObject(mpSdk, videoRef, videoXyz, controlXyz);

        return [ sumArr, unCategorized, categorized, customTagAttachData ];
        

    }catch(error){
        console.error(error)
        throw (error)
    }
}