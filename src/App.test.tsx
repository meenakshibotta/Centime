import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { State } from './store/state';

import store from './store/store';

describe("App", () => {
  function renderComponent(state: State) {
    return [
      render(
        <Provider store={store}>
          <App />
        </Provider>
      ),
      store
    ]

  }
  afterAll(cleanup)
  test('renders learn react link', () => {
    renderComponent({});
    expect(screen).toMatchSnapshot();
  });

});
