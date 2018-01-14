import React from 'react';
import { get, find, reject } from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import { CategoryService } from '../../services';
import { CategoryModel } from '../../model';
import './forum-nav.scss';

interface Props extends RouteComponentProps<any> {
  categoryId: number;
}

interface State {
  categoryList: CategoryModel[];
  selectedCategory?: CategoryModel;
}

export class ForumNav extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      categoryList: [],
    };
  }

  async componentDidMount() {
    const categoryList = await CategoryService.getCategories();
    this.setState({ categoryList });
    this.setSelectedCategory(categoryList, this.props.categoryId!);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.categoryId !== nextProps.categoryId) {
      this.setSelectedCategory(this.state.categoryList, nextProps.categoryId!);
    }
  }

  setSelectedCategory(categoryList: CategoryModel[], categoryId: number) {
    const selectedCategory = find(categoryList, { id: categoryId });
    this.setState({ selectedCategory });
  }

  getImageSrc(): string {
    if (this.state.selectedCategory!.category === 'realm') {
      return topicIcons['Realm Forums'];
    }

    return topicIcons[this.state.selectedCategory!.title];
  }

  renderDropDown() {
    let categories: any = reject(this.state.categoryList, { category: 'realm' });
    categories = [{ id: -1, title: 'Realm Forums' }, ...categories];
    return categories.map((val: any, index: number) => {
      return <option key={index} value={val.id}>{val.title}</option>;
    });
  }

  getSelectedCategoryId(): number {
    const { selectedCategory } = this.state;
    if (!selectedCategory) {
      return 0;
    }

    if (selectedCategory.category === 'realm') {
      return -1;
    }

    return selectedCategory.id;
  }

  onSelect(event: any) {
    const route = event.target.value === '-1' ? '/realms' : `/f/${event.target.value}`;
    this.props.history.push(route);
  }

  render() {
    const { selectedCategory } = this.state;
    const imageSrc = selectedCategory ? this.getImageSrc() : undefined;

    return (
      <div className="flex">
        <img src={imageSrc} />
        <div className="forum-nav">
          <div className="forum-nav__title">
            <b>{get(selectedCategory, 'title')}</b>
          </div>
          <div className="flex flex--center">
            <small>Forum Nav:</small>
            <select style={{ minWidth: '194px', height: '19px' }}
              value={this.getSelectedCategoryId()}
              onChange={event => this.onSelect(event)}>
              {this.state.categoryList && this.renderDropDown()}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

const topicIcons: {[key: string]: string} = {
  ['Bug Report Forum']: require('../../assets/wow-base-bugs.gif'),
  ['Druid']: require('../../assets/wow-base-druid.gif'),
  ['Raid and Dungeon Discussion']: require('../../assets/wow-base-dungeons.gif'),
  ['General Discussion']: require('../../assets/wow-base-general.gif'),
  ['Hunter']: require('../../assets/wow-base-hunter.gif'),
  ['Mage']: require('../../assets/wow-base-mage.gif'),
  ['Off-topic']: require('../../assets/wow-base-offtopic.gif'),
  ['Paladin']: require('../../assets/wow-base-paladin.gif'),
  ['Priest']: require('../../assets/wow-base-priest.gif'),
  ['Professions']: require('../../assets/wow-base-professions.gif'),
  ['PvP Discussion']: require('../../assets/wow-base-pvp.gif'),
  ['Quest Discussion']: require('../../assets/wow-base-quests.gif'),
  ['Realm Forums']: require('../../assets/wow-base-realms.gif'),
  ['Rogue']: require('../../assets/wow-base-rogue.gif'),
  ['Shaman']: require('../../assets/wow-base-shaman.gif'),
  ['Suggestions']: require('../../assets/wow-base-suggestions.gif'),
  ['Site Suggestions']: require('../../assets/wow-base-support.gif'),
  ['UI & Macros Forum']: require('../../assets/wow-base-uicustomizations.gif'),
  ['Warlock']: require('../../assets/wow-base-warlock.gif'),
  ['Warrior']: require('../../assets/wow-base-warrior.gif'),
  ['Guild Recruitment']: require('../../assets/wow-base-guild.gif'),
  ['Role-Playing']: require('../../assets/wow-base-roleplaying.gif'),
};
