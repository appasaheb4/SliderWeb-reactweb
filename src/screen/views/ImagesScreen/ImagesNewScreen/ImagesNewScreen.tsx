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
import { ToastsContainer, ToastsStore } from "react-toasts";
//Custome File
import { colors, apiary } from "../../../../api/constants/Constants";
import renderIf from "../../../../api/constants/validation/renderIf";
var io = require( "socket.io-client/dist/socket.io" );
var utils = require( "../../../../api/constants/Utils" );
var ApiManager = require( "../../../../api/ApiManager/ApiManager" );

export default class ImagesNewScreen extends Component<any, any> {
  constructor ( props: any ) {
    super( props );

    this.state = {
      data: [],
      arr_ModelName: [],
      file: null,
      imageName: "",
      unixDate: utils.getUnixTimeDate( new Date() )
    };

    this.onChange = this.onChange.bind( this );
  }

  componentDidMount = async () => {
    let data = await ApiManager.getAllData( apiary.getModels );
    // console.log( { data } );
    this.setState( {
      arr_ModelName: data.data
    } );
  }

  onChange( e ) {
    this.setState( {
      file: e.target.files[ 0 ],
      imageName: e.target.files[ 0 ].name
    } );
  }

  onFormSubmit( e: any ) {
    try {
      e.preventDefault();
      let unixStateDate = this.state.unixDate;
      let optionValue = JSON.parse( e.target.option.value );
      console.log( { optionValue } );
      const formData = new FormData();
      formData.append( "myImage", this.state.file );
      formData.append( "date", unixStateDate );
      formData.append( "title", e.target.title.value );
      formData.append( "modelId", optionValue.id );
      formData.append( "modelName", optionValue.modelName );
      formData.append( "imageName", this.state.imageName );
      var body = {
        myImage: this.state.file,
        date: unixStateDate,
        modelName: optionValue.modelName,
        imageName: this.state.imageName
      };
      axios
        .post( apiary.imageUploadSessionAdd, body )
        .then( response => {
          let data = response.data;
          console.log( { data } );
        } )
        .catch( error => { } );

      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post( apiary.imageUpload, formData, config )
        .then( response => {
          ToastsStore.success( response.data );
          var socket = io();
          socket.emit( "update" );
          this.setState( {
            unixDate: utils.getUnixTimeDate( new Date() )
          } );

        } )
        .catch( error1 => { } );
    } catch ( error ) {
      console.log( { error } );

    }
  }



  render() {
    const modelList = this.state.arr_ModelName.map( ( item: any ) => (
      <option
        key={ item.id }
        value={ JSON.stringify( item ) }
      >
        { item.modelName }
      </option>
    ) );
    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <div>
                <div className="well">
                  <form
                    onSubmit={ this.onFormSubmit.bind( this ) }
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
                            { modelList }
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
                            onChange={ this.onChange }
                          />
                        </Col>
                      </Row>
                    </div>
                    <div style={ { textAlign: "center" } }>
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
            ref={ component => {
              this.dialog = component;
            } }
          />
          <ToastsContainer store={ ToastsStore } />
        </Container>
      </div>
    );
  }
}
