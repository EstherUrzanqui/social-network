import React, { useState } from 'react';
import Withuser from "./Withuser";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';

const EditBackImage = (props) => {
  const {
    buttonLable,
    className
  } = props;

  const [modal, setModal] = useState(false);
  const [background_image, setBackground_image] = useState(null);

  const toggle = () => setModal(!modal);

  const onChange = (e) => {
    console.log(e.target.files[0])
    setBackground_image(e.target.files[0])
  }

  const upoloadBackgroundImage = () => {
    const formData = new FormData()
    const userId = this.props.user[0].id

    formData.append("background_image", background_image)

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

  return (
    <div>
      <Button color="danger" onClick={toggle}>{buttonLable}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <Form onSubmit={upoloadBackgroundImage}>
            <FormGroup>
              <Input type="file" name="upload_background" onChange={onChange} />
              <Button type="submit">Save</Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default Withuser(EditBackImage);