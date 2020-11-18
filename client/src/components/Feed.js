import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardBody, CardTitle, CardSubtitle, CardText, Row, Col } from 'reactstrap'
import Withuser from "./Withuser"
import moment from "moment"


class Feed extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        feed: [],
        body: "",
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
          console.log(this.state.feed)
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }

    handleSubmit = event => {
      event.preventDefault()
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
                placeholder="Enter your thoughts here"
                type="textarea"
              />
            </FormGroup>
            <Button className="button-feed">Post</Button>
          </Form>
          <h2>Your Feed</h2>
            <ul>
              {feed.map((feeds, index) => {
                return (
                  <Card className='thoughts' key={index}>
                    <CardBody>
                      <CardTitle>{feeds.user_name} posted at {moment(feeds.createdAt).format("MMM Do YYYY")}</CardTitle>
                      <CardText>{feeds.body}</CardText>
                    </CardBody>
                  </Card>
                )
              })}
            </ul>
        </div> 
      )
    }
}

export default Withuser(Feed, { renderNull: false })
