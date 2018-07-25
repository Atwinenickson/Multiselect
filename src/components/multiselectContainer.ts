import { Component, createElement } from "react";

interface WrapperProps {
    class: string;
    mxObject?: mendix.lib.MxObject;
    mxform: mxui.lib.form._FormBase;
    style: string;
    readOnly: boolean;
    friendlyId: string;
}

export interface ContainerProps extends WrapperProps {
    datetimeformat: string;
    datePattern: string;
    timePattern: string;
    decimalPrecision: string;
    groupDigits: string;
    onChangeMicroflow: string;
    onChangeMicroflowShowProgress: string;
    onChangeMicroflowProgressMessage: string;
    retrieveType: string;
    dataAssociation: string;
    displayTemplate: string;
    variableName: string;
    variableAttribute: string;
    _variableContainer: string;
    dataConstraint: string;
    sortContainer: string;
    sortOrder: string;
    sortAttribute: string;
    retrieveMicroflow: string;
    reloadDataViaAttribute: string;
    showLabel: string;
    fieldCaption: string;
    formOrientation: string;
    labelWidth: string;
    addSelectAll: string;
    addFilter: string;
    caseSensitiveFilter: string;
    itemsToDisplay: string;
    disabled: string;
    disabledViaAttribute: string;
    visible: string;
    visibleViaAttribute: string;
    selectAllText: string;
    noneSelectedText: string;
    allSelectedText: string;
    numberSelectedText: string;
}

// export interface ContainerState {
//  }

export default class MultiselectSetSelectorContainer extends Component<ContainerProps> {

    readonly state = {
        datetimeformat: undefined
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
        this.setState({ datetimeformat: (event.target as HTMLInputElement).value });
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
            MultiselectSetSelectorContainer.logError("Failed to parse style", style, error);
        }

        return {};
    }

    public static logError(message: string, style?: string, error?: any) {
        // tslint:disable-next-line:no-console
        window.logger ? window.logger.error(message) : console.log(message, style, error);
    }
}
