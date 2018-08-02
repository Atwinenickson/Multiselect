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
}

export interface ContainerState {
    checkboxItems: { guid: string, caption: string, isChecked: boolean }[];
    isChecked: boolean;
}
let expanded = false;
export default class MultiselectContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandles: number[] = [];
    readonly state: ContainerState = {
        checkboxItems: [],
        isChecked: false
    };
    private reference: string;
    private entity: string;
    private Node: HTMLDivElement;

    constructor(props: ContainerProps) {
        super(props);
        this.entity = this.props.entity1.split("/")[1];
        this.reference = this.props.entity1.split("/")[0];
        this.getDataFromXPath = this.getDataFromXPath.bind(this);
        this.handelChange = this.handelChange.bind(this);

    }
    render() {
        return (
            createElement("div", { className: "multiselect" },
                    createElement("div",
                        {
                            className: "selectBox",
                            onClick: this.showCheckboxes
                        },
                        createElement("select", { },
                            createElement("option", {}, "Select from these options available")),
                        createElement("div", {
                            className: "overSelect"
                        })),
                    createElement("div", {
                        ref: this.setReference,
                        id: "checkboxes"
                    },
            this.createCheckboxItems()
        )
        ));
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
             const constraint = this.props.constraint;
             const xpath = "//" + this.entity + constraint;
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
                            type: "checkbox",
                            onChange: this.handelChange,
                            isChecked: item.isChecked,
                            key: item.guid
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

    private handelChange(event: any) {
        const newEvent = event.target;
        if (newEvent && newEvent.checked) {
              this.props.mxObject.addReference(this.reference, event.target.value);
          } else {
              this.props.mxObject.removeReferences(this.reference, event.target.value);
          }
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
}
