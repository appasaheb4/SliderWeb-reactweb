import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { Loader } from "react-overlay-loader";
import { FaRegEdit, FaRegTrashAlt, FaCheckSquare } from "react-icons/fa";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import cellEditFactory from "react-bootstrap-table2-editor";
import overlayFactory from "react-bootstrap-table2-overlay";
import Dialog from "react-bootstrap-dialog";
import { ToastsContainer, ToastsStore } from "react-toasts";
//button icons
import Fab from "@material-ui/core/Fab";

//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";
var io = require("socket.io-client/dist/socket.io");

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
      this.updateDate(item);
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
        console.log({ data });
        ToastsStore.success(data);
        this.componentDidMount();
        var socket = io();
        socket.emit("update");
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
        ToastsStore.success(data);
        this.componentDidMount();
        var socket = io();
        socket.emit("update");
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
        text: "Id",
        hidden: true,
        editable: false
      },
      {
        dataField: "modelName",
        text: "Model Name"
      },
      {
        dataField: "price",
        text: "Price"
      },
      {
        dataField: "opration",
        text: "Delete",
        style: {
          width: 10
        },
        editable: false,
        formatter: (cellContent, row) => (
          <div>
            <Fab
              color="secondary"
              aria-label="delete"
              onClick={() => {
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
              }}
              style={styles.buttonIcon}
            >
              <FaRegTrashAlt />
            </Fab>
          </div>
        )
      }
    ];

    return (
      <div className="app flex-row">
        <Container>
          <BootstrapTable
            ref="table"
            keyField="id"
            data={this.state.data}
            columns={columns}
            hover
            loading={loading}
            pagination={paginationFactory()}
            cellEdit={cellEditFactory({
              mode: "click",
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
          <ToastsContainer store={ToastsStore} />
        </Container>
      </div>
    );
  }
}
const styles = {
  buttonIcon: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginRight: 10
  }
};
