import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { deletePost } from '../actions/postActions';
import { loadInitialData } from '../actions/postActions';
import store from '..';

export interface IPost {  id: number;  title: string; author: string; message: string; priority: string; date: string }

export interface IState {
    posts: IPost[];  
}

class ListPosts extends Component<RouteComponentProps<{}>, IState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            posts: []
        }
        this.formRenders = this.formRenders.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }
   
  async componentWillMount() {
    axios.get('http://localhost:3004/posts').then(data => {
      this.setState({ posts: data.data })
      store.dispatch(loadInitialData(data.data));
    })

  }

  formRenders() {
    this.props.history.push('/createPost');
  }

  editFormRenders(id:number) {
    this.props.history.push('/editPost/' + id);
  }

  deletePost(id: number) {
    axios.delete('http://localhost:3004/posts/' + id).then(data => {
        const index = this.state.posts.findIndex(post => post.id === id);
        this.state.posts.splice(index, 1);

        store.dispatch(deletePost(id));
        this.props.history.push('/');
    })
}

  render() {
    const posts = this.state.posts;
      return (
        <div>
            <h1 className="text">Posts <button className="btn" onClick={this.formRenders}>+</button></h1>
            {posts.map((post, index) => {
                return(
                    <div key={index}>
                        <table className="tableLayout">
                            <thead className="cell">
                                <tr>
                                    <th>
                                        <h3 className="data"><button className={post.priority === 'high' ? 'background-red' : post.priority === 'medium' ? 'background-yellow' : 'background-green'}></button>   {post.title}
                                        <button className="btn-edit" data-testid="btn-edit" onClick={() => this.editFormRenders(post.id)}>Edit</button> 
                                        <button className="btn-delete" onClick={() => this.deletePost(post.id)}>Delete</button> 
                                        <div className="date">{post.date}</div> <br></br>
                                        <p className="message">{post.message}</p> </h3>
                                    </th>
                                </tr>
                            </thead>
                        </table><br></br>
                    </div>
             )}) }
            </div>
      );
  }
}

export default ListPosts;
