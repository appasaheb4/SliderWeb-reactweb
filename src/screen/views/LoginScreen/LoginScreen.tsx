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

//Css Files
import "./index.css";

//Custome Files
import { colors, apiary } from "../../../api/constants/Constants";

//Images
import image1 from "../../../assets/icons/logo.png";

export default class LoginScreen extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: [],
      isloading: false
    };
  }

  async componentDidMount() {
    let loginSeesionData = localStorage.getItem("sessionloginDetails");
    if (loginSeesionData != null) {
      this.props.history.push("/dashboard");
    }
  }

  click_Login(e: any) {
    e.preventDefault();
    this.setState({ isloading: true });
    let email = e.target.email.value;
    let password = e.target.password.value;
    var body = {
      email,
      password
    };
    axios({
      method: "post",
      url: apiary.loginUser,
      data: body
    })
      .then(response => {
        let data = response.data;
        let res = data.data;
        if (data.statusCode == 200) {
          localStorage.setItem("sessionloginDetails", JSON.stringify(res));
          this.props.history.push({
            pathname: "/dashboard",
            state: { data: res }
          });
          this.setState({ isloading: false });
        } else {
          alert(data.message);
          this.setState({ isloading: false });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <img src={image1} className="center" />
                    <br />
                    <div className="well">
                      <form onSubmit={this.click_Login.bind(this)}>
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            required
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div className="form-group">
                            <input
                              type="submit"
                              className="btn btn-primary"
                              value="Login"
                            />
                          </div>
                          <div className="form-group">
                            <a href="#" className="ForgetPwd">
                              Forget Password?
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <Loader fullPage loading={this.state.isloading} />
        </Container>
      </div>
    );
  }
}
