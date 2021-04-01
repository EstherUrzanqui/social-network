import React from "react";
import axios from "axios";
import Withuser from "./Withuser";
import { Card, CardBody, CardTitle, CardText, CardImg, Button} from "reactstrap";
import moment from "moment"
import "../css/Profile.css" 
import { Link } from "react-router-dom"
import Followers from "./Followers";
import 'bootstrap/dist/css/bootstrap.min.css';
import Suggestions from "./Suggestions";


class Allprofiles extends React.Component {
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
      userName: "",
      backgroundPic: null,
      profilePic: null
    }
  }

  componentDidMount = () => {
    this.getUserInfo()
    this.getShares()
    this.getFollowingCount()
    this.getFollowersCount()
    this.getFollowers()
    this.getFollowing()
  }

  getShares = async () => {
    const userId= this.props.match.params.id

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
    const userId = this.props.match.params.id

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
    const userId = this.props.match.params.id

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
    const userId = this.props.match.params.id

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
    const userId = this.props.match.params.id

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


  getUserInfo = () => {
    const { id } = this.props.match.params

    axios(`http://localhost:7001/api/users/${id}`)
      .then(response => {
        console.log(response.data)
        this.setState({ 
          userName: response.data[0].user_name,
          backgroundPic: response.data[0].background_image,
          profilePic: response.data[0].image
        })
      })
      .catch(error => {
        console.log(error)
      })
  }


  render() {
    const { thoughts, following, followers, myFollowers, myFollowing, userName, backgroundPic, profilePic } = this.state
    console.log(followers)
    
    return(
    <div className="user">
      <div className="file">
        <img className="backgroundpic" alt="background" src={backgroundPic} />
        <img className="profilepic"  alt="profile" src={profilePic} />
        <h1 id="underline">{userName}</h1>
        <Button>Following</Button>
          <br/>
      </div>
      <div className="container-fluid">
        <div class="row">
          <div class="col-2">
            <p>Followers:{followers[0]}</p>
            <div className="grid">
              {myFollowers.map((fol, index) => {
                return (
                <Card>
                  <CardImg className="picfollowers" src={fol.image} />
                </Card>
                )
              })}
            </div>
            <p>Following:{following}</p>
            <div className="grid">
              {myFollowing.map((fol, index) => {
                return (
                  <Card>
                    <CardImg className="picfollowers" src={fol.image} />
                  </Card>
                )
              })}
            </div>
          </div>
          <div class="col-8">
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
                  </CardBody>
                </Card>
                )
              })}
              </ul>
            </div>
          </div>
          <div class="col-2">
            <div className="usersinplat">
              <h2 id="sugtitle">Suggestions</h2>
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
      
    </div>
    ) 
  }
}


export default Withuser(Allprofiles);