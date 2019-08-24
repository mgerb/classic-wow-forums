import React from 'react';
import { chain } from 'lodash';
import { Link, RouteComponentProps } from 'react-router-dom';
import { CategoryService } from '../../services';
import { CategoryModel } from '../../model';
import { ContentContainer, ScrollToTop } from '../../components';
import './realms.scss';
import header_realmforums from '../../assets/header-realmforums.gif';
import realms_large from '../../assets/realms-large.gif';

interface Props extends RouteComponentProps<any> {}

interface State {
  realms: CategoryModel[];
  classicRealms: CategoryModel[];
}

export class Realms extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      realms: [],
      classicRealms: [],
    };
  }

  async componentDidMount() {
    document.title = 'Realms';
    try {
      const res = await CategoryService.getCategories();
      const realms = chain(res)
        .filter({ category: 'realm' })
        .orderBy(['title'])
        .value() as CategoryModel[];
      const classicRealms = chain(res)
        .filter({ category: 'classic_realm' })
        .orderBy(['title'])
        .value() as CategoryModel[];
      this.setState({ realms, classicRealms });
    } catch (e) {
      console.error(e);
    }
  }

  private renderRealms(realms: CategoryModel[]): any {
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

    if (realms.length === 0) {
      return <div></div>;
    }

    // copy list so we don't modify state
    const realmsCopy = realms.slice();
    // split realms into 3 lists
    const list1 = realmsCopy.splice(0, realmsCopy.length / 3);
    const list2 = realmsCopy.splice(0, realmsCopy.length / 2);
    const list3 = realmsCopy;

    return (
      <ScrollToTop>
        <ContentContainer>
          <div className="flex flex--center">
            <img src={realms_large}/>
            <img src={header_realmforums}/>
          </div>

          <div style={{ margin: '15px 0' }}>
            <div><b>Welcome to the Realm Forums!</b></div>
            <div>Use these forums to discuss topics related to World of Warcraft with players on your own Realm.</div>
          </div>

          <h1>Classic Realms</h1>

          <ul className="realm-column">
            {this.renderRealms(this.state.classicRealms)}
          </ul>

          <h1>Legacy Realms</h1>

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
      </ScrollToTop>
    );
  }
}
