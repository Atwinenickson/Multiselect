// import PropTypes from "prop-types";
// import ContainerState from "./MultiselectContainer";
// import Checkboxx from "./Multi";
// import { Component, createElement } from "react";
// class CheckboxContainer extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             checkedItems: new Map()
//         };

//         this.handleChange = this.handleChange.bind(this);
//     }

//     handleChange(e) {
//         const item = e.target.name;
//         const isChecked = e.target.checked;
//         this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
//     }

//     render() {
//         return (
//             createElement("div", { },
//             checkboxes.map(item => (
//                 createElement("label", {
//             key: item.key
//                 }
//             )
//             ),
//             "item.name"
//             ),
//             createElement("Checkboxx", {
//                 name: "item.name",
//                 checked: this.state.checkedItems.get(item.name),
//                 onchange: this.handleChange
//             }
//             )
//         );
//     }
// }

// export default CheckboxContainer;
