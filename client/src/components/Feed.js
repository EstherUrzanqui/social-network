import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardText, Row, Col } from 'reactstrap'
import withUser from "./Withuser"

class Feed extends React.Component {
    constructor (props) {
        super(props)
        console.log(props)
        this.state = {
            feed: [],
            body: "",
            createdAt: null,
            updatedAt: null
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
          //console.log(this.state.feed)
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }

    handleSubmit = event => {
      event.preventDefault()
      const { userId } = this.props.user
      const { body, user_id, createdAt, updatedAt } = this.state
          axios.post("http://localhost:7001/api/profile/share", {
            data: {
              user_id: userId,
              body,
              createdAt,
              updatedAt
            }
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
                          value={body}
                          onChange={this.handleChange}
                          name="body"
                          placeholder="Enter your thoughts here"
                          type="textarea"
                        />
                    </FormGroup>
                    <Button className="button-feed">Post</Button>
                </Form>
            </div> 
        )
    }
}

export default withUser(Feed)
