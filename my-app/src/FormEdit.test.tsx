import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import EditForm from './components/FormEditPost';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import ListPosts from './components/ListPosts';

afterEach(cleanup);

test('all fields exist"', () => {
  const { getByText } = render(<EditForm match={{params: {id: 1}, isExact: false, path: "/editPost/:id", url: "/postEdit/1"}}/>);
  const priority_text = getByText('Priority');
  expect(priority_text).toBeInTheDocument();

  const title_text = getByText('Title');
  expect(title_text).toBeInTheDocument();

  const message_text = getByText('Message');
  expect(message_text).toBeInTheDocument();
});

test('fields are pre-filled with data"', () => {

  const { getByDisplayValue } = render(<EditForm match={{params: {id: 1}, isExact: false, path: "/editPost/:id", url: "/postEdit/1"}}/>);

  const title_text = getByDisplayValue('json-server');
  expect(title_text).toBeInTheDocument();
  
  const message_text = getByDisplayValue('teste');
  expect(message_text).toBeInTheDocument();

});

test('validation errors', () => {
  const { getByDisplayValue, getByTestId } = render(<EditForm match={{params: {id: 1}, isExact: false, path: "/editPost/:id", url: "/postEdit/1"}}/>);

  const title_text = getByDisplayValue('json-server');
  expect(title_text).toBeInTheDocument();
  
  const message_text = getByDisplayValue('teste');
  expect(message_text).toBeInTheDocument();

  expect(getByTestId("titleError").innerHTML).not.toBe('Field Required');
  expect(getByTestId("messageError").innerHTML).not.toBe('Field Required');

  fireEvent.change(getByDisplayValue('json-server'), { target: { value: '' }});
  fireEvent.change(getByDisplayValue('teste'), { target: { value: '' }});

  expect(getByTestId("titleError").innerHTML).toBe('Field Required');
  expect(getByTestId("messageError").innerHTML).toBe('Field Required');

});

test('submits the correct data', () => {
  const { getByDisplayValue, getByTestId } = render(<EditForm match={{params: {id: 1}, isExact: false, path: "/editPost/:id", url: "/postEdit/1"}}/>);

  const title_text = getByDisplayValue('json-server');
  expect(title_text).toBeInTheDocument();
  
  const message_text = getByDisplayValue('teste');
  expect(message_text).toBeInTheDocument();

  fireEvent.change(getByDisplayValue('json-server'), { target: { value: 'laravel' }});

  const spy = jest.spyOn(ListPosts.prototype, 'componentWillMount');
  const renderedComponent = render(<ListPosts />);
  const mockData = [{ id: 1, title:'json-server', author:'typecode ', priority: 'high', date:'Mon, 24 Aug 2020', message: 'teste'}, 
  { title:'react', author:'VOID ', priority: 'medium', date:'Mon, 24 Aug 2020', message: 'testing', id: 2 }];

  const mock = new MockAdapter(axios);
       mock
        .onGet("http://localhost:3004/posts")
        .reply(200, mockData);

  jest.fn().mockReturnValueOnce(() => mockData);

  expect(spy).toHaveBeenCalled();
  spy.mockClear();

  expect(renderedComponent.findAllByText("laravel"));
});