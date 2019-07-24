import { CardTypes, BootstrapColumns } from "../index";

export class OverlayVm {
    constructor() {
        this.ShowOverlay = false;
        this.BackBttn = true;
        this.CloseBttn = false;
        this.FullScreen = false;
        this.ParentHandlesClose = false;
    }

    public FullScreen: boolean;
    public CloseBttn: boolean;
    public BackBttn: boolean;
    public ShowOverlay: boolean;
    public ParentHandlesClose: boolean;
}

export class CardComponentVM {
    constructor() {
        this.Width = BootstrapColumns.Full;
        this.Type = CardTypes.Default;
    }

    public Width: number;
    public Type: string;
}