export declare class MarkersAreaLearning {
    private _arToolkitContext;
    private subMarkersControls;
    private enabled;
    constructor(arToolkitContext: any, subMarkersControls: any);
    _onSourceProcessed(): void;
    computeResult(): void;
    _getLearnedCoupleStats(subMarkerControls: any): number;
    _getSubMarkerControlsByID(controlsID: any): any;
    toJSON(): string;
    resetStats(): void;
    deleteResult(): void;
}
