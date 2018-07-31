import { Component, createElement } from "react";
import "../ui/Multiselect.css";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;

}

export interface ContainerProps extends WrapperProps {
    checkBoxType: string;
    dataSourceType: "xpath" | "microflow";
    entity1: string;
    displayAttr: string;
    fieldCaption: string;
    constraint: string;
    sortAttribute: string;
    labelAttribute: string;
    sortOrder: string;
    showLabel: string;
}

export interface ContainerState {
    checkboxItems: { guid: string, caption: string, isChecked: boolean }[];
}
export default class MultiselectContainer extends Component<ContainerProps, ContainerState> {
    readonly state: ContainerState = {
        checkboxItems: []
    };
    private reference: string;
    private entity: string;

    constructor(props: ContainerProps) {
        super(props);
        this.entity = this.props.entity1.split("/")[1];
        this.reference = this.props.entity1.split("/")[0];
        this.getDataFromXPath = this.getDataFromXPath.bind(this);
    }
    render() {
        return (
            createElement("div", { className: "multiselect" },
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
                        id: "checkboxes"
                    },
            this.createCheckboxItems()
        )
        ));
    }
    componentWillReceiveProps(newProps: ContainerProps) {
        if (newProps.mxObject !== this.props.mxObject) {
            this.getDataFromXPath(newProps.mxObject);
        }
    }

    private getDataFromXPath = (mxObject: mendix.lib.MxObject) => {
        if (mxObject) {
            // const constraint = this.props.constraint.split("[%CurrentObject%]").join(mxObject.getGuid());
            const xpath = "//" + this.entity;
            window.mx.data.get({
                callback: (objs: mendix.lib.MxObject[]) => {
                     this.processCheckboxItems(objs);
                    }
                     ,
                xpath,
                filter: {
                    sort: [ [ this.props.displayAttr, "asc" ] ]
                }
            });
        }

    }

    private processCheckboxItems = (multiSelectObjects: mendix.lib.MxObject[]) => {
        const referencedObjects = this.props.mxObject.getReferences(this.reference);

        const checkboxItems = multiSelectObjects.map(mxObj => {
            const guid = mxObj.getGuid();
            const caption = mxObj.get(this.props.displayAttr) as string;
            const isChecked = referencedObjects.indexOf(guid) > -1;

            return {
                guid,
                caption,
                isChecked
            };
        });
        this.setState({ checkboxItems });
    }

    private createCheckboxItems() {
        const checkboxarray: any = [];
        this.state.checkboxItems.map(item => {
            checkboxarray.push([
                        createElement("label", {
                            className: "myClassName"
                        }),
                        createElement("input", {
                            type: "checkbox",
                            isChecked: item.isChecked,
                            key: item.guid
                        }), item.caption ]
                    );
                });

        return checkboxarray;
    }
}
