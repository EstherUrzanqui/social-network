import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Button, Card, CardBody, CardTitle } from 'reactstrap'


class Followers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      follower: [],
      following: []
    }
  }

  componentDidMount = () => {
    this.getUsers()
    this.getFollowing()
  }

  getUsers = () => {
    axios(`http://localhost:7001/api/users`)
      .then(response => {
        this.setState({ users: response.data})
        console.log(response.data)
      })
      .catch(error => {
        this.setState({ error: true })
      })
  }

  getFollowing = () => {
    const userId = this.props.user[0].id

    axios(`http://localhost:7001/api/users/${userId}/following`)
    .then(response => {
      this.setState({ following: response.data})
      console.log(response.data)
    })
    .catch(error => {
      this.setState({ error: true})
    })
  }

  followUser = (e) => {
    e.preventDefault();
    const userId = this.props.user[0].id
    const followedId = e.target.value
    
    axios.post(`http://localhost:7001/api/users/${userId}/follow/${followedId}`, {
      userId,
      followedId,
      followed: 1,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    })
    .then(response => {
      console.log(response.data)
        this.setState(state => ({
          loggedIn: !state.loggedIn,
          followed: true,
        }))  
    })
    .catch(error => {
      console.log(error)
    })
  }

  unfollowUser = (e) => {
    e.preventDefault();
    const userId = this.props.user[0].id
    const followedId = e.target.value

    axios.delete(`http://localhost:7001/api/users/${userId}/unfollow/${followedId}`)
    .then(response => {
      console.log(response)
      this.setState({ followed: false })
    })
    .catch(error => {
      this.setState({ error: true })
    })
  }


  render() {
    const { users, following } = this.state
    const userId = this.props.user[0].id
    const followingUsers = this.state.following.map((follow, index) => {
      return (
        follow.followedId
      )
    })
    console.log(followingUsers)

    return (
      <div>
        <h2>Users in Unax</h2>
        <ul>
          {users.map((user, index) => {
           if(user.id !== userId) {
             return (
              <Card className="users" key= {index}>
                <CardBody>
                  <CardTitle>{user.user_name}</CardTitle>
                  {followingUsers.includes(user.id) ? (
                    <Button id="btn-1" value={user.id} onClick={this.unfollowUser}>Unfollow</Button>
                   ) : (
                    <Button id="btn" value={user.id} onClick={this.followUser}>follow</Button>
                   )}
                </CardBody>
              </Card>
             )}  
          })}
        </ul>
        <div>
          <h2>Following</h2>
            <ul>
              {following.map((follow, index) => {
                return (
                  <Card key= {index}>
                    <CardBody>
                      <CardTitle>{follow.followedId}</CardTitle>
                    </CardBody>
                  </Card>)
              })}
            </ul>
        </div>
      </div>
    )
  }
}


export default withUser(Followers);