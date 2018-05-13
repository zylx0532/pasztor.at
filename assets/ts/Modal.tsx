/// <reference path="ModalEventHandler.tsx" />
/// <reference path="JSX.tsx" />

class Modal {
    private readonly _modalDiv: HTMLDivElement;

    public constructor(
        title: Element,
        body: Element,
        footer: Element,
        parentElement: HTMLElement,
        eventHandler: ModalEventHandler
    ) {
        this._modalDiv =
            <div class="modal">
                <div class="modal__background"></div>
                <div class="modal__window">
                    <div class="modal__title">
                        {title}
                    </div>
                    <div class="modal__body">
                        {body}
                    </div>
                    <div class="modal__footer">
                        {footer}
                    </div>
                </div>
            </div>
        ;

        this._modalDiv.addEventListener("keyup", (event: KeyboardEvent) => {
            if (event.code === String.fromCharCode(27)) {
                eventHandler.onClose();
            }
        });

        parentElement.appendChild(this._modalDiv);
    }

    public show() : Promise<Modal> {
        let self = this;
        this._modalDiv.classList.add("modal--hide");
        setTimeout(() => {
            this._modalDiv.classList.add("modal--show");
            this._modalDiv.classList.remove("modal--hide");
        }, 0);
        return new Promise<Modal>(
            (resolve, reject) => setTimeout(() => {resolve(self)}, 675)
        );
    }

    public hide() : Promise<Modal> {
        let self = this;
        this._modalDiv.classList.add("modal--hide");
        this._modalDiv.classList.remove("modal--show");
        return new Promise<Modal>((resolve, reject) => setTimeout(() => {
            this._modalDiv.classList.remove("modal--hide");
            resolve(self);
        }, 675));
    }
}
