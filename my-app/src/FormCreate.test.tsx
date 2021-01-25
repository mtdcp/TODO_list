import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { FormCreate  }from './components/FormCreatePost';
import ListPosts from './components/ListPosts';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';

afterEach(cleanup);

test('all fields exist"', () => {
  const { getByText } = render(<FormCreate />);
  const priority_text = getByText('Priority');
  expect(priority_text).toBeInTheDocument();

  const title_text = getByText('Title');
  expect(title_text).toBeInTheDocument();

  const message_text = getByText('Message');
  expect(message_text).toBeInTheDocument();
});

test('validation errors', () => {
    const { getByTestId } = render(<FormCreate />);

    expect(getByTestId("titleError").innerHTML).toBe('Field Required');
    expect(getByTestId("messageError").innerHTML).toBe('Field Required');
    expect(getByTestId("priorityError").innerHTML).toBe('Field Required');

    fireEvent.change(getByTestId('title'), { target: { value: 'react' }});

    expect(getByTestId("titleError").innerHTML).not.toBe('Field Required');

});

test('submit the correct data', () => {
  const { getByTestId } = render(<FormCreate />);

  fireEvent.select(getByTestId('priority'), { target : { value: 'medium' }})
  fireEvent.change(getByTestId('title'), { target: { value: 'react' }});
  fireEvent.change(getByTestId('message'), { target: { value: 'testing' }});

  fireEvent.click(getByTestId('btn'));

  const spy = jest.spyOn(ListPosts.prototype, 'componentWillMount');
  const renderedComponent = render(<ListPosts />);
  const mockData = [{ title:'json-server', author:'typecode ', priority: 'high', date:'Mon, 24 Aug 2020', message: 'teste',  id: 1 }, 
  { title:'react', author:'VOID ', priority: 'medium', date:'Mon, 24 Aug 2020', message: 'testing', id: 2 }];

  const mock = new MockAdapter(axios);
       mock
        .onGet("http://localhost:3004/posts")
        .reply(200, mockData);

  jest.fn().mockReturnValueOnce(() => mockData);

  expect(spy).toHaveBeenCalled();
  spy.mockClear();

  expect(renderedComponent.findByText("th"));
  expect(renderedComponent.findByText("json-server"));
  expect(renderedComponent.findByText("teste"));
  expect(renderedComponent.findByText("Mon, 24 Aug 2020"));
  
  expect(renderedComponent.findByText("th"));
  expect(renderedComponent.findByText("react"));
  expect(renderedComponent.findByText("testing"));
  expect(renderedComponent.findByText("Mon, 24 Aug 2020"));
});


