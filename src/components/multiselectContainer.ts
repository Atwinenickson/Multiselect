import { Component, createElement } from "react";

import "../ui/multiselect.scss";

interface WrapperProps {
    class: string;
    mxObject?: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;
    friendlyId: string;
}

export interface ContainerProps extends WrapperProps {
    check: string;
}

export interface ContainerState {
    check?: string;
}

export default class MultiselectContainer extends Component<ContainerProps, ContainerState> {
    constructor(props: ContainerProps) {
        super(props);

        // this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { mxObject } = this.props;
        const choose = mxObject ? mxObject.get(this.props.check) : "";
        return createElement("div", { className: "form-group multiSelectMainContainer" },
        createElement("label", { className: "control-label multiSelectLabel" }),
            createElement("div", {}, createElement("select", { className: "form-control multiSelect" },
                createElement("option", { value : choose }, "USA"),
                createElement("option", { value: choose }, "EUROPE"),
                createElement("option", { value: choose }, "AFRICA"))));
    }

    public static logError(message: string, style?: string, error?: any) {
        // tslint:disable-next-line:no-console
        window.logger ? window.logger.error(message) : console.log(message, style, error);
    }
}
