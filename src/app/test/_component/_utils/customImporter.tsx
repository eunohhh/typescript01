import { MpSdk } from '@matterport/r3f';
import { TestData } from '@/types/types';

async function customImporter(mpSdk : MpSdk, mpModels : TestData, tagData: object[], tagAttachData : object[]){
    const isObject = mpModels.object[0];
    const isPlane = mpModels.plane[0];

    if(isObject && isPlane){

        // console.log(mpModels.object[1])
        let objectModule = await import(`../_models/${mpModels.object[1]}`);
        let planeModule = await import(`../_models/${mpModels.plane[1]}`);
            // console.log(importedModule)
            await planeModule.default(mpSdk, mpModels, tagData, tagAttachData);
            return await objectModule.default(mpSdk, mpModels, tagData, tagAttachData);

    }else if(isObject){

        let objectModule = await import(`../_models/${mpModels.object[1]}`);
        return await objectModule.default(mpSdk, mpModels, tagData, tagAttachData);

    }else if(isPlane){

        let planeModule = await import(`../_models/${mpModels.plane[1]}`);
        return await planeModule.default(mpSdk, mpModels, tagData, tagAttachData);

    }else{

        return [tagData, tagAttachData, {}, {}];
        
    }
}
export default customImporter;