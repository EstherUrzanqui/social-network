import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, CardImg, FormGroup, Form, Input, Button, Modal, ModalBody, Label } from "reactstrap";
import Withuser from "./Withuser"
import moment from "moment"
import "../css/Profile.css" 
import { Link } from "react-router-dom"
import Followers from "./Followers";
import Editbackimage from "./Editbackimage";
import ModalHeader from "reactstrap/lib/ModalHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import Editprofilepic from "./Editprofilepic";
import Suggestions from "./Suggestions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-regular-svg-icons";



class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      loggedIn: undefined,
      thoughts: [],
      following: [],
      followers: [],
      myFollowers: [],
      myFollowing: [],
      body: "",
      isOpen: false,
      isOpenPic: false,
      pictures: null
      
    }
  }

  componentDidMount = () => {
    this.getShares()
    this.getFollowingCount()
    this.getFollowersCount()
    this.getFollowers()
    this.getFollowing()
  }

  getShares = async () => {
    const userId= this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/profile/${userId}`)
      this.setState((state) => ({
        thoughts: response.data,
        loggedIn: !state.loggedIn
      }))
    } catch(error) {
      this.setState({ error: true })
    }
  }

  getFollowingCount = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/following/count`)
      this.setState({
        following: Object.values(response.data[0])
      })
    } catch(error) {
      this.setState({ error: true })
    }
  }

  getFollowersCount = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/followers/count`)
    
      this.setState({
        followers: Object.values(response.data[0])
      })
    } catch(error) {
      this.setState({ error: true })
    }
  }
  
  getFollowers = () => {
    const userId = this.props.user[0].id

    axios(`http://localhost:7001/api/users/${userId}/followers`)
      .then(response => {
        this.setState({ myFollowers: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getFollowing = () => {
    const userId = this.props.user[0].id

    axios(`http://localhost:7001/api/users/${userId}/following`)
      .then(response => {
        this.setState({ myFollowing: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onImageChange = e => {
    console.log(e.target.files[0])
    this.setState({
      pictures: e.target.files[0]
    })
  }

  handleSubmit = () => {
    const formData = new FormData()

    formData.append("user_id", this.props.user[0].id)
    formData.append("body", this.state.body) 
    formData.append("createdAt", new Date().toISOString().slice(0,10)) 
    formData.append("updatedAt", new Date().toISOString().slice(0,10))
    formData.append("pictures", this.state.pictures)

    axios.post("http://localhost:7001/api/profile/share", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    
    }) 
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
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

  handleClick = (id) => {
    this.props.history.push(`/allprofiles/${id}`)
  }

  render() {
    const { thoughts, following, followers, myFollowers, myFollowing, body, isOpen, isOpenPic } = this.state
    const  userName  = this.props.user[0].user_name

    return(
    <div className="user">
      <div className="file">
        <img className="backgroundpic" onClick={this.toggle} alt="background" src={this.props.user[0].background_image} />
        <Modal isOpen={isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Background Picture</ModalHeader>
          <ModalBody>
            <Editbackimage />
          </ModalBody>
        </Modal>
        <img className="profilepic" onClick={this.togglePic} alt="profile" src={this.props.user[0].image} />
        <Modal isOpen={isOpenPic} toggle={this.togglePic}>
          <ModalHeader toggle={this.togglePic}>Profile Picture</ModalHeader>
          <ModalBody>
            <Editprofilepic />
          </ModalBody>
        </Modal>
        <h1 id="underline">{userName}</h1>
          <br/>
      </div>
      <div>
        <Form className="profilethinking" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input 
                id= "textarea"
                cols="60"
                rows="4"
                value={body}
                onChange={this.handleChange}
                name="body"
                placeholder="Express Yourself"
                type="textarea"
              />
              <Label className="profilefile">
                <Input type="file" onChange={this.onImageChange} style={{display:"none"}} required={false} /> 
                <FontAwesomeIcon icon={faImages} size="lg"/>
              </Label>
            </FormGroup>
            <Button className="post-profile">Post</Button>
          </Form>
      </div>
      <div className="profilecolumns">
        <div className="icons">
          <div class="col-3">
            <Link className="link" id="firstlink" to="/followers">
              Followers:{followers}
            </Link>
            <div className="grid">
              {myFollowers.map((fol, index) => {
                return (
                <Card>
                  <CardImg onClick={() => this.handleClick(fol.id)} className="picfollowers" src={fol.image} />
                </Card>
                )
              })}
            </div>
            <Link className="link" to="/following">
              Following:{following}
            </Link>
            <div className="grid">
              {myFollowing.map((fol, index) => {
                return (
                  <Card>
                    <CardImg onClick={() => this.handleClick(fol.id)} className="picfollowers" src={fol.image} />
                  </Card>
                )
              })}
            </div>
          </div>
          </div>
          <div class="col-7">
            <div>
              <div className ="activity">
                Latest Posts
              </div>
              <ul>
                {thoughts.map((thought, index) => {
                  return (
                <Card className='thoughts' key={index}>
                  <CardBody>
                    <CardImg className="pic" top width="100%" src={this.props.user[0].image} alt="profile pic" />
                    <CardTitle className="posted" >{thought.user_name} posted at {moment(thought.createdAt).format("MMM Do YYYY")}</CardTitle>
                    <CardText className="userpost">{thought.body}</CardText>
                    {thought.pictures === "NULL" ? null : <CardImg className="messagepic" top width="90%" src={thought.pictures} />}
                  </CardBody>
                </Card>
                )
              })}
              </ul>
            </div>
          </div>
          <div class="col-2">
            <div className="usersinplat">
              <Suggestions />
            </div>
          </div>
      </div>
      
    </div>
    ) 
  }
}


export default Withuser(Profile);