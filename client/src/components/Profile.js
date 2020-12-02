import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText} from "reactstrap";
import Withuser from "./Withuser"
import moment from "moment"
import "../css/Profile.css" 

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      loggedIn: undefined,
      thoughts: [],
      following: [],
      followers: []
    }
  }

  componentDidMount = () => {
    this.getShares()
    this.getFollowing()
    this.getFollowers()
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

  getFollowing = async () => {
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

  getFollowers = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/followers/count`)
      console.log(Object.values(response.data[0]))
      this.setState({
        followers: Object.values(response.data[0])
      })
    } catch(error) {
      this.setState({ error: true })
    }
  }

  render() {
    const { thoughts, following, followers } = this.state
    const  userName  = this.props.user[0].user_name
    
    if(!(thoughts.length > 0)) {
      return null;
    }

    return(
    <div className="user">
      <div className="details">
        Hello {userName}
        <br></br>
        <div clasName="followers">
          Followers: {followers}
        </div>
        <br></br>
        <div className="following">
          Following: {following}
        </div> 
        
      </div>
      <div className="post">
      <h1>Your posts</h1>
      <ul>
        {thoughts.map((thought, index) => {
          return (
            <Card className='thoughts' key={index}>
              <CardBody>
                <CardTitle>{thought.user_name} posted at {moment(thought.createdAt).format("MMM Do YYYY")}</CardTitle>
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