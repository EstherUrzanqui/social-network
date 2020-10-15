import React from "react"
import axios from "axios"

class Login extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            user_name: "test",
            password: "test"
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    login = () => {
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
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    requestData = () => {
        axios("http://localhost:7001/api/profile", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        value={this.state.user_name}
                        onChange={this.handleChange}
                        name="username"
                        type="text"
                        className="form-control mb-2"
                    />
                    <input
                        value={this.state.password}
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        className="form-control mb-2"
                    />
                    <button className="btn btn-primary" onClick={this.login}>
                        Log in
                    </button>
                </div>
                <div className="text-center p-4">
                    <button
                        className=" btn btn-outline-primary"
                        onClick={this.requestData}
                    >
                        Request protected data
                    </button>
                </div>
            </div>
        )
    }
}
export default Login;