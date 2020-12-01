import React from "react";
import axios from "axios";
import withUser from "./Withuser"
import { Button, Card, CardBody, CardTitle } from 'reactstrap'

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
                      <CardTitle>{follow.user_name}</CardTitle>
                    </CardBody>
                  </Card>)
              })}
            </ul>
        </div>
    )
  }
}

export default withUser(Following);