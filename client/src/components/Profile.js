import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText} from "reactstrap";
import Withuser from "./Withuser"
import moment from "moment"

class Profile extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      error: false,
      loggedIn: undefined,
      thoughts: [],
    }
  }

  componentDidMount = () => {
    this.getShares()
  }

  getShares = async () => {
    console.log(this.props.user[0].id)
    const userId= this.props.user[0].id

    try {
      const response = await axios(`http://localhost:7001/api/profile/shares/${userId}`)
      this.setState((state) => ({
        thoughts: response.data,
        loggedIn: !state.loggedIn
      }))
    } catch(error) {
      this.setState({ error: true })
    }
  }

  render() {
    const { thoughts } = this.state
    
    if(!(thoughts.length > 0)) {
      return null;
    }

    return(
    <div>
      <h1>Your posts</h1>
      <ul>
        {thoughts.map((thought, index) => {
          return (
            <Card className='thoughts' key={index}>
              <CardBody>
                <CardTitle>{thought.user_name} posted at {moment(thought.createdAt).format("MMM Do YYYY")}</CardTitle>
                <CardText>{thought.body}</CardText>
              </CardBody>
            </Card>
          )
        })}
      </ul>
    </div>
    ) 
  }
}


export default Withuser(Profile);