import { Component, createElement } from "react";
import "../ui/Multiselect.css";

interface WrapperProps {
    class: string;
    mxObject?: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;
    friendlyId: string;
}

export interface ContainerProps extends WrapperProps {
    dataSource: "xpath" | "microflow";
    constraint: string;
    entity: string;
    displayAttr: string;
    showLabel1: boolean;
    sortOrder: "asc" | "desc";
    formOrientation: "horizontal" | "vertical";
    fieldCaption: string;
    callMicroflow?: string;
    checkBoxType: string;
    retrieveMicroflow: string;
    retrieveType: string;
}

export default class MultiselectContainer extends Component<ContainerProps> {
    setReference: any;
    constructor(props: ContainerProps) {
          super(props);
    }
    render() {
        return createElement("div", { className: "multiselect" },
            createElement("div",
                {
                    className: "selectBox"
                },
                createElement("select", {},
                    createElement("option", {}, "Select any language")),
                createElement("div", {
                    className: "overSelect"
                })),
            createElement("div", {
                ref: this.setReference
            },
                createElement("label", {},
                    createElement("input", {
                        type: "checkbox",
                        ref: "one"
                    }
                    ), "English"
                ),
                createElement("label", {},
                    createElement("input", {
                        type: "checkbox",
                        ref: "two"
                    }
                    ), "French"
                ),
                createElement("label", {},
                    createElement("input", {
                        type: "checkbox",
                        ref: "three"
                    }
                    ), "German"
                )
            )
        );

    }
    public static parseStyle(style = ""): { [key: string]: string } {
        try {
            return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            MultiselectContainer.logError("Failed to parse style", style, error);
        }

        return {};
    }

    // private setReference = (Node: HTMLDivElement) => {
    //     this.Node = Node;
    // }

    public static logError(message: string, style?: string, error?: any) {
        // tslint:disable-next-line:no-console
        window.logger ? window.logger.error(message) : console.log(message, style, error);
    }
}
