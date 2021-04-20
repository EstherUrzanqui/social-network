import React from "react"
import axios from "axios"
import "../css/Feed.css"
import { Button, Form, FormGroup, Input, Card, CardBody, CardTitle, CardText, CardImg, UncontrolledCollapse, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Withuser from "./Withuser"
import moment from "moment"
import Search from "./Search";
import Suggestions from "./Suggestions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as farHeart, faComment } from "@fortawesome/free-regular-svg-icons"




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
        togId: null,
        likes: [],
        likesId: []
      }
    }
        

    componentDidMount = () => {
      this.getFeed()
      this.getComments()
      this.getLikes()
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

    getComments = () => {
      axios(`http://localhost:7001/api/profile/share/comments`)
        .then(response => {
          this.setState({ comments: response.data})
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
      this.getCountReplies()
    }

    getCountReplies = () => {
      const { togId } = this.state
      axios(`http://localhost:7001/api/profile/share/count/${togId}`)
      .then(response => {
        this.setState({ count: Object.values(response.data[0])})
        console.log(response.data)
        
      })
      .catch(error => {
        this.setState({ error: true })
      })
    }

    getLikes = async () => {
      
      try {
        const response = await axios(`http://localhost:7001/api/profile/share/likes`)

        const tempLikes = response.data.map((liked, index) => {
          return liked.shares_id
        })
        this.setState({
          likes: response.data,
          likesId: tempLikes
        })
      } catch(error) {
        this.setState({ error: true })
      }
    }
    
    handleLikes = (id) => {
      const userId = this.props.user[0].id
      
      axios.post(`http://localhost:7001/api/profile/share/${id}/likes`, {
        user_id: userId
      })
      .then(response => {
        console.log(response.data)
        
      })
      .catch(error => {
        this.setState({ error: true })
      })
    }

    handleUnlikes = async (id) => {
      const userId = this.props.user[0].id

      try {
        const response = await axios.delete(
          `http://localhost:7001/api/profile/share/${id}/${userId}/unlike`
        );
        console.log(response);
        let array = [...this.state.likes];
        let index = array.indexOf(userId);
        if(index !== -1) {
          array.splice(index, 1);

          const tempLiked = array.map((click, index) => {
            return click.userId;
          })

          this.setState({
            likes: array,
            clickedId: tempLiked
          })
        }
      } catch (error) {
        this.setState({ error: true })
      }
      
    }

    onLiked = (id) => {
      this.handleLikes(id)
      window.location.reload()
    }

    onUnliked = (id) => {
      this.handleUnlikes(id)
      window.location.reload()
    }

    

    handleClick = (id) => {
      this.props.history.push(`/allprofiles/${id}`)
    }

    render() {
      const { body, feed, message, results, isOpen, reply, comments, likesId, likes } = this.state
      const userLiked = likes.filter(e => e.user_id === this.props.user[0].id).map(ele => ele.shares_id)
      
      return (
        <div className="feedform">
          <div className="feed-container">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input 
                id= "textarea"
                cols="60"
                rows="4"
                value={body}
                onChange={this.handleChange}
                name="body"
                placeholder="Express Yourself"
                type="textarea"
              />
            </FormGroup>
            <Button className="post-share">Post</Button>
          </Form>
          </div>
          
          <div class="container-fluid">
            <div class="row justify-content-start">
              <div class="col-3">
                <Search onSearch={this.fetchSearchResults}/>
              </div>
              <div>
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
              <div class="col-7">
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
                          <div className="socialbar">
                            <div className="likes">
                              {userLiked.includes(feeds.id) ? <FontAwesomeIcon icon={faHeart}  onClick={() => this.onUnliked(feeds.id)} />   : 
                                <FontAwesomeIcon icon={farHeart} onClick={() => this.onLiked(feeds.id)} />   
                              }
                            </div>
                            <div className="likescount">
                              {likesId.filter(x => x === feeds.id).length}
                            </div>
                            <div className="comments">
                              <FontAwesomeIcon icon={faComment} onClick={() => this.toggle(feeds.id)} />
                            </div>
                            <div className="commentscount">
                              <p id="toggler" style={{ marginBottom: '1rem'}} onClick={() => this.getComments()}>
                                {comments.filter(x => x.shares_id === feeds.id).length}
                              </p>
                            </div>
                          </div>
                          <UncontrolledCollapse toggler="#toggler">
                            {comments.map((comment, index) => {
                              if(comment.shares_id === feeds.id) {
                              return (
                                <CardBody key={index}>
                                  <CardImg className="pic" top width="15%" src={comment.image} />
                                  <CardTitle clasName="userdetails">{comment.user_name} on {moment(comment.createdAt).format("MMM Do YYYY")}</CardTitle>
                                  <CardText style={{width:"80%"}}>{comment.body}</CardText>
                                </CardBody>
                              )}})}
                          </UncontrolledCollapse>
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
