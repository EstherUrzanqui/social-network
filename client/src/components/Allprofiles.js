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
      profilePic: null,
      currentFollow: [],
      followingUsers: []
    }
  }

  componentDidMount = () => {
    this.getUserInfo()
    this.getShares()
    this.getFollowingCount()
    this.getFollowersCount()
    this.getFollowers()
    this.getFollowing()
    this.getCurrentFollow()
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

  getCurrentFollow = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/following`)

      const tempFollowing = response.data.map((follow, index) => {
        return follow.user_name
      })
      this.setState({ 
        currentFollow: response.data,
        followingUsers: tempFollowing
      })
    } catch (error) {
      this.setState({ error: true})
    }
  }

  followUser = async (e) => {
    const userId = this.props.user[0].id
    const followedId = e.target.value
    
    try {
      const response = await axios.post(`http://localhost:7001/api/users/${userId}/follow/${followedId}`, {
        userId,
        followedId,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10)
      })
      
      console.log(response.data)
      this.setState(state => ({
        loggedIn: !state.loggedIn,
      })) 
    } catch(error) {
      console.log(error)
    }
  }

  unfollowUser = async (e) => {
    //e.preventDefault();
    const userId = this.props.user[0].id;
    const followedId = e.target.value;
 
    try {
      const response = await axios.delete(
        `http://localhost:7001/api/users/${userId}/unfollow/${followedId}`
      );
      console.log(response);
      let array = [...this.state.currentFollow];
      let index = array.indexOf(followedId);
      if (index !== -1) {
        array.splice(index, 1);
 
        const tempFollowing = array.map((follow, index) => {
          return follow.followedId;
        });
 
        this.setState({
          currentFollow: array,
          followingUsers: tempFollowing,
        });
 
      }
    } catch (error) {
      this.setState({ error: true });
    }
  };

  onFollow = (e) => {    
    this.getCurrentFollow();
    this.followUser(e);
    window.location.reload();
  }

  onUnfollow = (e) => {
    this.getCurrentFollow()
    this.unfollowUser(e)
    window.location.reload();
  }

  getProfileFollowers = (id) => {
    this.props.history.push(`/othersfollowers/${id}`)
  }

  getProfileFollowing = (id) => {
    this.props.history.push(`/othersfollowing/${id}`)
  }


  render() {
    const { thoughts, following, followers, myFollowers, myFollowing, userName, backgroundPic, profilePic, currentFollow, followingUsers } = this.state
    const followedId = this.props.match.params.id
    console.log(myFollowers)
    
    return(
    <div className="user">
      <div className="file">
        <img className="backgroundpic" alt="background" src={backgroundPic} />
        <img className="profilepic"  alt="profile" src={profilePic} />
        <h1 id="underline">{userName}</h1>
        {followingUsers.includes(userName) ? (
          <Button value={followedId} onClick={this.onUnfollow}>Unfollow</Button>
        ) : (
          <Button value={followedId} onClick={this.onFollow}>Follow</Button>
        )} 
          <br/>
      </div>
      <div className="container-fluid">
        <div class="row">
          <div class="col-2">
            <Link className="link" onClick={() => this.getProfileFollowers(followedId)}>
              Followers:{followers[0]}
            </Link>
            <div className="grid">
              {myFollowers.map((fol, index) => {
                return (
                <Card>
                  <CardImg className="picfollowers" src={fol.image} />
                </Card>
                )
              })}
            </div>
            <Link className="link" onClick={() => this.getProfileFollowing(followedId)}>
              Following:{following}
            </Link>
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
                    <CardImg className="pic" top width="100%" src={profilePic} alt="profile pic" />
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