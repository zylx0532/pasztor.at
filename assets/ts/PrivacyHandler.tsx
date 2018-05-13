/// <reference path="PrivacyView.tsx" />

class PrivacyHandler {
    private readonly _wnd: Window;
    private readonly _doc: Document;
    private readonly _privacyView: PrivacyView;

    public constructor(wnd: Window, doc: Document) {
        this._wnd = wnd;
        this._doc = doc;
        let flags = new Map<string, string>();
        flags.set("google-analytics", "Google Analytics - Helps me understand how you use the site.");

        this._privacyView = new PrivacyView(
            flags,
            doc,
            this.onAccept
        )
    }

    public run() : void {
        this._privacyView.show();
    }

    public onAccept() : void {
        this._privacyView.hide();
    }

}