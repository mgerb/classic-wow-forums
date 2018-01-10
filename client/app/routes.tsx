import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { Footer, Header } from './components';
import { Forum, Home, NotFound, Oauth, Realms, UserAccount } from './pages';
import { stores } from './stores/stores';

// styling
import './scss/index.scss';

interface Props {}

interface State {}

export class Routes extends React.Component<Props, State> {

  public render() {
    return (
      <Provider {...stores}>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/realms" component={Realms} />
              <Route exact path="/f/:id" component={Forum} />
              <Route exact path="/oauth" component={Oauth} />
              <Route exact path="/user-account" component={UserAccount} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
