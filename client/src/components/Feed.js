import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardText, Row, Col } from 'reactstrap'
import Withuser from "./Withuser"

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
        const { userId, body, createdAt, updatedAt, feed } = this.state
        const { user } = this.props

        if (!user) {
          return (
            <div className='login'>
              <div>
                <br />
                <h1>You need to log in first</h1>
                <Button color='success' onClick={this.loginRedirect}>
                  Login
                </Button>
              </div>
            </div>
          )
        }

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

export default Withuser(Feed, { renderNull: false })
