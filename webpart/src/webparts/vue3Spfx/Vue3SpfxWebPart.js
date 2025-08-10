var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { getVueDOMElementHTML } from "../../lib/WebpartProperties";
// Make.ps1 utility should automatically update these paths after each build of the Vue app
// using the bundle-webpart-assets.js Node script:
import { renderVue } from "../assets/appcode/index.923143b7.js";
import "../assets/appcode/index.bcc7f1e2.css";
//  import "../assets/appcode/vendor.333eb2ee.js";
// update all occurrences of the following value to represent your specific webpart:
var APPCLIENTID = "UNIQUECLIENTAPP";
var Vue3ViteWebpartWebPart = /** @class */ (function (_super) {
    __extends(Vue3ViteWebpartWebPart, _super);
    function Vue3ViteWebpartWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // timer is optional to delay rendering
        _this.mountingTimer = null;
        return _this;
    }
    Vue3ViteWebpartWebPart.prototype.render = function () {
        var _this = this;
        // get the webpart instance ID from the DOM element containing this webpart
        var instanceId = this.context.instanceId, containerId = APPCLIENTID + (instanceId ? "-" + instanceId : "");
        this.domElement.innerHTML = "<span></span>";
        // timer is optional to delay rendering when user is editing properties
        if (this.mountingTimer)
            clearTimeout(this.mountingTimer);
        this.mountingTimer = setTimeout(function () {
            // insert the Vue app containing element with property values included
            _this.domElement.innerHTML = getVueDOMElementHTML(containerId, _this.properties, instanceId);
            // call the Vue render function
            renderVue("#".concat(containerId));
        }, 500);
    };
    // Modify this section with editable properties you want to provide to your webpart
    Vue3ViteWebpartWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: "Vue3 Webpart"
                    },
                    groups: [
                        {
                            groupName: "Webpart properties",
                            groupFields: [
                                PropertyPaneTextField('heading', {
                                    label: "Heading"
                                }),
                                PropertyPaneTextField('description', {
                                    label: "Description",
                                    multiline: true
                                }),
                                PropertyPaneTextField('listName', {
                                    label: "List name"
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return Vue3ViteWebpartWebPart;
}(BaseClientSideWebPart));
export default Vue3ViteWebpartWebPart;
//# sourceMappingURL=Vue3SpfxWebPart.js.map