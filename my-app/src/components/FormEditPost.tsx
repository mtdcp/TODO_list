import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import store from '../index';
import { editPost } from '../actions/postActions';

export interface IValues {
    [key: string]: any;
    date: string;
}

export interface IFormState {
    id: number,
    post: any;
    values: IValues[];
    submitSuccess: boolean;
    errorTitle: boolean;
    errorMessage: boolean;
}

class FormEditPost extends React.Component<RouteComponentProps<any>, IFormState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            post: {},
            values: [],
            submitSuccess: false,
            errorTitle: false,
            errorMessage: false
        }

        this.formSubmission = this.formSubmission.bind(this);
        this.setValues = this.setValues.bind(this);
        this.handleAnyInputChanges = this.handleAnyInputChanges.bind(this);
        this.handleChangePriority = this.handleChangePriority.bind(this);

    }

    componentWillMount() {
        store.getState().posts.map(loadedPost => {
            if(loadedPost.id == this.state.id) {
                this.setState({ post: loadedPost });
            }
        })
    }

    formSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if(!this.state.errorTitle && !this.state.errorMessage) {
            axios.patch('http://localhost:3004/posts/' + this.state.id, this.state.values).then(data => {

            const editedPost = data.data;   
            store.getState().posts.map(post => {
                if(post.id == data.data.id) {
                    store.dispatch(editPost(editedPost.title, editedPost.author, editedPost.priority, editedPost.date, editedPost.message, editedPost.id));
                }
            })

            this.setState({ submitSuccess: true })
                setTimeout(() => {
                    this.props.history.push('/');
                }, 1000)
            })
        }
    }

    setValues = (values: IValues) => {
        this.setState({ values: { ...this.state.values, ...values } });
    }

    handleAnyInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        if(e.currentTarget.name === 'title') {
            if(e.currentTarget.value === '') {
                this.setState({  errorTitle: true })
            } else {
                this.setState({  errorTitle: false })
                this.setValues({ date: new Date().toUTCString().slice(0, 16), [e.currentTarget.id]: e.currentTarget.value.trim() })
            }
        } else {
            if(e.currentTarget.value === '') {
                this.setState({  errorMessage: true })
            } else {
                this.setState({  errorMessage: false })
                this.setValues({ date: new Date().toUTCString().slice(0, 16), [e.currentTarget.id]: e.currentTarget.value.trim() })
            }
        }
    }

    handleChangePriority = (event: React.FormEvent<HTMLSelectElement>) => {
        event.preventDefault();
        this.setValues({ date: new Date().toUTCString().slice(0, 16), [event.currentTarget.id]: event.currentTarget.value });
    }

    render() {
        const { submitSuccess, errorTitle, errorMessage } = this.state;
        return (
            <div >
                {this.state.post &&
                    <div>
                        <div>
                            <div>
                                <h2 className="title-create"> Edit Post with title '{this.state.post.title}'</h2>
                                <form id={"create-post-form"} onSubmit={this.formSubmission} name="form-edit">
                                    <div className="form-group">
                                        <label htmlFor="priority"> Priority </label><br></br>
                                        <select id="priority" name="priority" className="form-control" defaultValue={this.state.post.priority} onChange={(e) => this.handleChangePriority(e)} >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div><br></br>
                                    <div className="form-group">
                                        <label htmlFor="title"> Title </label><br></br>
                                        <input type="text" id="title" defaultValue={this.state.post.title} onChange={(e) => this.handleAnyInputChanges(e)} name="title" className="form-control" />
                                        {errorTitle ? (
                                            <div data-testid="titleError" className="error-info">Field Required
                                            </div>
                                        ): <div data-testid="titleError"></div>}
                                    </div><br></br>
                                    <div className="form-group">
                                        <label htmlFor="message"> Message </label><br></br>
                                        <input type="text" id="message" defaultValue={this.state.post.message} onChange={(e) => this.handleAnyInputChanges(e)} name="message" className="form-control" />
                                        {errorMessage ? (
                                            <div data-testid="messageError" className="error-info">Field Required
                                            </div>
                                        ) : <div data-testid="messageError"></div>}
                                    </div>
                                    <div ><br></br><br></br>
                                        <button className="btn-submit" type="submit"> Save </button>
                                    </div>
                                </form>
                            </div>
                        </div><br></br>
                        {submitSuccess && (
                                    <div className="alert-info">
                                       Post edited successfully </div>
                                    )}
                    </div>
                }
            </div>
            )
        }
    }

export default FormEditPost;