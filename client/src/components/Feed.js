import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardBody, CardTitle, CardText, CardImg } from 'reactstrap'
import Withuser from "./Withuser"
import moment from "moment"
import Followers from "./Followers";



class Feed extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        feed: [],
        body: ""
      }
    }
        

    componentDidMount = () => {
      this.getFeed()
    } 

    handleChange = e => {
      this.setState({
        [e.target.name]: e.target.value,
      })
  }

    getFeed = () => {
      axios("http://localhost:7001/api/profile/shares")
        .then(response => {
          this.setState({ feed: response.data})
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }

    handleSubmit = () => {
      const user_id  = this.props.user[0].id
      const { body } = this.state

      axios.post("http://localhost:7001/api/profile/share", {
          user_id,
          body,
          createdAt: new Date().toISOString().slice(0,10),
          updatedAt: new Date().toISOString().slice(0,10)
      }) 
      .then(response => {
        console.log(response.data)
        this.setState(state => ({
          loggedIn: !state.loggedIn,
        }))
      })
      .catch(error => {
        console.log(error)
      })
    }

    render() {
      const { body, feed } = this.state
      
      return (
        <div className="feedform">
          <Form className="feed-container" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input 
                id= "textarea"
                cols="60"
                rows="4"
                value={body}
                onChange={this.handleChange}
                name="body"
                placeholder="What are you thinking?"
                type="textarea"
              />
            </FormGroup>
            <Button className="submit">Post</Button>
          </Form>
          <div className="login">Your Feed</div>
            <ul>
              {feed.map((feeds, index) => {
                return (
                  <Card className='thoughts' key={index}>
                    <CardBody>
                      <CardImg className="pic" top width="15%" src={feeds.image} alt="profile pic" />
                      <CardTitle className="userdetails">{feeds.user_name} posted at {moment(feeds.createdAt).format("MMM Do YYYY")}</CardTitle>
                      <CardText>{feeds.body}</CardText>
                    </CardBody>
                  </Card>
                )
              })}
            </ul>
            <div className="suggestions">
              <Followers />
            </div>
        </div> 
      )
    }
}

export default Withuser(Feed)
