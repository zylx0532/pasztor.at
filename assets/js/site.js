"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
define("_site/assets/js/Modal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Modal = (function () {
        function Modal(title, body, footer, parentElement, eventHandler) {
            this._modalDiv = document.createElement("div");
            this._modalDiv.addEventListener("keyup", function (event) {
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
        Modal.prototype.show = function () {
            var _this = this;
            var self = this;
            this._modalDiv.classList.add("modal--hide");
            setTimeout(function () {
                _this._modalDiv.classList.add("modal--show");
                _this._modalDiv.classList.remove("modal--show");
            }, 0);
            return new Promise(function (resolve, reject) { return setTimeout(function () { resolve(self); }, 250); });
        };
        Modal.prototype.hide = function () {
            var _this = this;
            var self = this;
            this._modalDiv.classList.add("modal--hide");
            this._modalDiv.classList.remove("modal--show");
            return new Promise(function (resolve, reject) { return setTimeout(function () {
                _this._modalDiv.classList.remove("modal--hide");
                resolve(self);
            }, 250); });
        };
        return Modal;
    }());
    exports.default = Modal;
});
var PrivacyHandler = (function () {
    function PrivacyHandler(wnd, doc) {
        this._wnd = wnd;
        this._doc = doc;
        var flags = new Map();
        flags.set("google-analytics", "Google Analytics - Helps me understand how you use the site.");
        this._privacyView = new PrivacyView(flags, doc, this.onAccept);
    }
    PrivacyHandler.prototype.run = function () {
        this._privacyView.show();
    };
    PrivacyHandler.prototype.onAccept = function () {
        this._privacyView.hide();
    };
    return PrivacyHandler;
}());
define("_site/assets/js/PrivacyView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrivacyView = (function () {
        function PrivacyView(flags, doc, onAccept) {
            this._titleElement = document.createElement("h1");
            this._titleElement.textContent = "Sorry to bother you, but privacy is important";
            this._bodyElement = document.createElement("div");
            this._footerElement = document.createElement("div");
            var acceptButton = document.createElement("button");
            acceptButton.textContent = "OK, looks good";
            acceptButton.addEventListener("click", function () { onAccept(); });
            this._footerElement.appendChild(acceptButton);
            this._modal = new Modal(this._titleElement, this._bodyElement, this._footerElement, doc.body, new PrivacyViewModalEventHandler(this));
            this._toggles = new Map();
            try {
                for (var _a = __values(flags.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    var toggle = new Toggle("privacy__toggle--" + key, flags.get(key) || "");
                    this._toggles.set(key, toggle);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _c;
        }
        PrivacyView.prototype.setFlag = function (flag, value) {
            var toggle = this._toggles.get(flag);
            if (typeof toggle === "undefined") {
                throw "Unknown privacy flag: " + flag;
            }
            toggle.value = value;
        };
        PrivacyView.prototype.getFlag = function (flag) {
            var toggle = this._toggles.get(flag);
            if (typeof toggle === "undefined") {
                throw "Unknown privacy flag: " + flag;
            }
            return toggle.value;
        };
        PrivacyView.prototype.show = function () {
            this._modal.show();
        };
        PrivacyView.prototype.hide = function () {
            this._modal.hide();
        };
        return PrivacyView;
    }());
    exports.default = PrivacyView;
    var PrivacyViewModalEventHandler = (function () {
        function PrivacyViewModalEventHandler(privacyView) {
            this._privacyView = privacyView;
        }
        PrivacyViewModalEventHandler.prototype.onClose = function () {
        };
        return PrivacyViewModalEventHandler;
    }());
});
define("_site/assets/js/Toggle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Toggle = (function () {
        function Toggle(id, label) {
            this._id = id;
            this._label = label;
            this._value = false;
        }
        Object.defineProperty(Toggle.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });
        return Toggle;
    }());
    exports.default = Toggle;
});
var privacyHandler = new PrivacyHandler(window, document);
privacyHandler.run();
define("assets/js/Modal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Modal = (function () {
        function Modal(title, body, footer, parentElement, eventHandler) {
            this._modalDiv = document.createElement("div");
            this._modalDiv.addEventListener("keyup", function (event) {
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
        Modal.prototype.show = function () {
            var _this = this;
            var self = this;
            this._modalDiv.classList.add("modal--hide");
            setTimeout(function () {
                _this._modalDiv.classList.add("modal--show");
                _this._modalDiv.classList.remove("modal--show");
            }, 0);
            return new Promise(function (resolve, reject) { return setTimeout(function () { resolve(self); }, 250); });
        };
        Modal.prototype.hide = function () {
            var _this = this;
            var self = this;
            this._modalDiv.classList.add("modal--hide");
            this._modalDiv.classList.remove("modal--show");
            return new Promise(function (resolve, reject) { return setTimeout(function () {
                _this._modalDiv.classList.remove("modal--hide");
                resolve(self);
            }, 250); });
        };
        return Modal;
    }());
    exports.default = Modal;
});
var PrivacyHandler = (function () {
    function PrivacyHandler(wnd, doc) {
        this._wnd = wnd;
        this._doc = doc;
        var flags = new Map();
        flags.set("google-analytics", "Google Analytics - Helps me understand how you use the site.");
        this._privacyView = new PrivacyView(flags, doc, this.onAccept);
    }
    PrivacyHandler.prototype.run = function () {
        this._privacyView.show();
    };
    PrivacyHandler.prototype.onAccept = function () {
        this._privacyView.hide();
    };
    return PrivacyHandler;
}());
define("assets/js/PrivacyView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrivacyView = (function () {
        function PrivacyView(flags, doc, onAccept) {
            this._titleElement = document.createElement("h1");
            this._titleElement.textContent = "Sorry to bother you, but privacy is important";
            this._bodyElement = document.createElement("div");
            this._footerElement = document.createElement("div");
            var acceptButton = document.createElement("button");
            acceptButton.textContent = "OK, looks good";
            acceptButton.addEventListener("click", function () { onAccept(); });
            this._footerElement.appendChild(acceptButton);
            this._modal = new Modal(this._titleElement, this._bodyElement, this._footerElement, doc.body, new PrivacyViewModalEventHandler(this));
            this._toggles = new Map();
            try {
                for (var _a = __values(flags.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    var toggle = new Toggle("privacy__toggle--" + key, flags.get(key) || "");
                    this._toggles.set(key, toggle);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _c;
        }
        PrivacyView.prototype.setFlag = function (flag, value) {
            var toggle = this._toggles.get(flag);
            if (typeof toggle === "undefined") {
                throw "Unknown privacy flag: " + flag;
            }
            toggle.value = value;
        };
        PrivacyView.prototype.getFlag = function (flag) {
            var toggle = this._toggles.get(flag);
            if (typeof toggle === "undefined") {
                throw "Unknown privacy flag: " + flag;
            }
            return toggle.value;
        };
        PrivacyView.prototype.show = function () {
            this._modal.show();
        };
        PrivacyView.prototype.hide = function () {
            this._modal.hide();
        };
        return PrivacyView;
    }());
    exports.default = PrivacyView;
    var PrivacyViewModalEventHandler = (function () {
        function PrivacyViewModalEventHandler(privacyView) {
            this._privacyView = privacyView;
        }
        PrivacyViewModalEventHandler.prototype.onClose = function () {
        };
        return PrivacyViewModalEventHandler;
    }());
});
define("assets/js/Toggle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Toggle = (function () {
        function Toggle(id, label) {
            this._id = id;
            this._label = label;
            this._value = false;
        }
        Object.defineProperty(Toggle.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });
        return Toggle;
    }());
    exports.default = Toggle;
});
var privacyHandler = new PrivacyHandler(window, document);
privacyHandler.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9qYW5vc3plbi9vcHNiZWFycy9wYXN6dG9yLmF0LyIsInNvdXJjZXMiOlsiX3NpdGUvYXNzZXRzL2pzL01vZGFsLnRzIiwiX3NpdGUvYXNzZXRzL2pzL1ByaXZhY3lIYW5kbGVyLnRzIiwiX3NpdGUvYXNzZXRzL2pzL1ByaXZhY3lWaWV3LnRzIiwiX3NpdGUvYXNzZXRzL2pzL1RvZ2dsZS50cyIsIl9zaXRlL2Fzc2V0cy9qcy9pbmRleC50cyIsImFzc2V0cy9qcy9Nb2RhbC50cyIsImFzc2V0cy9qcy9Qcml2YWN5SGFuZGxlci50cyIsImFzc2V0cy9qcy9Qcml2YWN5Vmlldy50cyIsImFzc2V0cy9qcy9Ub2dnbGUudHMiLCJhc3NldHMvanMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQTtRQVFJLGVBQ0ksS0FBYyxFQUNkLElBQWEsRUFDYixNQUFlLEVBQ2YsYUFBMEIsRUFDMUIsWUFBK0I7WUFFL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBb0I7Z0JBQzFELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN4QyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzFCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUUzRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVsRCxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRU0sb0JBQUksR0FBWDtZQUFBLGlCQVVDO1lBVEcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QyxVQUFVLENBQUM7Z0JBQ1AsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM1QyxLQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ04sT0FBTyxJQUFJLE9BQU8sQ0FDZCxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQUssT0FBQSxVQUFVLENBQUMsY0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQXRDLENBQXNDLENBQzlELENBQUM7UUFDTixDQUFDO1FBRU0sb0JBQUksR0FBWDtZQUFBLGlCQVFDO1lBUEcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0MsT0FBTyxJQUFJLE9BQU8sQ0FBUSxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQUssT0FBQSxVQUFVLENBQUM7Z0JBQ3RELEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsRUFBRSxHQUFHLENBQUMsRUFId0MsQ0FHeEMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQUFDLEFBdkVELElBdUVDOzs7QUN2RUQ7SUFLSSx3QkFBbUIsR0FBVyxFQUFFLEdBQWE7UUFDekMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSw4REFBOEQsQ0FBQyxDQUFDO1FBRTlGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxXQUFXLENBQy9CLEtBQUssRUFDTCxHQUFHLEVBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FDaEIsQ0FBQTtJQUNMLENBQUM7SUFFTSw0QkFBRyxHQUFWO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0saUNBQVEsR0FBZjtRQUNJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVMLHFCQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQzs7OztJQzFCRDtRQU9JLHFCQUFtQixLQUEwQixFQUFFLEdBQWEsRUFBRSxRQUFrQjtZQUM1RSxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsK0NBQStDLENBQUM7WUFFakYsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVwRCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELFlBQVksQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7WUFDNUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFPLFFBQVEsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FDbkIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsR0FBRyxDQUFDLElBQUksRUFDUixJQUFJLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUN6QyxDQUFDO1lBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQzs7Z0JBQzFDLEtBQWdCLElBQUEsS0FBQSxTQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQSxnQkFBQTtvQkFBdkIsSUFBSSxHQUFHLFdBQUE7b0JBQ1IsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQ25CLG1CQUFtQixHQUFHLEdBQUcsRUFDekIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQ3ZCLENBQUM7b0JBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUNsQzs7Ozs7Ozs7OztRQUNMLENBQUM7UUFFTSw2QkFBTyxHQUFkLFVBQWUsSUFBWSxFQUFFLEtBQWM7WUFDdkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7Z0JBQy9CLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDO2FBQ3pDO1lBQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDekIsQ0FBQztRQUVNLDZCQUFPLEdBQWQsVUFBZSxJQUFZO1lBQ3ZCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO2dCQUMvQixNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQzthQUN6QztZQUNELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixDQUFDO1FBRU0sMEJBQUksR0FBWDtZQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUVNLDBCQUFJLEdBQVg7WUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDTCxrQkFBQztJQUFELENBQUMsQUE1REQsSUE0REM7O0lBRUQ7UUFFSSxzQ0FBWSxXQUF3QjtZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNwQyxDQUFDO1FBRUQsOENBQU8sR0FBUDtRQUVBLENBQUM7UUFDTCxtQ0FBQztJQUFELENBQUMsQUFURCxJQVNDOzs7OztJQ3ZFRDtRQUtJLGdCQUFtQixFQUFVLEVBQUUsS0FBYTtZQUN4QyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxzQkFBSSx5QkFBSztpQkFJVDtnQkFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkIsQ0FBQztpQkFORCxVQUFVLEtBQWM7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLENBQUM7OztXQUFBO1FBS0wsYUFBQztJQUFELENBQUMsQUFsQkQsSUFrQkM7OztBQ2xCRCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7O0lDRHJCO1FBUUksZUFDSSxLQUFjLEVBQ2QsSUFBYSxFQUNiLE1BQWUsRUFDZixhQUEwQixFQUMxQixZQUErQjtZQUUvQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFvQjtnQkFDMUQsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3hDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDMUI7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWxELGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFTSxvQkFBSSxHQUFYO1lBQUEsaUJBVUM7WUFURyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVDLFVBQVUsQ0FBQztnQkFDUCxLQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzVDLEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTixPQUFPLElBQUksT0FBTyxDQUNkLFVBQUMsT0FBTyxFQUFFLE1BQU0sSUFBSyxPQUFBLFVBQVUsQ0FBQyxjQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBdEMsQ0FBc0MsQ0FDOUQsQ0FBQztRQUNOLENBQUM7UUFFTSxvQkFBSSxHQUFYO1lBQUEsaUJBUUM7WUFQRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQyxPQUFPLElBQUksT0FBTyxDQUFRLFVBQUMsT0FBTyxFQUFFLE1BQU0sSUFBSyxPQUFBLFVBQVUsQ0FBQztnQkFDdEQsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMvQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUh3QyxDQUd4QyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0wsWUFBQztJQUFELENBQUMsQUF2RUQsSUF1RUM7OztBQ3ZFRDtJQUtJLHdCQUFtQixHQUFXLEVBQUUsR0FBYTtRQUN6QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLDhEQUE4RCxDQUFDLENBQUM7UUFFOUYsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FDL0IsS0FBSyxFQUNMLEdBQUcsRUFDSCxJQUFJLENBQUMsUUFBUSxDQUNoQixDQUFBO0lBQ0wsQ0FBQztJQUVNLDRCQUFHLEdBQVY7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUwscUJBQUM7QUFBRCxDQUFDLEFBMUJELElBMEJDOzs7O0lDMUJEO1FBT0kscUJBQW1CLEtBQTBCLEVBQUUsR0FBYSxFQUFFLFFBQWtCO1lBQzVFLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRywrQ0FBK0MsQ0FBQztZQUVqRixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXBELElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsWUFBWSxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztZQUM1QyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGNBQU8sUUFBUSxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUNuQixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsWUFBWSxFQUNqQixJQUFJLENBQUMsY0FBYyxFQUNuQixHQUFHLENBQUMsSUFBSSxFQUNSLElBQUksNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQ3pDLENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDOztnQkFDMUMsS0FBZ0IsSUFBQSxLQUFBLFNBQUEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBLGdCQUFBO29CQUF2QixJQUFJLEdBQUcsV0FBQTtvQkFDUixJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FDbkIsbUJBQW1CLEdBQUcsR0FBRyxFQUN6QixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FDdkIsQ0FBQztvQkFDRixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2xDOzs7Ozs7Ozs7O1FBQ0wsQ0FBQztRQUVNLDZCQUFPLEdBQWQsVUFBZSxJQUFZLEVBQUUsS0FBYztZQUN2QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtnQkFDL0IsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUM7YUFDekM7WUFDRCxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6QixDQUFDO1FBRU0sNkJBQU8sR0FBZCxVQUFlLElBQVk7WUFDdkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7Z0JBQy9CLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDO2FBQ3pDO1lBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3hCLENBQUM7UUFFTSwwQkFBSSxHQUFYO1lBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBRU0sMEJBQUksR0FBWDtZQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FBQyxBQTVERCxJQTREQzs7SUFFRDtRQUVJLHNDQUFZLFdBQXdCO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ3BDLENBQUM7UUFFRCw4Q0FBTyxHQUFQO1FBRUEsQ0FBQztRQUNMLG1DQUFDO0lBQUQsQ0FBQyxBQVRELElBU0M7Ozs7O0lDdkVEO1FBS0ksZ0JBQW1CLEVBQVUsRUFBRSxLQUFhO1lBQ3hDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQztRQUVELHNCQUFJLHlCQUFLO2lCQUlUO2dCQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QixDQUFDO2lCQU5ELFVBQVUsS0FBYztnQkFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDeEIsQ0FBQzs7O1dBQUE7UUFLTCxhQUFDO0lBQUQsQ0FBQyxBQWxCRCxJQWtCQzs7O0FDbEJELElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMifQ==