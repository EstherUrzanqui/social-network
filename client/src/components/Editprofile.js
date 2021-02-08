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
      user_name: ""
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

  render() {
    
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
        <Form>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
          </FormGroup>
        </Form>
      </div>
    )
  }

}

export default Withuser(Editprofile);