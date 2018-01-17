import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentContainer } from '../../components';
import { UserService } from '../../services';

interface Props extends RouteComponentProps<any> {}

interface State {
  username: string;
  password: string;
  errorMessage?: string;
}

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  private async login(event: any) {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      await UserService.login(username, password);
      window.location.pathname = '/';
    } catch (e) {
      console.error(e);
      this.setState({ errorMessage: 'Invalid login.' });
    }
  }

  render() {
    const { username, password } = this.state;

    return (
      <ContentContainer>
        <form onSubmit={e => this.login(e)}>
          <div className="form-group">
            <label>Username</label>
            <input
              autoFocus
              type="text"
              className="input"
              value={username}
              onChange={event => this.setState({ username: event.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={event => this.setState({ password: event.target.value })} />
          </div>

          <div className="form-group">
            <input className="input__button" type="submit" value="Submit" />
            <span className="red" style={{ marginLeft: '10px' }}>
              {this.state.errorMessage}
            </span>
          </div>
        </form>
      </ContentContainer>
    );
  }
}
