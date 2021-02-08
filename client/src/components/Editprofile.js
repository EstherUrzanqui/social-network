import React from "react";
import axios from "axios";
import Withuser from "./Withuser"
import { Button, Form, Input, FormGroup } from "reactstrap"
import Label from "reactstrap/lib/Label";

class Editprofile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      user_name: "", 
      email: "",
      password: "",
      password2: ""
    }
  }

  onChange = e => {
    console.log(e.target.files[0])
    this.setState({image: e.target.files[0]})
  }
  
  uploadImage = () => {
    const formData = new FormData()
    const userId = this.props.user[0].id

    formData.append("image", this.state.image)

    axios.post(`http://localhost:7001/api/profile/${userId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
        console.log(error)
    })
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


  render() {
    //Modal to image
    return(
      <div className="user-edit">
        <Form onSubmit={this.uploadImage}>
          <FormGroup>
            <Label>Edit your profile picture</Label>
            <Input type="file" name="upload_file" onChange={this.onChange} />
            <Button type="submit">Save</Button>
          </FormGroup>
        </Form>
        <Form onSubmit={this.handleUserName}>
          <FormGroup>
            <Label>Edit your Username</Label>
            <Input type="text" name="user_name" placeholder="Edit Username" onChange={this.onUserChange}/>
            <Button type="submit">Save</Button>
          </FormGroup>
        </Form>
        <Form onSubmit={this.handleUserEmail}>
          <FormGroup>
            <Label>Email</Label>
            <Input type="text" name="email" placeholder="Edit Email" onChange={this.onUserChange} />
            <Button type="submit">Save</Button>
          </FormGroup>
        </Form>
        <Form onSubmit={this.handleUserPassword}>
          <FormGroup>
            <Label>Password</Label>
            <Input type="text" name="password" placeholder="Enter your new Password" onChange={this.onUserChange} />
            <Input type="text" name="password2" placeholder="Repeat Password" onChange={this.onUserChange} />
            <Button type="submit">Save</Button>
          </FormGroup>
        </Form>
      </div>
    )
  }

}

export default Withuser(Editprofile);