import React from "react"
import axios from "axios"

import { Button, Form, FormGroup, Input } from 'reactstrap'

class Feed extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            body: "",
            createdAt: null, 
            updatedAt: null,
            feed: [],
            error: false,
            loggedIn: false,
        }
    }

    componentDidMount = () => {
      this.getFeed()
    }

    getFeed = () => {
      axios("http://localhost:7001/api/profile/shares", {
        method: "GET",
        data: {
          
        }
      })
    }

    handleChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const { body, createdAt, updatedAt } = this.state
        
          axios('/profile/share', {
            method: 'POST',
            data: {
              body,
              createdAt,
              updatedAt,
              loggedIn: true,
            },
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
        const { body, createdAt, updatedAt } = this.state

        return (
            <div className="feedform">
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Input 
                            value={body}
                            onChange={this.handleChange}
                            name="share"
                            placeholder="Enter your post here"
                            type="textarea"
                        />
                    </FormGroup>
                    <Button>Post</Button>
                </Form>
            </div>
        )
    }
}

export default Feed
