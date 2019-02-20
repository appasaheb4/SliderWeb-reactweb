import React, { Component } from "react";



export default class ErrorScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);

  }

  

  render() {
    return (
      <div className="app flex-row align-items-center justify-content-center">
        <h4>Path Does not exits!! </h4>
        <h5>(Contact to admin)</h5>
      </div>
    );
  }
}
