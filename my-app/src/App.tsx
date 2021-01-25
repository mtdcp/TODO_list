import React from 'react';
import './App.css';
import ListPosts from "./components/ListPosts";
import FormCreatePost from "./components/FormCreatePost";
import FormEditPost from "./components/FormEditPost";
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

class App extends React.Component<RouteComponentProps<any>> {
  render() {
    return (
      <Switch>
         <Route path={'/'} exact component={ListPosts} />  
         <Route path={'/createPost'} component={FormCreatePost} />
         <Route path={'/editPost/:id'} component={FormEditPost} />
      </Switch>
    );
  }
}

export default withRouter(App);
