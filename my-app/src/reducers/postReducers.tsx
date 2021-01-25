import { ADD_POST } from '../actions/postActions';
import { EDIT_POST } from '../actions/postActions';
import { DELETE_POST } from '../actions/postActions';
import { LOAD_INITIAL_DATA } from '../actions/postActions';
export const initialState = {
  posts: [{ title:'json-server', author:'typecode ', priority: 'high', date:'Mon, 24 Aug 2020', message: 'teste', id: 1 }]
};

function rootReducer(state = initialState, action: any) {
  if (action.type === LOAD_INITIAL_DATA) {
    return Object.assign({}, state, {
      posts: action.payload,
    });
  }
  if (action.type === ADD_POST) {
    return Object.assign({}, state, {
      posts: state.posts.concat(action.payload)
    });
  } 
  if (action.type === EDIT_POST) {
    const { id  } = action.payload;
    return {
      ...state,
      posts: state.posts.map(post => post.id === id ?
          { ...post, title: action.payload.title, author: action.payload.author, priority: action.payload.priority, 
          date: action.payload.date, message: action.payload.message } : post
      ) 
  };
  }
  if (action.type === DELETE_POST) {
    return Object.assign({}, state, {
      posts: state.posts.filter(post => post.id !== action.payload),
    });
  } 
  return state;
};

export default rootReducer;