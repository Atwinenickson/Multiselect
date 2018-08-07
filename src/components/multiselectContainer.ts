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
    sortOrder: string;
    showLabel: string;
}

export interface ContainerState {
    checkboxItems: { guid: string, caption: string, isChecked: boolean }[];
    isChecked: boolean;
    fieldCaption?: string;
    value?: string;
    caption?: string;
    names: any [];
}
let expanded = false;
export default class MultiselectContainer extends Component<ContainerProps, ContainerState> {
   private subscriptionHandles: number[] = [];
   readonly state: ContainerState = {
        checkboxItems: [],
        isChecked: false,
        names: [],
        fieldCaption: this.props.mxObject
        ? this.props.mxObject.get(this.props.entity1) as string
        : ""
    };
   private reference: string;
   private entity: string;
   private Node: HTMLDivElement;
   private myarray: string[] = [];
   fieldCaption: string;

   constructor(props: ContainerProps) {
        super(props);
        this.entity = this.props.entity1.split("/")[1];
        this.reference = this.props.entity1.split("/")[0];
        this.getDataFromXPath = this.getDataFromXPath.bind(this);
        this.handelChange = this.handelChange.bind(this);
        this.getDataFromMicroflow = this.getDataFromMicroflow.bind(this);
    }
   render() {
        const name = this.state.names.join(",");
        return (
            createElement("legend", {}, this.props.fieldCaption,
                createElement("div", { className: "multiselect" },
                    createElement("div",
                        {
                            className: "selectBox",
                            onClick: this.showCheckboxes
                        },
                        createElement("select", { id: "select" },
                            createElement("option", {}, name)),
                        createElement("div", {
                            className: "overSelect"
                        })),
                    createElement("div", {
                        ref: this.setReference,
                        id: "checkboxes"
                    },
                        this.props.fieldCaption,
                        this.createCheckboxItems()
                    )
                )));
    }
   componentWillReceiveProps(newProps: ContainerProps) {
        if (newProps.mxObject !== this.props.mxObject) {
            this.getDataFromXPath(newProps.mxObject);
            this.resetSubscriptions(newProps.mxObject);
        } else {
            this.setState({ checkboxItems: [] });
        }
    }

   private getDataFromXPath = (mxObject: mendix.lib.MxObject) => {
        if (mxObject) {
            //  const constraint = this.props.constraint;
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
        this.setState({ checkboxItems, isChecked: true });
    }

   private createCheckboxItems() {
        const checkboxarray: any = [];
        this.state.checkboxItems.map(item => {
            checkboxarray.push([
                createElement("label", {
                    className: "myClassName"
                }),
                createElement("input", {
                    name: item.caption,
                    type: "checkbox",
                    onChange: this.handelChange,
                    isChecked: item.isChecked,
                    value: item.guid
                }), item.caption ]
            );
        });

        return checkboxarray;
    }

   private setReference = (Node: HTMLDivElement) => {
        this.Node = Node;
    }

   private showCheckboxes = () => {
        const checkboxes = this.Node;
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
    }

   private handelChange = (event: any) => {
        const newEvent = event.target;
        if (newEvent && newEvent.checked) {
            this.props.mxObject.addReference(this.reference, event.target.value);
            this.myarray.push(newEvent.name);
        } else {
            this.props.mxObject.removeReferences(this.reference, event.target.value);
            this.myarray.splice(this.myarray.indexOf(newEvent.name), 1);
        }
        this.setState({ names: this.myarray });
    }

   private resetSubscriptions(mxObject: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];

        this.subscriptionHandles.push(window.mx.data.subscribe({
            guid: mxObject.getGuid(),
            attr: this.props.displayAttr,
            callback: () => this.getDataFromXPath

        }),
            window.mx.data.subscribe({
                entity: this.props.entity1,
                callback: () => this.getDataFromXPath
            }
            )
        );
    }

   private getDataFromMicroflow() {
        const { mxform, dataSourceType } = this.props;
        if (dataSourceType) {
            mx.data.action({
                params: {
                    applyto: "None",
                    actionname: dataSourceType
                },
                origin: mxform,
                callback: (mxObject: mendix.lib.MxObject[]) => this.processCheckboxItems(mxObject),
                error: (error) => {
                    mx.ui.error(error.message);
                }
            });
        }
    }

}
