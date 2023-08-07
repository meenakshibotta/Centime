import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { State } from './store/state';

import store from './store/store';
import Inflow_outflow from './add-inflow-ouflow';

describe("App", () => {
  function renderComponent(state: State) {
    return [
      render(
        <Provider store={store}>
          <Inflow_outflow />
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
