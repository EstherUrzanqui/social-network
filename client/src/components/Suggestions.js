import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap'
import "../css/Suggestions.css"
import { withRouter } from "react-router";


class Suggestions extends React.Component {
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
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/suggestions`)
      this.setState({ users: response.data})
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
    } catch (error) {
      this.setState({ error: true})
    }
  }

  onFollow = (e) => {    
    this.getFollowing();
    this.followUser(e);
    window.location.reload();
  }

  handleClick = (id) => {
    this.props.history.push(`/allprofiles/${id}`)
    window.location.reload()
  }

  render() {
    const { users } = this.state
    const userId = this.props.user[0].id
    
    return (
      <div class="col-2">
        <h2 id="titlesuggestions">Suggestions</h2>
        <ul>
          {users.map((user, index) => {
           if(user.id !== userId) {
             return (
              <Card className="users" key= {index}>
                <CardBody onClick={() => this.handleClick(user.id)}>
                  <CardTitle id="suggname">{user.user_name}</CardTitle>
                  <CardImg className="picfollowers"  src={user.image} />
                  <Button className="buttonsuggestions" value={user.id} onClick={this.onFollow}>Follow</Button>
                </CardBody>
              </Card>
             )}  
          })}
        </ul>
      </div>
    )
  }
}


export default withRouter(withUser(Suggestions));