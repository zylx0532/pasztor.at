export default class Modal {
    private readonly _modalDiv: HTMLDivElement;
    private readonly _modalBackgroundDiv: HTMLDivElement;
    private readonly _modalWindowDiv: HTMLDivElement;
    private readonly _titleDiv: HTMLDivElement;
    private readonly _bodyDiv: HTMLDivElement;
    private readonly _footerDiv: HTMLDivElement;

    public constructor(
        title: Element,
        body: Element,
        footer: Element,
        parentElement: HTMLElement,
        eventHandler: ModalEventHandler
    ) {
        this._modalDiv = document.createElement("div");
        this._modalDiv.addEventListener("keyup", (event: KeyboardEvent) => {
            if (event.code === String.fromCharCode(27)) {
                eventHandler.onClose();
            }
        });
        this._modalDiv.classList.add("modal");

        this._modalWindowDiv = document.createElement("div");
        this._modalWindowDiv.classList.add("modal__window");
        this._modalDiv.appendChild(this._modalWindowDiv);

        this._modalBackgroundDiv = document.createElement("div");
        this._modalBackgroundDiv.classList.add("modal__background");
        this._modalBackgroundDiv.addEventListener("click", eventHandler.onClose);
        this._modalWindowDiv.appendChild(this._modalBackgroundDiv);

        this._titleDiv = document.createElement("div");
        this._titleDiv.classList.add("modal__title");
        this._titleDiv.appendChild(title);
        this._modalWindowDiv.appendChild(this._titleDiv);

        this._bodyDiv = document.createElement("div");
        this._bodyDiv.classList.add("modal__body");
        this._bodyDiv.appendChild(body);
        this._modalWindowDiv.appendChild(this._bodyDiv);

        this._footerDiv = document.createElement("div");
        this._footerDiv.classList.add("modal__footer");
        this._footerDiv.appendChild(footer);
        this._modalWindowDiv.appendChild(this._footerDiv);

        parentElement.appendChild(this._modalDiv);
    }

    public show() : Promise<Modal> {
        let self = this;
        this._modalDiv.classList.add("modal--hide");
        setTimeout(() => {
            this._modalDiv.classList.add("modal--show");
            this._modalDiv.classList.remove("modal--show");
        }, 0);
        return new Promise<Modal>(
            (resolve, reject) => setTimeout(() => {resolve(self)}, 250)
        );
    }

    public hide() : Promise<Modal> {
        let self = this;
        this._modalDiv.classList.add("modal--hide");
        this._modalDiv.classList.remove("modal--show");
        return new Promise<Modal>((resolve, reject) => setTimeout(() => {
            this._modalDiv.classList.remove("modal--hide");
            resolve(self);
        }, 250));
    }
}

interface ModalEventHandler {
    /**
     * Callback when a close is desired. The event handler is responsible for actually closing the modal.
     */
    onClose():void;
}
