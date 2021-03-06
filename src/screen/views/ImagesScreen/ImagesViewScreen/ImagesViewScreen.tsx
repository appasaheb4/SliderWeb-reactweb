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
import { ToastsContainer, ToastsStore } from "react-toasts";
//button icons
import Fab from "@material-ui/core/Fab";
//Custome Files
import { colors, apiary } from "../../../../api/constants/Constants";
var io = require( "socket.io-client/dist/socket.io" );
var utils = require( "../../../../api/constants/Utils" );
var ApiManager = require( "../../../../api/ApiManager/ApiManager" );


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
  constructor ( props: any ) {
    super( props );
    this.state = {
      data: [],
      loading: true,
      flag_ModelVisible: false,
      arr_SelectedImageRow: [],
      file: null,
      imageName: "",
      unixDate: utils.getUnixTimeDate( new Date() )
    };

    this.openModal = this.openModal.bind( this );
    this.closeModal = this.closeModal.bind( this );
  }

  componentWillMount = async () => {
    var data = await ApiManager.getAllData( apiary.getAllImages );
    data = data.data;
    console.log( { data } );
    let temp = [];
    var groupBy = function ( xs, key ) {
      return xs.reduce( function ( rv, x ) {
        ( rv[ x[ key ] ] = rv[ x[ key ] ] || [] ).push( x );
        return rv;
      }, {} );
    };
    var groubedByTeam = groupBy( data, 'modelId' )
    console.log( groubedByTeam );
    let groupArryLength = Object.keys( groubedByTeam ).length;

    for ( let i = 0; i < groupArryLength; i++ ) {
      let arr_modelId = Object.keys( groubedByTeam );
      for ( let j = 0; j < arr_modelId.length; j++ ) {
        let data = {};
        let id = arr_modelId[ j ];
        let groupByArrLength = groubedByTeam[ id ].length
        data.title = groubedByTeam[ id ][ 0 ].title
        data.modelName = groubedByTeam[ id ][ 0 ].modelName;
        data.createDate = groubedByTeam[ id ][ 0 ].createDate;
        let temp1 = [];
        for ( let k = 0; k < groupByArrLength; k++ ) {
          let data = {};
          data.id = groubedByTeam[ id ][ k ].id;
          data.title = groubedByTeam[ id ][ 0 ].title
          data.modelName = groubedByTeam[ id ][ 0 ].modelName;
          data.imagePath = groubedByTeam[ id ][ k ].imagePath;
          data.modelId = groubedByTeam[ id ][ k ].modelId;
          temp1.push( data );
        }
        data.arrDetails = temp1;
        temp.push( data )
      }
      break;
    }
    console.log( { temp } );

    this.setState( {
      data: temp
    } );
  }



  openModal() {
    this.setState( { flag_ModelVisible: true } );
  }

  closeModal() {
    this.setState( { flag_ModelVisible: false } );
  }

  //TODO: func connection_UpdateData
  connection_UpdateData( oldValue, newValue, item ) {
    if ( oldValue != newValue ) {
      this.updateDate( item );
    }
  }

  updateDate( item: any ) {
    var body = {
      id: item.id,
      title: item.title,
      modelId: item.modelId
    };
    axios( {
      method: "post",
      url: apiary.update_ModelImage,
      data: body
    } )
      .then( response => {
        let data = response.data.data;
        ToastsStore.success( data );
        this.componentDidMount();
        var socket = io();
        socket.emit( "update" );
      } )
      .catch( function ( error ) {
        console.log( error );
      } );
  }

  deleteData( item: any ) {
    var body = {
      id: item.id
    };
    axios( {
      method: "post",
      url: apiary.delete_ModelImage,
      data: body
    } )
      .then( response => {
        let data = response.data.data;
        ToastsStore.success( data );
        this.componentDidMount();
        var socket = io();
        socket.emit( "update" );
      } )
      .catch( function ( error ) {
        console.log( error );
      } );
  }

  priceFormatter( cell, row ) {
    console.log( { cell, row } );
    var arrDetails = row.arrDetails;
    console.log( { arrDetails } );
    const imageGroups = arrDetails.map( ( item: any ) => (
      < img
        onClick={ () => {
          this.setState( {
            flag_ModelVisible: true,
            arr_SelectedImageRow: item
          } );
        }
        }
        src={ apiary.domain + item.imagePath }
        className="img-rounded img-responsive img-thumbnail"
        style={ { width: 200, height: 100 }
        }
      />
    ) );
    return (
      <div>
        { imageGroups }
      </div>
    );


  }

  onChange( e ) {
    this.setState( {
      file: e.target.files[ 0 ],
      imageName: e.target.files[ 0 ].name
    } );
  }

  onFormSubmit( e: any ) {
    e.preventDefault();
    this.setState( {
      flag_ModelVisible: false
    } );
    let unixStateDate = this.state.unixDate;
    const formData = new FormData();
    formData.append( "myImage", this.state.file );
    formData.append( "date", unixStateDate );
    formData.append( "id", this.state.arr_SelectedImageRow.id );
    formData.append( "modelId", this.state.arr_SelectedImageRow.modelId );
    formData.append( "modelName", this.state.arr_SelectedImageRow.modelName );
    formData.append( "imageName", this.state.imageName );

    var body = {
      myImage: this.state.file,
      type: "EditImage",
      date: unixStateDate,
      modelName: this.state.arr_SelectedImageRow.modelName,
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
      .post( apiary.imageEditUpload, formData, config )
      .then( response => {
        ToastsStore.success( response.data );
        this.componentDidMount();
        var socket = io();
        socket.emit( "update" );
        this.setState( {
          unixDate: utils.getUnixTimeDate( new Date() )
        } );
      } )
      .catch( error1 => { } );
  }

  render() {
    let data = this.state.data;
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
        formatter: this.priceFormatter.bind( this ),
        editable: false
      },
      {
        dataField: "opration",
        text: "Delete",
        style: {
          width: 10
        },
        editable: false,
        formatter: ( cellContent, row ) => (
          <div>
            <Fab
              color="secondary"
              aria-label="delete"
              onClick={ () => {
                this.dialog.show( {
                  title: "Confirmation",
                  body: "Are you sure delete data?",
                  actions: [
                    Dialog.CancelAction(),
                    Dialog.OKAction( () => {
                      this.deleteData( row );
                    } )
                  ],
                  bsSize: "small",
                  onHide: dialog => {
                    dialog.hide();
                    console.log( "closed by clicking background." );
                  }
                } );
              } }
              style={ styles.buttonIcon }
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
            keyField="id"
            data={ data }
            columns={ columns }
            hover
            // pagination={ paginationFactory() }
            cellEdit={ cellEditFactory( {
              mode: "click",
              blurToSave: true,
              afterSaveCell: ( oldValue, newValue, row, column ) => {
                this.connection_UpdateData( oldValue, newValue, row );
              }
            } ) }
          />
          <Dialog
            ref={ component => {
              this.dialog = component;
            } }
          />

          <Modal
            isOpen={ this.state.flag_ModelVisible }
            onRequestClose={ this.closeModal }
            style={ customStyles }
            contentLabel="Example Modal"
          >
            <h4 style={ { textAlign: "center" } }>Upload Image</h4>
            <div className="form-group">
              <form
                onSubmit={ this.onFormSubmit.bind( this ) }
                enctype="multipart/form-data"
              >
                <Row>
                  <Col md="3">
                    <span>Title :</span>
                  </Col>
                  <Col md="9">
                    <span>{ this.state.arr_SelectedImageRow.title }</span>
                  </Col>
                </Row>
                <Row style={ { marginTop: 10 } }>
                  <Col md="3">
                    <span>Model :</span>
                  </Col>
                  <Col md="9">
                    <span>{ this.state.arr_SelectedImageRow.modelName }</span>
                  </Col>
                </Row>
                <Row style={ { marginTop: 10 } }>
                  <Col md="3">
                    <span>Image :</span>
                  </Col>
                  <Col md="9">
                    <input
                      type="file"
                      className="form-control"
                      name="myImage"
                      onChange={ this.onChange.bind( this ) }
                    />
                  </Col>
                </Row>
                <Row style={ { marginTop: 20, textAlign: "center" } }>
                  <Col>
                    <input
                      style={ { width: "100%" } }
                      type="submit"
                      className="btn btn-primary"
                      value="Upload"
                    />
                  </Col>
                </Row>
              </form>
            </div>
          </Modal>
          <ToastsContainer store={ ToastsStore } />
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
