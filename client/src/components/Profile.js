import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, CardImg} from "reactstrap";
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
      myFollowing: []
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

  render() {
    const { thoughts, following, followers, myFollowers, myFollowing } = this.state
    const  userName  = this.props.user[0].user_name

    return(
    <div className="user">
      <div className="file">
        <img className="backgroundpic" alt="background" src={this.props.user[0].background_image} />
        <img className="profilepic" alt="profile" src={this.props.user[0].image} />
        <h1>{userName}</h1>
          <br />
      </div>
      <div className="followers">
        <Link className="link" to="/followers">
          Followers: {followers}
        </Link>
        <ul>
          {myFollowers.map((fol, index) => {
            return (
              <Card>
                <CardBody>
                  <CardImg className="followerpic" top width="15%" src={fol.image} />
                </CardBody>
              </Card>
            )
          })}
        </ul>
      <br />
        <Link className="link" to="/following">
          Following: {following}
        </Link>
        <ul>
          {myFollowing.map((fol, index) => {
            return (
              <Card>
                <CardBody>
                  <CardImg className="followerpic" top width="15%" src={fol.image} />
                </CardBody>
              </Card>
            )
          })}
        </ul>
      </div>
      <div>
        <div className ="activity">
          Your Activity
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