import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'
//import "../css/Followers.css"
import "../css/Othersfollowers.css"


class Othersfollowers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      followers: [],
      followingUsers: []
    }
  }

  componentDidMount = () => {
    this.getFollowers()
  }

  getFollowers = async () => {
    const userId = this.props.match.params.id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/followers`)
      this.setState({ followers: response.data})
      console.log(response.data)
    } catch {
      this.setState({ error: true })
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
      let array = [...this.state.following];
      let index = array.indexOf(followedId);
      if (index !== -1) {
        array.splice(index, 1);
 
        const tempFollowing = array.map((follow, index) => {
          return follow.followedId;
        });
 
        this.setState({
          following: array,
          followingUsers: tempFollowing,
        });
 
      }
    } catch (error) {
      this.setState({ error: true });
    }
  };

  onFollow = (e) => {    
    this.getFollowing();
    this.followUser(e);
    window.location.reload();
  }

  onUnfollow = (e) => {
    this.getFollowing()
    this.unfollowUser(e)
    window.location.reload();
  }

  handleClick = (id) => {
    this.props.history.push(`/allprofiles/${id}`)
    
  }

  render() {
    const { followers, followingUsers } = this.state
    console.log(followers)
    
    return (
      <div className="otherprofilefollowers">
        <div className="description">
          <h3 id="otherfollowerstitle">{this.props.user_name} followers</h3>
        </div>
        <div className="listfollowersallprofiles">
          {followers.map((follower, index) => {
             return (
              <Card id="usersotherprofiles" key= {index}>
                <CardBody id="cardbodyothersfollowers">
                  <CardImg id="picotherfollowers" top width="9%" src={follower.image} />
                  <CardTitle id="cardtitleotherfollowers" onClick={() => this.handleClick(follower.id)}>{follower.user_name}</CardTitle>
                  {followingUsers.includes(follower.user_name) ? (
                    <Button id="buttonotherfollowers" value={follower.id} onClick={this.onUnfollow}>Unfollow</Button>
                  ) : (
                    <Button id="buttonotherfollowers" value={follower.id} onClick={this.onFollow}>Follow</Button>
                  )}
                </CardBody>
              </Card>
             )  
          })}
        </div>
      </div>
    )
  }
}


export default withUser(Othersfollowers);