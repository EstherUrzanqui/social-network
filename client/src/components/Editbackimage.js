import React from "react";
import axios from "axios";
import Withuser from "./Withuser"
import { Button, Form, Input, FormGroup } from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

class Editbackimage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      background_image: null,
    }
  }

  onChange = e => {
    console.log(e.target.files[0])
    this.setState({
      background_image: e.target.files[0]
    })
  }

  uploadBackgroundImage = () => {
    const formData = new FormData()
    const userId = this.props.user[0].id

    formData.append("background_image", this.state.background_image)

    axios.post(`http://localhost:7001/api/profile/${userId}/uploadbackground`, formData, {
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
      <div>
        <Form onSubmit={this.uploadBackgroundImage}>
          <FormGroup>
            <Input type="file" name="upload_background" onChange={this.onChange} />
            <Button type="submit" id="editpicbtn">Save</Button>
          </FormGroup>
        </Form>
      </div>
    )
  }

}

export default Withuser(Editbackimage)