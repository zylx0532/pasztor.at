export default class PrivacyView {
    private readonly _modal: Modal;
    private readonly _titleElement: Element;
    private readonly _bodyElement: Element;
    private readonly _footerElement: Element;
    private readonly _toggles: Map<string, Toggle>;

    public constructor(flags: Map<string, string>, doc: Document, onAccept: Function) {
        this._titleElement = document.createElement("h1");
        this._titleElement.textContent = "Sorry to bother you, but privacy is important";

        this._bodyElement = document.createElement("div");
        this._footerElement = document.createElement("div");

        let acceptButton = document.createElement("button");
        acceptButton.textContent = "OK, looks good";
        acceptButton.addEventListener("click", () => {onAccept()});
        this._footerElement.appendChild(acceptButton);

        this._modal = new Modal(
            this._titleElement,
            this._bodyElement,
            this._footerElement,
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