export declare class MarkersAreaUtils {
    static navigateToLearnerPage(learnerBaseURL: any, trackingBackend: string): void;
    static storeDefaultMultiMarkerFile(trackingBackend: string): void;
    static createDefaultMultiMarkerFile(trackingBackend: string): {
        meta: {
            createdBy: string;
            createdAt: string;
        };
        trackingBackend: string;
        subMarkersControls: any[];
    };
    static createDefaultMarkersControlsParameters(trackingBackend: any): {
        type: string;
        patternUrl: string;
    }[];
    static storeMarkersAreaFileFromResolution(trackingBackend: string, resolutionW: number, resolutionH: number): void;
    static buildMarkersAreaFileFromResolution(trackingBackend: string, resolutionW: number, resolutionH: number): {
        meta: {
            createdBy: string;
            createdAt: string;
        };
        trackingBackend: string;
        subMarkersControls: any[];
    };
}
