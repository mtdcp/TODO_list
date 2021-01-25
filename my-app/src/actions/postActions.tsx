export const ADD_POST = 'ADD_POST';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';
export const LOAD_INITIAL_DATA = 'LOAD_INITIAL_DATA';

export const loadInitialData = (posts:[]) => ({
  type: 'LOAD_INITIAL_DATA',
  payload: posts
})

export const addPost = (post:{}) => ({
  type: 'ADD_POST',
  payload: post,
})

export const editPost = (title:string, author:string, priority:string, date:string, message:string, id:number) => ({
  type: 'EDIT_POST',
  payload: { title, author, priority, date, message, id },
})

export const deletePost = (id:number) => ({
  type: 'DELETE_POST',
  payload: id
})

