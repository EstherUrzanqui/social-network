import React from "react"
import { Button, Form, FormGroup, Input } from 'reactstrap'
import "../css/Search.css"

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ""
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

 handleSubmit = e => {
   e.preventDefault()
   const { query }  = this.state
   this.props.onSearch(query)
   this.setState({
     query: ""
   })
 }

  render () {
    const { query } = this.state
    
    return (
      <div class="search">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Input 
              id= "searchinput"
              cols="60"
              rows="1"
              value={query}
              onChange={this.handleChange}
              name="query"
              placeholder="Search Unax"
              type="text"
            />
          </FormGroup>
          <Button className="post">Search</Button>
        </Form>
      </div>
    )
  }
}

export default Search;