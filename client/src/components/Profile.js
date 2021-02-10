import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, CardImg, FormGroup, Form, Input, Button} from "reactstrap";
import Withuser from "./Withuser"
import Editprofile from "./Editprofile"
import moment from "moment"
import "../css/Profile.css" 
import { Link } from "react-router-dom"

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
      body: ""
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
      const response = await axios(`http://localhost:7001/api/profile/shares/${userId}`)
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
        console.log(response.data)
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
        console.log(response.data)
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

  handleSubmit = () => {
    const user_id  = this.props.user[0].id
    const { body } = this.state

    axios.post("http://localhost:7001/api/profile/share", {
        user_id,
        body,
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
    }) 
    .then(response => {
      console.log(response.data)
      this.setState(state => ({
        loggedIn: !state.loggedIn,
      }))
    })
    .catch(error => {
      console.log(error)
    })
  }

  render() {
    const { thoughts, following, followers, myFollowers, myFollowing, body } = this.state
    const  userName  = this.props.user[0].user_name

    return(
    <div className="user">
      <div className="file">
        <img className="backgroundpic" alt="background" src={this.props.user[0].background_image} />
        <img className="profilepic" alt="profile" src={this.props.user[0].image} />
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
                placeholder="What are you thinking?"
                type="textarea"
              />
            </FormGroup>
            <Button className="submit">Post</Button>
          </Form>
      </div>
      <Link className="link" id="firstlink" to="/followers">
          Followers: {followers}
      </Link>
      <div className="row">
          {myFollowers.map((fol, index) => {
            return (
              <Card>
                <CardBody>
                  <CardImg className="followerpic" top width="15%" src={fol.image} />
                </CardBody>
              </Card>
            )
          })}
      <br />
      </div>
      <Link className="link" to="/following">
          Following: {following}
      </Link>
      <div className="row">
          {myFollowing.map((fol, index) => {
            return (
              <Card>
                <CardBody>
                  <CardImg className="followerpic" top width="15%" src={fol.image} />
                </CardBody>
              </Card>
            )
          })}
      </div>
      <div>
        <div className ="activity">
          Last Posts
        </div>
      <ul>
        {thoughts.map((thought, index) => {
          return (
            <Card className='thoughts' key={index}>
              <CardBody>
                <CardImg className="pic" top width="15%" src={this.props.user[0].image} alt="profile pic" />
                <CardTitle className="posted" >{thought.user_name} posted at {moment(thought.createdAt).format("MMM Do YYYY")}</CardTitle>
                <CardText>{thought.body}</CardText>
              </CardBody>
            </Card>
          )
        })}
      </ul>
      </div>
    </div>
    ) 
  }
}


export default Withuser(Profile);