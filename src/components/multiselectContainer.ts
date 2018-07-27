import { Component, createElement } from "react";
import "../ui/Multiselect.css";
import React = require("../../node_modules/@types/react");

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
    retrieveMicroflow: any;
    contextObj: any;
    readonly state = { };
    retrieveType: string;
    entity: string;
    dataConstraint: any;
    sortParams: any;
    constructor(props: ContainerProps) {
          super(props);
          this.xpath = this.xpath.bind(this);
    }

    // private expanded: any;
    // private checkboxes: HTMLElement;
   // private Node: any;

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
              //  ref: this.setReference
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
    // retrieves the data from the child entity, applying the required constraint
    private loadData() {
        // Important to clear all validations!
       // clearValidations();
        if (this.retrieveType === "xpath") {
            // reset our data
            const xpath = "//" + this.entity + this.dataConstraint.replace(/\[\%CurrentObject\%\]/gi, this.contextObj.getGuid());
            mx.data.get({
                xpath,
                filter: {
                    sort: this.sortParams,
                    offset: 0
                },
                callback: MultiselectContainer.bind(this, this.processComboData)
            });
        } else {
            if (this.retrieveMicroflow) {
                this.execMf(this.contextObj.getGuid(), this.retrieveMicroflow, React.hitch(this, this._processComboData));
            } else {
                logger.debug("No retrieve microflow specified");
            }
        }
    }

    execMf(guid, mf, cb, showProgress, message) {
         self = this;
         if (guid && mf) {
            const options = {
                params: {
                    applyto: "selection",
                    actionname: mf,
                    guids: [ guid ]
                }
            };
        }
    }
    // private showCheckboxes = () => {
    //     // this.checkboxes = document.getElementById("checkboxes") as HTMLElement;
    //     // tslint:disable-next-line:no-console
    //     console.log(this.Node.innerHTML);
    //     // if (!this.expanded) {
    //     //     this.checkboxes.style.display = "block";
    //     //     this.expanded = true;
    //     // } else {
    //     //     this.checkboxes.style.display = "none";
    //     //     this.expanded = false;

    //     // }
    // }

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
