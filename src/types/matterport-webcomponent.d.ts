export * from '@matterport/webcomponent/built-bundle/sdk';

import type { MpSdk } from '@matterport/webcomponent/built-bundle/sdk';

interface MatterportViewerEventMap extends HTMLElementEventMap {
    mpSdkConnected: CustomEvent<{ mpSdk: MpSdk }>;
    mpSdkPlaying: CustomEvent<{ mpSdk: MpSdk }>;
    mpViewerError: CustomEvent<{ error: Error }>;
}

declare global {
    // interface MatterportViewer extends HTMLElement {
    interface MatterportViewer extends React.HTMLAttributes<HTMLElement> {
        
        m: string;

        mpSdk: MpSdk;

        playingPromise: Promise<MpSdk>;

        sdkPromise: Promise<MpSdk>;

        // 240104 added lines
        // newtags?: string;
        // lang?: string;
        // play?: string;
        // title?: string;
        // brand?: string;
        // qs?: string;
        // help?: string;
        // applicationKey?: string;

        // Augment listener methods with our additional custom event types
        addEventListener<K extends keyof MatterportViewerEventMap>(type: K, listener: (this: HTMLElement, ev: MatterportViewerEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof MatterportViewerEventMap>(type: K, listener: (this: HTMLElement, ev: MatterportViewerEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    }
    namespace JSX {

        interface IntrinsicElements {
            // 'matterport-viewer': React.DetailedHTMLProps<React.HTMLAttributes<MatterportViewer>, MatterportViewer>;
            'matterport-viewer': MatterportViewer;
        }
    }
}


// interface MatterportViewer extends HTMLElement {
//     m: string;
//     qs: string;
//     mls: string;
//     // 여기에 다른 필요한 프로퍼티들을 추가할 수 있습니다.
// }

// declare global {
//     namespace JSX {
//         interface IntrinsicElements {
//             'matterport-viewer': React.DetailedHTMLProps<React.HTMLAttributes<MatterportViewer>, MatterportViewer>;
//         }
//     }
// }
// export {};