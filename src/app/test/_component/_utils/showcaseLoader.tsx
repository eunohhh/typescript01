import { MpSdk } from '@matterport/r3f';
import makeWhiteSky from './makewhitesky';

export default async function showcaseLoader(mpSdk : MpSdk) {
    try{

        console.log(mpSdk)
        /** ========= hide pointer ========= */
        const hidepointer = (mpSdk : MpSdk) => {
            mpSdk.Settings.update("features/cursor", false)
                .then(function (data : any) {
                    console.log('CURSOR : ' + data);
                });
        };
        /* ========= hide pucks ========= */
        const sweepPucks = (mpSdk : MpSdk) => {
            mpSdk.Settings.update("features/sweep_pucks", false)
                .then(function (data : any) {
                    console.log('PUCK : ' + data);
                });
        };
        /* ========= hide tag nav ========= */
        const hideTagNav = (mpSdk : MpSdk) => {
            mpSdk.Tag.toggleNavControls(false);
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
        
        hidepointer(mpSdk);
        sweepPucks(mpSdk);
        hideTagNav(mpSdk);

        await makeSceneObject(mpSdk);

    }catch(error){
        console.error(error)
    }
}