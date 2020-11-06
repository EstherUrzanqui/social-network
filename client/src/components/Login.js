import React from "react"
import axios from "axios"
import { Button, Form, FormGroup, Input } from 'reactstrap'
import "../css/Login.css"



class Login extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            user_name: "",
            password: "", 
            error: false,
            loggedIn: false,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    login = (event) => {
        event.preventDefault()
        const { user_name, password } = this.state
        axios("http://localhost:7001/api/login", {
            method: "POST",
            data: {
                user_name,
                password
            }
        })
        .then((response) => {
            localStorage.setItem("token", response.data.token)
            this.setState({ loggedIn: true })
            this.feedRedirect()
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
        this.setState({
            user_name: "",
            password: "",
            error: false,
        })
    }
    //redirect to feed when logged in
    feedRedirect = () => {
        this.props.history.push("/feed")
    }

    render() {
        const { user_name, password } = this.state
        return (
            <div className="login">
                <Form className="login-container" onSubmit={this.login}>
                    <FormGroup className="group">
                        <Input
                            value={this.state.user_name}
                            onChange={this.handleChange}
                            name="user_name"
                            type="text"
                            className="form-control mb-2"
                            placeholder="Username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            value={this.state.password}
                            onChange={this.handleChange}
                            name="password"
                            type="password"
                            className="form-control mb-2"
                            placeholder="Password"
                        />
                    </FormGroup>
                    <Button className="button-login" disabled={!user_name || !password}>
                        Log in
                    </Button>
                </Form>
                
            </div>
        )
    }
}
export default Login;