import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardBody, CardTitle, CardText, CardImg, UncontrolledCollapse } from 'reactstrap'
import Withuser from "./Withuser"
import moment from "moment"
import Search from "./Search";
import Suggestions from "./Suggestions"



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
        comments: []
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

    handleReplies = (id) => {
      const user_id = this.props.user[0].id
      const { reply } = this.state
  
      axios.post(`http://localhost:7001/api/profile/share/${id}/reply`, {
        user_id,
        body: reply,
        createdAt: new Date().toISOString().slice(0,10),
        shares_id: id
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

    getComments = (id) => {
      axios(`http://localhost:7001/api/profile/share/${id}/comments`)
        .then(response => {
          this.setState({ comments: response.data})
          console.log(response.data)
          console.log(id)
        })
        .catch(error => {
          this.setState({ error: true })
        })
    }

    handleClick = (id) => {
      this.props.history.push(`/allprofiles/${id}`)
    }
        
   

    render() {
      const { body, feed, message, results, reply, comments } = this.state
      
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
                          <Form onSubmit={() => this.handleReplies(feeds.id)}>
                            <FormGroup>
                              <Input
                                value={reply}
                                onChange={this.handleChange}
                                name="reply"
                              />
                            </FormGroup>
                            <Button>Reply</Button>
                          </Form>
                          <Button id="toggler" style={{ marginBottom: '1rem'}} onClick={() => this.getComments(feeds.id)}>Comments</Button>
                          <UncontrolledCollapse toggler="#toggler">
                            {comments.map((comment, index) => {
                              return (
                              <CardBody key={index}>
                                <CardImg className="pic" top width="15%" src={comment.image} />
                                <CardTitle clasName="userdetails">{comment.user_name} on {moment(comment.createdAt).format("MMM Do YYYY")}</CardTitle>
                                <CardText style={{width:"80%"}}>{comment.body}</CardText>
                              </CardBody>
                            )})}
                          </UncontrolledCollapse>
                        </Card>
                      )
                    })}
                  </ul>
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
