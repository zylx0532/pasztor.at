export default class Toggle {
    private readonly _id: string;
    private readonly _label: string;
    private _value: boolean;

    public constructor(id: string, label: string) {
        this._id = id;
        this._label = label;
        this._value = false;
    }

    set value(value: boolean) {
        this._value = value;
    }

    get value() {
        return this._value;
    }
}
