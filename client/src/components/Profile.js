import React from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText} from "reactstrap";
import Withuser from "./Withuser"

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      thoughts: []
    }
  }

  componentDidMount = () => {
    this.getShares()
  }

  getShares = () => {
    const user_id = this.props.user[0].id
    console.log(this.props.user[0].id)

    axios(`http://localhost:7001/api/profile/shares/${user_id}`)

    .then(res => {
      console.log(res.data)
      this.setState(state => ({
        thoughts: res.data,
        loggedIn: !state.loggedIn
      }))
    })
    .catch(error => {
      this.setState({ error: true })
    })
  }

  render() {
    const { thoughts } = this.state
    return(
    <div>
      <h1>Your posts</h1>
      <ul>
        {thoughts.map((thought, index) => {
          return (
            <Card className='thoughts' key={index}>
              <CardBody>
                <CardTitle>{thought.user_name} posted at {thought.createdAt}</CardTitle>
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


export default Withuser(Profile, { renderNull: true });