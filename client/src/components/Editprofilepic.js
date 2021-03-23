import React from "react";
import axios from "axios";
import Withuser from "./Withuser"
import { Button, Form, Input, FormGroup, Label } from "reactstrap"
import withUser from "./Withuser";


class Editprofilepic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null
    }
  }

  onChange = e => {
    console.log(e.target.files[0])
    this.setState({
      image: e.target.files[0]
    })
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

  render() {
    return(
      <div className="user-edit">
        <Form onSubmit={this.uploadImage}>
          <FormGroup className="editpic">
            <Input type="file" name="upload_file" onChange={this.onChange} />
            <Button type="submit" id="editpicbtn">Save</Button>
          </FormGroup>
        </Form>
      </div>
    )
  }
} 

export default withUser(Editprofilepic);