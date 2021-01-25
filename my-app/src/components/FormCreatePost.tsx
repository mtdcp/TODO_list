import React, { Component } from 'react';
import axios from 'axios';
import { addPost } from '../actions/postActions';
import store from '../index';
import { createBrowserHistory } from 'history';
import { reduxForm, InjectedFormProps, reset} from 'redux-form';

const history = createBrowserHistory();

export interface IValuesPost {
    title: string;
    message: string;
    priority: string;
    date: string;
}

export interface IFormState {
    [key: string]: any;
    values: IValuesPost[];
    submitSuccess: boolean;
    errorTitle: boolean;
    errorPriority: boolean;
    errorMessage: boolean;
    id: number
}


export class FormCreate extends Component<InjectedFormProps<{}>, IFormState> {
    constructor(props: InjectedFormProps) {
        super(props);
        this.state = {
            id: 2,
            title: '',
            author: 'VOID',
            message: '',
            priority: '',
            date: new Date().toUTCString().slice(0, 16),
            values: [],
            submitSuccess: false,
            errorTitle: true,
            errorPriority: true,
            errorMessage: true
        }

        this.formSubmission = this.formSubmission.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangePriority = this.handleChangePriority.bind(this);
    }

    componentWillMount() {
        reset('create-form');
    }

    formSubmission = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if(!this.state.errorTitle && !this.state.errorMessage && !this.state.errorPriority) {
            const storeData = {
                title: this.state.title,
                author: this.state.author,
                priority: this.state.priority,
                date: this.state.date,
                message: this.state.message,
                id: store.getState().posts[store.getState().posts.length-1].id+1
            };

            const formData = {
                title: this.state.title,
                author: this.state.author,
                priority: this.state.priority,
                date: this.state.date,
                message: this.state.message,
            };

            store.dispatch(addPost(storeData));
            this.setState({ id: this.state.id+1 });
            
            this.setState({ submitSuccess: true, values: [...this.state.values, formData] });
            axios.post('http://localhost:3004/posts', formData).then(data => [
                setTimeout(() => {
                    history.goBack();
                }, 1000)
            ]);
        } 
    }

    handleChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        if(e.currentTarget.value === '') {
            if(e.currentTarget.name === 'title') {
                this.setState({
                    errorTitle: true
                })
            } else {
                this.setState({
                    errorMessage: true
                })
            }
        } else {
            if(e.currentTarget.name === 'title') {
                this.setState({
                    [e.currentTarget.name]: e.currentTarget.value.trim(),
                    errorTitle: false
                })
            } else {
                this.setState({
                    [e.currentTarget.name]: e.currentTarget.value.trim(),
                    errorMessage: false
                })
            }
        }
    }

    handleChangePriority = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault();
        if(event.currentTarget.value === '') {
            this.setState({ 
                errorPriority:true 
            });
        } else {
            this.setState({ 
                priority: event.currentTarget.value, errorPriority:false 
            });
        }
    }

    render() {
        const { submitSuccess, errorTitle, errorMessage, errorPriority } = this.state;
        return (
            <div>
                <div>
                    <h2 className="title-create"> Create Post </h2>
                    <form id={"create-post-form"} onSubmit={this.formSubmission} name="form-create">
                        <div className="select-box">
                            <label htmlFor="priority"> Priority </label><br></br>
                            <select id="priority" name="priority" data-testid="priority" className="form-control" onChange={(e) => this.handleChangePriority(e)} defaultValue=""  >
                                <option value="" disabled hidden>choose one...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            {errorPriority ? (
                                <div data-testid="priorityError" className="error-info" >Field Required
                                </div>
                            ) : <div data-testid="priorityError"></div>}
                        </div><br></br>
                        <div className="form-title">
                            <label htmlFor="title"> Title </label><br></br>
                            <input type="text" id="title" data-testid="title" onChange={(e) => this.handleChangeInput(e)} name="title" className="form-control" alt="title"/>
                            {errorTitle ? (
                                <div data-testid="titleError" id="titleError" className="error-info" >Field Required
                                </div>
                            ) : <div data-testid="titleError"></div>}
                        </div><br></br>
                        <div className="form-message">
                            <label htmlFor="message"> Message </label><br></br>
                            <input type="text" id="message" data-testid="message" onChange={(e) => this.handleChangeInput(e)} name="message" className="form-control" alt="message"/>
                            {errorMessage ? (
                                <div data-testid="messageError" className="error-info">Field Required
                                </div>
                            ) : <div data-testid="messageError"></div>}
                        </div><br></br><br></br>
                        <div>
                            <button className="btn-submit" data-testid="btn" type="submit">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
                <br></br>
                {submitSuccess && (
                        <div className="alert-info">
                            Post created successfully!
                        </div>
                    )}
            </div>
        )
    }
}

const Form = reduxForm({ form: 'create-form' })(FormCreate)
export default Form;
