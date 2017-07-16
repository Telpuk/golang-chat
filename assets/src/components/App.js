import React, {Component} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {AddsMessageIntoTotalChat, AddsUserIntoTotalChat} from "../actions/socket";
import {connect} from "react-redux";

class App extends Component {

    state = {
        nameUser: '',
        message: ''
    };

    constructor() {
        super();
        this.onClickAddButton = this.onClickAddButton.bind(this);
        this.onClickMessageButton = this.onClickMessageButton.bind(this);

    }

    onClickAddButton() {
        if (this.state.nameUser) {
            AddsUserIntoTotalChat({
                name: this.state.nameUser
            })
        }
    }

    onClickMessageButton() {
        if (this.state.message) {
            this.props.dispatch(AddsMessageIntoTotalChat(this.state.message));
            this.setState({
                message: ''
            })
        }
    }


    render() {
        const {users, messages, socket} = this.props;
        console.log(messages);
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-4 alert-danger">
                        <div className="row">
                            <div className="col-12">Users</div>
                            <ul className="col-12">
                                {
                                    Object.keys(users).map((key) => {
                                        return <li key={key}><strong>{users[key].name}</strong></li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-8 alert-success">
                        <div className="row">
                            <div className="col-12" style={{height: '400px'}}>
                                <ul className="col-12">
                                    {
                                        messages.map((message,index) => {
                                            return <li key={index}>
                                                <div><strong>{users[message.id].name}</strong></div>
                                                <div>{message.text}</div>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="col-8">
                                <Input type="text" disabled={!users[socket.id]} name="messages"
                                       onChange={ele => this.setState({
                                           message: ele.target.value
                                       })} value={this.state.message} placeholder="Your message"/>
                            </div>
                            <div className="col-4">
                                <Button disabled={!users[socket.id]}
                                        type="button"
                                        onClick={this.onClickMessageButton}>Send</Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 alert-info">
                        <Form>
                            <FormGroup>
                                <div className="row">
                                    <div className="col-12">
                                        <Label for="exampleEmail">Add yourself into the chat</Label>
                                    </div>
                                    <div className="col-8">
                                        <Input type="text" name="nameUser"
                                               onChange={ele => this.setState({
                                                   nameUser: ele.target.value
                                               })} value={this.state.nameUser} placeholder="Your name"/>
                                    </div>
                                    <div className="col-4">
                                        <Button type="button"
                                                onClick={this.onClickAddButton}>
                                            {users[socket.id] ? 'Change' : 'Add'}
                                        </Button>
                                    </div>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
        messages: state.messages,
        socket: state.socket
    }
}

export default connect(mapStateToProps)(App);
