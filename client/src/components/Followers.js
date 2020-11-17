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

  followUser = (e) => {
    e.preventDefault();
    const userId= this.props.user[0].id
    const followedId = e.target.value
    
    axios.post(`http://localhost:7001/api/users/${userId}/follow/${followedId}`, {
      userId,
      followedId,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    })
    .then(response => {
      console.log(response.data)
      this.setState(state => ({
        loggedIn: !state.loggedIn
      }))
    })
    .catch(error => {
      console.log(error)
    })
  }


  render() {
    const { users } = this.state
    return (
      <div>
        <h2>Users in Unax</h2>
        <ul>
          {users.map((user, index) => {
            return (
              <Card className="users" key= {index}>
                <CardBody>
                  <CardTitle>{user.user_name}</CardTitle>
                  <Button id="btn" value={user.id} onClick={this.followUser}>Follow</Button>
                </CardBody>
              </Card>
            )
          })}
        </ul>
      </div>
    )
  }
}


export default withUser(Followers);