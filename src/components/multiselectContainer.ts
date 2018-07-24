import { Component, createElement } from "react";

import "../ui/checkBoxReferenceSetSelector.scss";

interface WrapperProps {
    class: string;
    mxObject?: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;
    friendlyId: string;
}

export interface ContainerProps extends WrapperProps {
    checkBox: string;
}

export interface ContainerState {
    backgroundColor?: string;
}

export default class CheckBoxReferenceSetSelectorContainer extends Component<ContainerProps, ContainerState > {

    readonly state = {
        backgroundColor: undefined
    };

    constructor(props: ContainerProps) {
        super(props);

        // this.handleChange = this.handleChange.bind(this);
    }

    render() {

        return createElement("div",
            {
                className: "multiselect"
            },
            createElement("label"),
            createElement("input", { type: "checkbox", className: "check-box", onChange: this.handleChange.bind(this) })
        );
    }

    private handleChange(event: Event) {
        this.setState({ backgroundColor: (event.target as HTMLInputElement).value });
    }

    public static parseStyle(style = ""): {[key: string]: string} {
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            CheckBoxReferenceSetSelectorContainer.logError("Failed to parse style", style, error);
        }

        return {};
    }

    public static logError(message: string, style?: string, error?: any) {
        // tslint:disable-next-line:no-console
        window.logger ? window.logger.error(message) : console.log(message, style, error);
    }
}
