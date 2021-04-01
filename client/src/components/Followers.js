import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Card, CardBody, CardTitle, CardImg } from 'reactstrap'
import "../css/Followers.css"


class Followers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      followers: [],
    }
  }

  componentDidMount = () => {
    this.getFollowers()
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

  handleClick = (id) => {
    this.props.history.push(`/allprofiles/${id}`)
    
  }

  render() {
    const { followers } = this.state
    
    return (
      <div>
        <ul>
          {followers.map((follower, index) => {
             return (
              <Card className="users" key= {index}>
                <CardBody>
                  <CardImg className="picfollowers" top width="9%" src={follower.image} />
                  <CardTitle onClick={() => this.handleClick(follower.id)}>{follower.user_name}</CardTitle>
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