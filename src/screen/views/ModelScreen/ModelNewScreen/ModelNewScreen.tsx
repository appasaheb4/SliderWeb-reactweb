import React from "react";
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
  Row
} from "reactstrap";
import { Loader } from "react-overlay-loader";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dialog from "react-bootstrap-dialog";
//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";
const targetDir =
  "/Users/developer/Documents/appasaheb4/project/myproject/newmode";
var utils = require("../../../../api/constants/Utils");

export default class ModelNewScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      startDate: new Date(),
      hexDate: utils.getUnixTimeDate(new Date())
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(date: any) {
    let hexDate = utils.getUnixTimeDate(date.toString());
    this.setState({
      hexDate: hexDate,
      startDate: date
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    let hexDate = this.state.hexDate;
    let modelName = e.target.modelName.value;
    let price = e.target.price.value;

    var body = {
      date: hexDate,
      modelName: modelName,
      price: price
    };
    axios({
      method: "post",
      url: apiary.insertModel,
      data: body
    })
      .then(response => {
        let data = response.data.data;
        if (data == "Data insert sccuess.") {
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
    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <div>
                <div className="well">
                  <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group">
                      <Row>
                        <Col md="2">
                          <span>Date </span>
                        </Col>
                        <Col md="10">
                          <DatePicker
                            className="form-control"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            style={{ margionTop: 100 }}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="form-group">
                      <Row>
                        <Col md="2">
                          <span>Model Name</span>
                        </Col>
                        <Col md="10">
                          <input
                            type="text"
                            name="modelName"
                            className="form-control"
                            placeholder="Model Name"
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="2">
                          <span>Price</span>
                        </Col>
                        <Col md="10">
                          <input
                            type="number"
                            name="price"
                            className="form-control"
                            placeholder="Price"
                            required
                          />
                        </Col>
                      </Row>
                    </div>

                    <div className="form-group" />
                    <div style={{ textAlign: "center" }}>
                      <div>
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Save"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
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
