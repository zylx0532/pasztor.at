/// <reference path="Toggle.tsx" />
/// <reference path="Modal.tsx" />
/// <reference path="ModalEventHandler.tsx" />

class PrivacyView {
    private readonly _modal: Modal;
    private readonly _toggles: Map<string, Toggle>;

    public constructor(flags: Map<string, string>, doc: Document, onAccept: Function) {
        this._modal = new Modal(
            <h1>Hey, a little privacy checkup?</h1>,
            <div></div>,
            <button onClick={() => {this.hide()}}>OK, looks good</button>,
            doc.body,
            new PrivacyViewModalEventHandler(this)
        );

        this._toggles = new Map<string, Toggle>();
        for (let key of flags.keys()) {
            let toggle = new Toggle(
                "privacy__toggle--" + key,
                flags.get(key) || ""
            );
            this._toggles.set(key, toggle);
        }
    }

    public setFlag(flag: string, value: boolean): void {
        let toggle = this._toggles.get(flag);
        if (typeof toggle === "undefined") {
            throw "Unknown privacy flag: " + flag;
        }
        toggle.value = value;
    }

    public getFlag(flag: string): boolean {
        let toggle = this._toggles.get(flag);
        if (typeof toggle === "undefined") {
            throw "Unknown privacy flag: " + flag;
        }
        return toggle.value;
    }

    public show(): void {
        this._modal.show();
    }

    public hide(): void {
        this._modal.hide();
    }
}

class PrivacyViewModalEventHandler implements ModalEventHandler {
    private readonly _privacyView: PrivacyView;
    constructor(privacyView: PrivacyView) {
        this._privacyView = privacyView;
    }

    onClose(): void {
        //ignore
    }
}