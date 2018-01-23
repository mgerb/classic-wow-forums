import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { initializeAxios } from './axios/axios';
import { Footer, Header } from './components';
import { Forum, Home, Login, NotFound, Oauth, Realms, Thread, UserAccount } from './pages';
import { stores } from './stores/stores';

// styling
import './scss/index.scss';

interface Props {}

interface State {
  ready: boolean;
}

export class Routes extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  async componentDidMount() {
    await initializeAxios();
    this.setState({ ready: true });
  }

  public render() {

    // make sure we initialize axios with request headers before we load the app
    if (!this.state.ready) {
      return <div></div>;
    }

    return (
      <Provider {...stores}>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/realms" component={Realms} />
              <Route exact path="/f/:id/:page?/:threadsPerPage?/:sortBy?/:sortOrder?" component={Forum} />
              <Route exact path="/t/:categoryId/:threadId/:page?" component={Thread} />
              <Route exact path="/oauth" component={Oauth} />
              <Route exact path="/user-account" component={UserAccount} />
              <Route exact path="/login" component={Login} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
