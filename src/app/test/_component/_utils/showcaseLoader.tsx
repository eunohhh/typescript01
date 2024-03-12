import { MpSdk } from '@matterport/r3f';
import makeWhiteSky from './makewhitesky';
import { IObserver, IObservable, ISubscription, App, Tag } from '@/types/sdk';
import { TestData } from '@/types/types';

export default async function showcaseLoader(mpSdk : MpSdk, mpModels : TestData) {
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
        };

        /** ============ scene object ============ */
        const makeSceneObject = async (mpSdk : MpSdk) => {
            const skyFactory = () => {
                return new makeWhiteSky(mpSdk);
            };
            mpSdk.Scene.register('makeSky', skyFactory);
    
            const [sceneObject] = await mpSdk.Scene.createObjects(1);
            sceneObject.addNode().addComponent('makeSky', skyFactory);
            sceneObject.start();
        }
        

        /** ================ init ================== */
        hidepointer(mpSdk);
        sweepPucks(mpSdk);
        hideTagNav(mpSdk);

        newTagOn(mpSdk);

        const [ tags, attachs ] = await tagSubscribe(mpSdk);

        appStateCheck(mpSdk, tags, attachs);

        await makeSceneObject(mpSdk);

    }catch(error){
        console.error(error)
    }
}