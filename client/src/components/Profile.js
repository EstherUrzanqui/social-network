import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText} from "reactstrap";
import Withuser from "./Withuser"
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
      image: null
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
    
      this.setState({
        followers: Object.values(response.data[0])
      })
    } catch(error) {
      this.setState({ error: true })
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


  render() {
    const { thoughts, following, followers } = this.state
    const  userName  = this.props.user[0].user_name

    return(
    <div className="user">
      <div className="file">
        
          <form onSubmit={this.uploadImage}>
            <input type="file" className="form-control" name="upload_file" onChange={this.onChange} />
            <button type="submit" className="btn btn-dark">Save</button>
          </form>
          <img className="profilepic" alt="profile" src={this.props.user[0].image} />
          <br />
          Hello {userName}
          <br />
            <Link className="link" to="/followers">
              Followers: {followers}
            </Link>
          <br />
            <Link className="link" to="/following">
              Following: {following}
            </Link>
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