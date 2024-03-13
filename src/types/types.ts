import { Vector3, Color, Tag } from "./sdk";

export interface TestData {
    back: string;
    description: string;
    downLogo: [boolean, string];
    isBgm: [boolean, string];
    isPublic: boolean;
    keywords: string;
    logo: [boolean, string];
    object: [boolean, string];
    plane: [boolean, string];
    screenxyz: boolean;
    sid: string;
    time: Date;
    title: string;
    unique: string;
    url: string;
    video: [boolean, string];
    route: string;
    urlKey : string;
    parentFolder : string;
    backUrl: string;
    logoUrl: string;
    lowLogoUrl: string;
    vidsUrl: string[];
    objsUrl: string[];
    planesUrl: string[];
    songNames: string[];
    bgmsUrl: string[];
    cdUrl: string[];
}
export interface customTagData extends Tag.TagData {
    id: string;
    anchorPosition: Vector3;
    discPosition: Vector3;
    stemVector: Vector3;
    stemHeight: number;
    stemVisible: boolean;
    label: string;
    description: string;
    color: Color;
    roomId: string;
    /** The ids of the attachments currently attached to this tag */
    attachments: string[];
    customAttach : string[];
    keywords: string[];
    /** Read-only Font Awesome id for icons set in workshop, e.g. "face-grin-tongue-squint"
     * This value does not change if [[Tag.editIcon]] is used. This value is an empty string if no fontId was set.
    */
    fontId: string;
    sortt: RegExpMatchArray | null;
}

export interface VideoXyz {
    isVideo : boolean;
    position : number[];
    backPosition : number[];
    rotation : number[]; 
    scale : number[];
}

export interface Control {
    isControl : boolean; 
    position : number[];
}