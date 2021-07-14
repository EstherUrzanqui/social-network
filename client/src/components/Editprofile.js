import React from "react";
import axios from "axios";
import Withuser from "./Withuser"
import { Button, Form, Input, FormGroup, Modal, ModalBody, ModalHeader } from "reactstrap"
import "../css/Editprofile.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Editprofilepic from "./Editprofilepic";
import Editbackimage from "./Editbackimage";

class Editprofile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: "", 
      email: "",
      password: "",
      password2: "",
      redirect: false,
      isOpen: false,
      isOpenPic: false,
      isOpenName: false,
      isOpenEmail: false,
      isOpenPassword: false
    }
  }

  onUserChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleUserName = () => {
    const userId = this.props.user[0].id
    const user = { user_name: this.state.user_name}

    axios.post(`http://localhost:7001/api/profile/${userId}/edit/user_name`, { ...user })
    .then((response) => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  handleUserEmail = () => {
    const userId = this.props.user[0].id
    const user = { email: this.state.email}

    axios.post(`http://localhost:7001/api/profile/${userId}/edit/email`, { ...user })
    .then((response) => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  handleUserPassword = () => {
    const userId = this.props.user[0].id
    const user = { 
      password: this.state.password,
      password2: this.state.password2
    }

    axios.post(`http://localhost:7001/api/profile/${userId}/edit/password`, { ...user })
    .then((response) => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  deleteAccount = (e) => {
    e.preventDefault();
    const userId = this.props.user[0].id

    axios.delete(`http://localhost:7001/api/profile/${userId}/edit/delete`)
    .then((res) => {
      if(res.data != null) {
        this.setState({ redirect: true });
      }
      this.homeRedirect()
    })
    .catch(error => {
      console.log(error)
    })
  }

  homeRedirect = () => {
    this.props.history.push("/")
  }

  toggle = () => {
    const { isOpen } = this.state
    this.setState({
      isOpen: !isOpen
    })
  }

  togglePic = () => {
    const { isOpenPic } = this.state
    this.setState({
      isOpenPic: !isOpenPic
    })
  }

  toggleName = () => {
    const { isOpenName } = this.state
    this.setState({
      isOpenName: !isOpenName
    })
  }

  toggleEmail = () => {
    const { isOpenEmail } = this.state
    this.setState({
      isOpenEmail: !isOpenEmail
    })
  }

  togglePassword = () => {
    const { isOpenPassword } = this.state
    this.setState({
      isOpenPassword: !isOpenPassword
    })
  }


  render() {
    const { isOpen, isOpenPic, isOpenName, isOpenEmail, isOpenPassword } = this.state;
    
    return(
      <div className="account">
        <h1>My Account</h1>
        <div className="row g-3">
          <div className="col-md-12">
            <h2>Profile Picture</h2>
            <img onClick={this.togglePic} className="mainimage" alt="profile" src={this.props.user[0].image} />
            <Modal isOpen={isOpenPic} toggle={this.togglePic}>
              <ModalHeader toggle={this.togglePic}>Profile Picture</ModalHeader>
              <ModalBody>
                <Editprofilepic />
              </ModalBody>
            </Modal>
          </div>
          <div className="col-md-12">
            <h2>Background Picture</h2>
            <img onClick={this.toggle} className="backgroundimage" alt="background" src={this.props.user[0].background_image} />
            <Modal isOpen={isOpen} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>Background Picture</ModalHeader>
              <ModalBody>
                <Editbackimage />
              </ModalBody>
            </Modal>
          </div>
          <div className="col-md-12" id="editusername">
            <h2>Username</h2> 
            <h4 id="myaccount">{this.props.user[0].user_name}</h4>
            <p id="edit" onClick={this.toggleName}>Edit</p>
          </div>
          <div className="col-md-12">
            <Modal isOpen={isOpenName} toggle={this.toggleName}>
              <ModalHeader toggle={this.toggleName}>Username</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleUserName}>
                    <FormGroup className="editdetails">
                      <Input type="text" name="user_name" placeholder="Edit Username" onChange={this.onUserChange}/>
                      <Button type="submit" id="editprofile">Update</Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
            </Modal>
          </div>
          <div className="col-md-12" id="editemail">
            <h2>Email</h2>
            <h4 id="myaccount">{this.props.user[0].email}</h4>
            <p id="edit" onClick={this.toggleEmail}>Edit</p>
          </div>
          <div className="col-md-12">
            <Modal isOpen={isOpenEmail} toggle={this.toggleEmail}>
              <ModalHeader toggle={this.toggleEmail}>Email</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleUserEmail}>
                    <FormGroup className="editdetails">
                      <Input type="text" name="email" placeholder="Edit Email" onChange={this.onUserChange} />
                      <Button type="submit" id="editprofile">Update</Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
            </Modal>
          </div>
          <div className="col-md-12" id="editpassword">
            <h2>Password</h2>
            <p id="edit" onClick= {this.togglePassword}>Edit</p>
          </div>
          <div className="col-md-12">
            <Modal isOpen={isOpenPassword} toggle={this.togglePassword}>
              <ModalHeader toggle={this.togglePassword}>Password</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.handleUserPassword} className="updatepass">
                    <FormGroup >
                      <Input 
                        type="text" 
                        name="password" 
                        placeholder="Enter your new Password" 
                        onChange={this.onUserChange}
                      >
                      </Input>
                      <Input 
                        type="text" 
                        name="password2" 
                        placeholder="Repeat your Password" 
                        onChange={this.onUserChange} 
                      >
                      </Input>
                      <Button type="submit" id="editprofile">Update</Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
            </Modal>
          </div>
        </div>
        <Form onSubmit={this.deleteAccount}>
          <Button type="submit">Delete Account</Button>
        </Form>
      </div>
    )
  }

}

export default Withuser(Editprofile);