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
  Row
} from "reactstrap";
import { Loader } from "react-overlay-loader";
import Dialog from "react-bootstrap-dialog";

//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";
var utils = require("../../../../api/constants/Utils");

export default class ImagesNewScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      arr_ModelName: [],
      file: null,
      imageName: ""
    };

    this.onChange = this.onChange.bind(this);
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
        console.log({ data });
        this.setState({
          arr_ModelName: data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0],
      imageName: e.target.files[0].name
    });
  }

  onFormSubmit(e: any) {
    e.preventDefault();
    let optionValue = JSON.parse(e.target.option.value);
    console.log({ optionValue });
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    formData.append("date", utils.getUnixTimeDate(new Date()));
    formData.append("title", e.target.title.value);
    formData.append("modelId", optionValue.id);
    formData.append("modelName", optionValue.modelName);
    formData.append("imageName", this.state.imageName);
    // var body = {
    //   myImage: this.state.file,
    //   date: utils.getUnixTimeDate(new Date()),
    //   title: e.target.title.value,
    //   modelId: optionValue.id,
    //   modelName: optionValue.modelName,
    //   imageName: this.state.imageName
    // };
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post(apiary.imageUpload, formData, config)
      .then(response => {
        alert(response.data);
      })
      .catch(error => {});
  }
  render() {
    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <div>
                <div className="well">
                  <form
                    onSubmit={this.onFormSubmit.bind(this)}
                    enctype="multipart/form-data"
                  >
                    <div className="form-group">
                      <Row>
                        <Col md="2">
                          <span>Model Name</span>
                        </Col>
                        <Col md="10">
                          <select
                            className="form-control browser-default custom-select"
                            name="option"
                          >
                            {this.state.arr_ModelName.map((item: any) => (
                              <option
                                key={item.id}
                                value={JSON.stringify(item)}
                              >
                                {item.modelName}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                    </div>
                    <div className="form-group">
                      <Row>
                        <Col md="2">
                          <span>Title</span>
                        </Col>
                        <Col md="10">
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Title"
                            required
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="form-group">
                      <Row>
                        <Col md="2">
                          <span>Image</span>
                        </Col>
                        <Col md="10">
                          <input
                            type="file"
                            className="form-control"
                            name="myImage"
                            onChange={this.onChange}
                          />
                        </Col>
                      </Row>
                    </div>
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
