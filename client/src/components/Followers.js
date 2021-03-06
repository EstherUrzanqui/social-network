import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'
import "../css/Followers.css"


class Followers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      followers: [],
      following: [],
      followingUsers: []
    }
  }

  componentDidMount = () => {
    this.getFollowers()
    this.getFollowing()
  }

  getFollowers = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/followers`)
      this.setState({ followers: response.data})
      console.log(response.data)
    } catch {
      this.setState({ error: true })
    }
  }

  getFollowing = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/following`)

      const tempFollowing = response.data.map((follow, index) => {
        return follow.user_name
      })
      this.setState({ 
        following: response.data,
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
    console.log(followingUsers)
    console.log(followers)
    
    return (
      <div className="showfollowers">
        <div className="titlefollowers">
          <h3 id="followerstitle">Followers</h3>
        </div>
        <div className="gridbackground">
          {followers.map((follower, index) => {
             return (
              <Card id="users" key= {index}>
                <CardBody id="cardbodyfollowers">
                  <CardImg id="picfollowers" top width="9%" src={follower.image} />
                  <CardTitle id="cardtitlefollowers" onClick={() => this.handleClick(follower.id)}>{follower.user_name}</CardTitle>
                  {followingUsers.includes(follower.user_name) ? (
                    <Button id="buttonfollowers" value={follower.id} onClick={this.onUnfollow}>Unfollow</Button>
                  ) : (
                    <Button id="buttonfollowers" value={follower.id} onClick={this.onFollow}>Follow</Button>
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


export default withUser(Followers);