import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ListPosts from './components/ListPosts';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';

afterEach(cleanup);

test('page title exists', () => {
  const { getByText } = render(<ListPosts />);
  const title = getByText(/Posts/i);
  expect(title).toBeInTheDocument();
});

test('gets data and displays it', () => {
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

  expect(renderedComponent.findByDisplayValue("th"));
  expect(renderedComponent.findByDisplayValue("json-server"));
  expect(renderedComponent.findByDisplayValue("teste"));
  expect(renderedComponent.findByDisplayValue("Mon, 24 Aug 2020"));

  expect(renderedComponent.findByDisplayValue("th"));
  expect(renderedComponent.findByDisplayValue("react"));
  expect(renderedComponent.findByDisplayValue("testing"));
  expect(renderedComponent.findByDisplayValue("Mon, 24 Aug 2020"));
});

