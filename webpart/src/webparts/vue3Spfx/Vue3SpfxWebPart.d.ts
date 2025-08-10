import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import "../assets/appcode/index.bcc7f1e2.css";
export interface IWebpartWebPartProps {
    heading: string;
    description: string;
    listName: string;
}
export default class Vue3ViteWebpartWebPart extends BaseClientSideWebPart<IWebpartWebPartProps> {
    private mountingTimer;
    render(): void;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=Vue3SpfxWebPart.d.ts.map