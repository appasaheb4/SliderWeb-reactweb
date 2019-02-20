import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { Loader } from "react-overlay-loader";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import cellEditFactory from "react-bootstrap-table2-editor";
import overlayFactory from "react-bootstrap-table2-overlay";
import Dialog from "react-bootstrap-dialog";

//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";

export default class ModelViewScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      arr_DeleteData: [],
      loading: true
    };
  }

  componentDidMount() {
    axios
      .get(apiary.getModels, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        let data = response.data.data;
        this.setState({
          data: data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //TODO: func connection_UpdateData
  connection_UpdateData(oldValue, newValue, item) {
    if (oldValue != newValue) {
      console.log({ oldValue, newValue, item });
      this.dialog.show({
        title: "Confirmation",
        body: "Are you sure update data?",
        actions: [
          Dialog.CancelAction(),
          Dialog.OKAction(() => {
            this.updateDate(item);
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
          console.log("closed by clicking background.");
        }
      });
    }
  }

  updateDate(item: any) {
    var body = {
      id: item.id,
      modelName: item.modelName,
      price: item.price
    };
    axios({
      method: "post",
      url: apiary.update_ModelData,
      data: body
    })
      .then(response => {
        let data = response.data.data;
        if (data == "Data update sccurss.") {
          this.dialog.show({
            title: "Success",
            body: data,
            actions: [
              Dialog.OKAction(() => {
                window.location.reload();
              })
            ],
            bsSize: "small",
            onHide: dialog => {
              dialog.hide();
              console.log("closed by clicking background.");
            }
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  deleteData(item: any) {
    var body = {
      id: item.id
    };
    axios({
      method: "post",
      url: apiary.delete_ModelData,
      data: body
    })
      .then(response => {
        let data = response.data.data;
        if (data == "Data deleted sccurss.") {
          this.dialog.show({
            title: "Success",
            body: data,
            actions: [
              Dialog.OKAction(() => {
                window.location.reload();
              })
            ],
            bsSize: "small",
            onHide: dialog => {
              dialog.hide();
              console.log("closed by clicking background.");
            }
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { loading } = this.state;
    const columns = [
      {
        dataField: "id",
        text: "Id"
      },
      {
        dataField: "modelName",
        text: "Model Name"
      },
      {
        dataField: "price",
        text: "Price"
      }
    ];

    const selectRow = {
      mode: "radio",
      clickToEdit: true,
      bgColor: "#00BFFF",
      selectionHeaderRenderer: () => "Delete",
      style: { backgroundColor: "#c8e6c9" },

      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          this.dialog.show({
            title: "Confirmation",
            body: "Are you sure delete data?",
            actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(() => {
                this.deleteData(row);
              })
            ],
            bsSize: "small",
            onHide: dialog => {
              dialog.hide();
              console.log("closed by clicking background.");
            }
          });
        }
      }
    };

    return (
      <div className="app flex-row">
        <Container>
          <BootstrapTable
            keyField="id"
            data={this.state.data}
            columns={columns}
            hover
            loading={loading}
            pagination={paginationFactory()}
            selectRow={selectRow}
            cellEdit={cellEditFactory({
              mode: "dbclick",
              blurToSave: true,
              afterSaveCell: (oldValue, newValue, row, column) => {
                this.connection_UpdateData(oldValue, newValue, row);
              }
            })}
          />
          <Dialog
            ref={component => {
              this.dialog = component;
            }}
          />
        </Container>
      </div>
    );
  }
}
