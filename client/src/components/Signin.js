import React from "react"
import axios from "axios"
import { Button, Form, Input, FormGroup } from "reactstrap"

class Signin extends React.Component {
    state = {
        user_name: "",
        password: "",
        password2: "",
        email: ""
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
            alert("Passwords do not match, please enter again your password")
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
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    

    render() {
        const { user_name, email, password, password2, loggedIn } = this.state
        
        return (
            <div className="singin">
                <Form className ="singin-form" onSubmit={this.handleSubmit}>
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
                    <Button className="button-login">
                        Sign in
                    </Button>
                </Form>
            </div>
        )
    }
    

}

export default Signin;