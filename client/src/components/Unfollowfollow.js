import React from "react";
import withUser from "./Withuser";
import axios from "axios";
import { Button } from 'reactstrap';

class Unfollowfollow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      following: [],
      followingUsers: []
    }
  }

  componentDidMount = () => {
    this.getUsers()
    this.getFollowing()
  }

  getUsers = async () => {
    try {
      const response = await axios(`http://localhost:7001/api/users`)
      this.setState({ users: response.data})
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

  render() {
    const { users, followingUsers } = this.state
    const userId = this.props.user[0].id
    return(
      <div>
        {users.map((user, index) => {
          if(userId !== user.id) {
            if(followingUsers.includes(user.user_name)) {
              return(
                <Button key={index} value={user.id} onClick={this.onUnfollow}>Unfollow</Button>
              )
            } else {
              return(
                <Button key={index} value={user.id} onClick={this.onFollow}>Follow</Button>
              )
            }
          } 
        })}
      </div>
      
    )
  }

}

export default withUser(Unfollowfollow);