import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table,
  Row
} from "reactstrap";
import { Loader } from "react-overlay-loader";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import cellEditFactory from "react-bootstrap-table2-editor";
import overlayFactory from "react-bootstrap-table2-overlay";
import Dialog from "react-bootstrap-dialog";
import Modal from "react-modal";

//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";
var utils = require("../../../../api/constants/Utils");

const customStyles = {
  content: {
    top: "50%",
    left: "60%",
    right: "60%",
    bottom: "auto",
    marginRight: "-50%",
    backgroundColor: "#000",
    opacity: 0.7,
    color: "#fff",
    transform: "translate(-50%, -50%)"
  }
};

export default class ImagesViewScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      flag_ModelVisible: false,
      arr_SelectedImageRow: [],
      file: null,
      imageName: ""
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    axios
      .get(apiary.getAllImages, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        let data = response.data.data;
        console.log({ data });
        this.setState({
          data: data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  openModal() {
    this.setState({ flag_ModelVisible: true });
  }

  closeModal() {
    this.setState({ flag_ModelVisible: false });
  }

  //TODO: func connection_UpdateData
  connection_UpdateData(oldValue, newValue, item) {
    if (oldValue != newValue) {
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
      title: item.title,
      modelId: item.modelId
    };
    axios({
      method: "post",
      url: apiary.update_ModelImage,
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
      url: apiary.delete_ModelImage,
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

  priceFormatter(cell, row) {
    let imagePage = apiary.domain + row.imagePath;
    return (
      <img
        onClick={() => {
          console.log({ row });
          this.setState({
            flag_ModelVisible: true,
            arr_SelectedImageRow: row
          });
        }}
        src={imagePage}
        className="img-rounded img-responsive img-thumbnail"
        style={{ width: 200, height: 100 }}
      />
    );
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0],
      imageName: e.target.files[0].name
    });
  }

  onFormSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    formData.append("date", utils.getUnixTimeDate(new Date()));
    formData.append("id", this.state.arr_SelectedImageRow.id);
    formData.append("modelId", this.state.arr_SelectedImageRow.modelId);
    formData.append("modelName", this.state.arr_SelectedImageRow.modelName);
    formData.append("imageName", this.state.imageName);

    var body = {
      myImage: this.state.file,
      type: "EditImage",
      date: utils.getUnixTimeDate(new Date()),
      modelName: this.state.arr_SelectedImageRow.modelName,
      imageName: this.state.imageName
    };
    axios
      .post(apiary.imageUploadSessionAdd, body)
      .then(response => {
        let data = response.data;
        console.log({ data });
      })
      .catch(error => {});

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post(apiary.imageEditUpload, formData, config)
      .then(response => {
        alert(response.data);
      })
      .catch(error1 => {});
  }

  render() {
    const columns = [
      {
        dataField: "id",
        text: "Id",
        hidden: true
      },
      {
        dataField: "title",
        text: "Title"
      },
      {
        dataField: "modelName",
        text: "Model Name",
        editable: false
      },
      {
        dataField: "imagePath",
        text: "Image",
        formatter: this.priceFormatter.bind(this),
        editable: false
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
            pagination={paginationFactory()}
            selectRow={selectRow}
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

          <Modal
            isOpen={this.state.flag_ModelVisible}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h4 style={{ textAlign: "center" }}>Upload Image</h4>
            <div className="form-group">
              <form
                onSubmit={this.onFormSubmit.bind(this)}
                enctype="multipart/form-data"
              >
                <Row>
                  <Col md="3">
                    <span>Title :</span>
                  </Col>
                  <Col md="9">
                    <span>{this.state.arr_SelectedImageRow.title}</span>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="3">
                    <span>Model :</span>
                  </Col>
                  <Col md="9">
                    <span>{this.state.arr_SelectedImageRow.modelName}</span>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="3">
                    <span>Image :</span>
                  </Col>
                  <Col md="9">
                    <input
                      type="file"
                      className="form-control"
                      name="myImage"
                      onChange={this.onChange.bind(this)}
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: 20, textAlign: "center" }}>
                  <Col>
                    <input
                      style={{ width: "100%" }}
                      type="submit"
                      className="btn btn-primary"
                      value="Upload"
                    />
                  </Col>
                </Row>
              </form>
            </div>
          </Modal>
        </Container>
      </div>
    );
  }
}
