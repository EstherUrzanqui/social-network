import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap'


class Followers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      //follower: [],
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
    } catch {
      this.setState({ error: true })
    }
  }

  getFollowing = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/followers`)

      const tempFollowing = response.data.map((follow, index) => {
        return follow.user_name
      })
      this.setState({ 
        following: response.data,
        followingUsers: tempFollowing
      })
      console.log(response.data)
    } catch (error) {
      this.setState({ error: true})
    }
  }

  followUser = async (e) => {
    e.preventDefault();
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
  }

  onUnfollow = (e) => {
    this.getFollowing()
    this.unfollowUser(e)
  }


  render() {
    const { users, followingUsers } = this.state
    const userId = this.props.user[0].id
    
    return (
      <div>
        <h2>Suggestions</h2>
        <ul>
          {users.map((user, index) => {
           if(user.id !== userId) {
             return (
              <Card className="users" key= {index}>
                <CardBody>
                  <CardImg top width="9%" src={user.image} />
                  <CardTitle>{user.user_name}</CardTitle>
                  {followingUsers.includes(user.user_name) ? (
                    <Button id="btn-1" value={user.id} onClick={this.onUnfollow}>Unfollow</Button>
                   ) : (
                    <Button id="btn" value={user.id} onClick={this.onFollow}>follow</Button>
                   )}
                </CardBody>
              </Card>
             )}  
          })}
        </ul>
      </div>
    )
  }
}


export default withUser(Followers);