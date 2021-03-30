import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Card, CardBody, CardTitle, Button } from 'reactstrap'
import CardImg from "reactstrap/lib/CardImg";

class Following extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      following: []
    }
  }

  componentDidMount() {
    this.getFollowing()
  }

  getFollowing = async () => {
    const userId = this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/users/${userId}/following`)
      
      this.setState({ 
        following: response.data,
      })
      console.log(response.data)
    } catch (error) {
      this.setState({ error: true})
    }
  }

  handleClick = (id) => {
    this.props.history.push(`/allprofiles/${id}`)
    
  }

  render() {
    const { following } = this.state

    return (
      <div>
          <h2>Following</h2>
            <ul>
              {following.map((follow, index) => {
                return (
                  <Card key= {index}>
                    <CardBody>
                      <CardImg className="picfollowers" top width="9%" src={follow.image} />
                      <CardTitle>{follow.user_name}</CardTitle>
                    </CardBody>
                    <Button onClick={() => this.handleClick(follow.id)}>Profile</Button>
                  </Card>)
              })}
            </ul>
        </div>
    )
  }
}

export default withUser(Following);