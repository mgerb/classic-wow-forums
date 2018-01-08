import React from 'react';
import { chain } from 'lodash';
import { Link } from 'react-router-dom';
import axios from '../../axios/axios';
import { ContentContainer } from '../../components';
import './realms.scss';
import header_realmforums from '../../assets/header-realmforums.gif';
import realms_large from '../../assets/realms-large.gif';

interface Props {}

interface State {
  realms: Realm[];
}

interface Realm {
  id: number;
  category: string;
  title: string;
}

export class Realms extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      realms: [],
    };
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/api/category');
      const realms = chain(res.data.data)
        .filter({ category: 'realm' })
        .orderBy(['title'])
        .value();
      this.setState({ realms });
    } catch (e) {
      console.error(e);
    }
  }

  private renderRealms(realms: Realm[]): any {
    return realms.map((realm) => {
      return (
        <li key={realm.id}>
          <Link to={`/f/${realm.id}`}>{realm.title}</Link>
        </li>
      );
    });
  }

  render() {
    const { realms } = this.state;

    // copy list so we don't modify state
    const realmsCopy = realms.slice();
    // split realms into 3 lists
    const list1 = realmsCopy.splice(0, realmsCopy.length / 3);
    const list2 = realmsCopy.splice(0, realmsCopy.length / 2);
    const list3 = realmsCopy;

    return realms.length === 0 ? <div></div> : (
      <ContentContainer>
        <div className="flex flex--center">
          <img src={realms_large}/>
          <img src={header_realmforums}/>
        </div>

        <div style={{ margin: '15px 0' }}>
          <div><b>Welcome to the World of Warcraft Realm Forums!</b></div>
          <div>Use these forums to discuss topics related to World of Warcraft with player on your own Realm.</div>
        </div>

        <div className="flex flex--wrap">
          <ul className="realm-column">
            {this.renderRealms(list1)}
          </ul>

          <ul className="realm-column">
            {this.renderRealms(list2)}
          </ul>

          <ul className="realm-column">
            {this.renderRealms(list3)}
          </ul>
        </div>
      </ContentContainer>
    );
  }
}
