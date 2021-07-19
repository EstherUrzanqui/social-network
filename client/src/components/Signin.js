import React from "react"
import axios from "axios"
import { Button, Form, Input, FormGroup, Alert } from "reactstrap"
import "../css/Signin.css"


class Signin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user_name: "",
            password: "",
            password2: "",
            email: "",
            error: false
        }
    }

    handleChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const { user_name, password, password2, email } = this.state
        if(password !== password2) {
            this.setState({ error: true })
        } else {
            axios("http://localhost:7001/api/register", {
                method: "POST",
                data: {
                    user_name,
                    password,
                    password2,
                    email,
                    loggedIn: false
                }
            })
            .then(response => {
                this.setState(state => ({
                    loggedIn: !state.loggedIn
                }))
                this.feedRedirect()
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    feedRedirect = () => {
        this.props.history.push("/")
    }
    

    render() {
        const { user_name, email, password, password2, error } = this.state
        
        return (
            <div className="page">
                <div className="errorsignin">
                    {error && (
                        <Alert color="warning">
                            Passwords do not match, please enter again your passwords
                        </Alert>
                    )}
                </div>
                <Form className ="signin-form" onSubmit={this.handleSubmit}>
                <div className="sign-up">Sign up</div>
                    <FormGroup>
                        <Input
                            value={user_name}
                            onChange={this.handleChange}
                            name="user_name"
                            placeholder="Username"
                            type="text"
                            required
                        >
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Input
                            value={email}
                            onChange={this.handleChange}
                            name="email"
                            placeholder="Email"
                            type="text"
                            required
                        >   
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Input
                            value={password}
                            onChange={this.handleChange}
                            name="password"
                            placeholder="Password"
                            type="password"
                            required
                        >   
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Input
                            value={password2}
                            onChange={this.handleChange}
                            name="password2"
                            placeholder="Confirm Password"
                            type="password"
                            required
                        >
                            
                        </Input>
                    </FormGroup>
                    <Button className="submit">
                        Submit
                    </Button>
                </Form>
                
            </div>
        )
    }
    

}

export default Signin;