import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardBody, CardTitle, CardText, CardImg, UncontrolledCollapse, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Withuser from "./Withuser"
import moment from "moment"
import Search from "./Search";
import Suggestions from "./Suggestions"
import Replies from "./Replies"



class Feed extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        feed: [],
        body: "",
        results: [],
        message: false,
        error: false, 
        reply: "", 
        comments: [],
        isOpen: false,
        togId: null
      }
    }
        

    componentDidMount = () => {
      this.getFeed()
      this.getComments()
      
    } 

    handleChange = e => {
      this.setState({
        [e.target.name]: e.target.value,
      })
    }

    getFeed = () => {
      const userId = this.props.user[0].id
      
      axios(`http://localhost:7001/api/profile/shares/${userId}`)
        .then(response => {
          this.setState({ feed: response.data})
          console.log(response.data)
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

    fetchSearchResults = (query = " ") => {
      if(!query) {
        this.getFeed()
        return
      }
      fetch(`http://localhost:7001/api/search/${query}`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          if(data.length === 0) {
            this.setState({ message: true })
          } else {
            this.setState({
              results: data,
              message: false
            })
          }
        })
    }

    getComments = (id) => {
      axios(`http://localhost:7001/api/profile/share/${id}/comments`)
        .then(response => {
          this.setState({ comments: response.data})
          console.log(response.data)
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }

    handleReplies = () => {
      const user_id = this.props.user[0].id
      const { reply, togId } = this.state
  
      axios.post(`http://localhost:7001/api/profile/share/${togId}/reply`, {
        user_id,
        body: reply,
        createdAt: new Date().toISOString().slice(0,10),
        shares_id: togId
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

    toggle = (id) => {
      const { isOpen } = this.state
      this.setState({
        isOpen: !isOpen,
        togId: id
      })
    }

    handleClick = (id) => {
      this.props.history.push(`/allprofiles/${id}`)
    }
        
   

    render() {
      const { body, feed, message, results, isOpen, togId, reply } = this.state
      
      return (
        <div className="feedform">
          <div className="background-form">
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
            <Button className="post">Post</Button>
          </Form>
          </div>
          <div style={{display: 'inline-flex',  justifyContent:'center', alignItems:'center', width: "80%"}} id="underline"></div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-3">
                <Search onSearch={this.fetchSearchResults}/>
              </div>
              <div class="col-9">
                {message ? (
                  <h5>There are no results with your search</h5>
                ) : (
                  results.map((result, index) => {
                    return (
                      <Card key={index}>
                        <CardBody>
                          <CardImg className="pic" top width="15%" src={result.image} alt="profile pic" />
                          <CardTitle className="userdetails">{result.user_name} on {moment(result.createdAt).format("MMM Do YYYY")}</CardTitle>
                          <CardText style={{width:"80%"}} className="userpost">{result.body}</CardText>
                        </CardBody>
                      </Card>

                    )
                  })
                )}
              </div>
              <div class="col-8">
                <div className="login">Your Feed</div>
                  <ul>
                    {feed.map((feeds, index) => {
                      return (
                        <Card className='thoughts' key={index}>
                          <CardBody>
                            <CardImg className="pic" top width="15%" src={feeds.image} alt="profile pic" />
                            <CardTitle onClick={() => this.handleClick(feeds.followedId)} className="userdetails">{feeds.user_name} on {moment(feeds.createdAt).format("MMM Do YYYY")}</CardTitle>
                            <CardText style={{width:"80%"}} className="userpost">{feeds.body}</CardText>
                            <CardImg clasName="messagepic" top width= "100%" src={feeds.pictures} />
                          </CardBody>
                          <Button onClick={() => this.toggle(feeds.id)}>Reply</Button>
                        </Card>
                      )
                    })}
                  </ul>
                  <Modal isOpen={isOpen} toggle={this.toggle}>
                    <ModalBody>
                      <Form onSubmit={this.handleReplies}>
                        <FormGroup>
                          <Input
                            value={reply}
                            onChange={this.handleChange}
                            name="reply"
                          />
                          <Button>Send</Button>
                        </FormGroup>
                      </Form>
                    </ModalBody>
                  </Modal>
              </div>
              <div className="col-2">
                <div className="suggestions">
                  <Suggestions />
                </div>
              </div>
            </div>
          </div>
        </div> 
      )
    }
}

export default Withuser(Feed)
