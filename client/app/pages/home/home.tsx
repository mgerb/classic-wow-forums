import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { ContentContainer, ScrollToTop } from '../../components';

import './home.scss';

import header_forms from '../../assets/header-forums.gif';
import support from '../../assets/support.gif';
// import serverstatus from '../../assets/serverstatus.gif';
import uicustomizations from '../../assets/uicustomizations.gif';
import bugs from '../../assets/bugs.gif';
import realms from '../../assets/realms.gif';
import offtopic from '../../assets/offtopic.gif';
import suggestions from '../../assets/suggestions.gif';
import guilds from '../../assets/guilds.gif';
import roleplaying from '../../assets/roleplaying.gif';
import general from '../../assets/general.gif';
import dungeons from '../../assets/dungeons.gif';
import bullet from '../../assets/bullet.gif';

// classes
import druid from '../../assets/druid.gif';
import rogue from '../../assets/rogue.gif';
import priest from '../../assets/priest.gif';
import hunter from '../../assets/hunter.gif';
import shaman from '../../assets/shaman.gif';
import warrior from '../../assets/warrior.gif';
import mage from '../../assets/mage.gif';
import paladin from '../../assets/paladin.gif';
import warlock from '../../assets/warlock.gif';

import professions from '../../assets/professions.gif';
import pvp from '../../assets/pvp.gif';
import quests from '../../assets/quests.gif';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  private renderTopic(topicId: number | string, title: string, icon: any, text: string): any {
    return (
      <div className="topic-item">
        <img className="topic-item-icon" src={icon} />
        <div>
          <Link to={typeof topicId === 'number' ? `/f/${topicId}` : topicId}>{title}</Link>
          <div>{text}</div>
        </div>
      </div>
    );
  }

  private renderClass(title: string, topicId: number, icon: any): any {
    return (
      <div className="flex flex--center" style={{ flex: 1 }}>
        <img className="topic-item-icon" src={icon} />
        <Link to={`/f/${topicId}`}>{title}</Link>
      </div>
    );
  }

  private renderClasses(): any {
    return (
      <div className="classes-container">
        <div className="item-row item-row__class">
          {this.renderClass('Druid', 0, druid)}
          {this.renderClass('Rogue', 1, rogue)}
          {this.renderClass('Priest', 2, priest)}
        </div>
        <div className="item-row item-row__class">
          {this.renderClass('Hunter', 3, hunter)}
          {this.renderClass('Shaman', 4, shaman)}
          {this.renderClass('Warrior', 5, warrior)}
        </div>
        <div className="item-row item-row__class">
          {this.renderClass('Mage', 6, mage)}
          {this.renderClass('Paladin', 7, paladin)}
          {this.renderClass('Warlock', 8, warlock)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <ScrollToTop>
        <ContentContainer>
          <img src={header_forms} />
          <div>
            <b>Welcome to the World of Warcraft community forums!</b>
          </div>
          <p>
            Blizzard provides the World of Warcraft community forums for its player to chat, exchange ideas, and submit feedback. Posting on
            the World of Warcraft community forums requires a World of Warcraft account. Only customers are allowed to post on these forums,
            but anyone can read them. Please note that you must adhere to the Forum Guidelines if you wish to post on the forums.
          </p>

          <div className="topic-container">
            <div className="topic-row">
              {this.renderTopic(
                137,
                'Site Suggestions',
                support,
                `Have a suggestion for this site? Please post it here.`,
              )}
              { /* maybe add realm status in the future */
                /* {this.renderTopic(
                '#', 'Realm Status', serverstatus,
                `Collection of important messages regarding the status of the Realms.`)} */}
            </div>
            <div className="topic-row">
              {this.renderTopic(
                138,
                'UI & Macros Forum',
                uicustomizations,
                `Work with other players to create your own special custom interfaces and macros.`,
              )}
              {this.renderTopic(139, 'Bug Report Forum', bugs, `Found a bug on this site? Help us squash it by reporting it here!`)}
            </div>

            <hr className="hr"/>

            <div className="topic-row topic-row__classes">
              <div className="topic-item topic-item__classes">
                <div className="flex" style={{ marginBottom: '10px' }}>
                  <img className="topic-item-icon" src={bullet} />
                  <div>
                    <b>Classes</b>
                    <div>Discuss your favorite class:</div>
                  </div>
                </div>
                {this.renderClasses()}
              </div>

              <div className="topic-item topic-item__classes">
                <div className="item-row" style={{ minWidth: '250px' }}>
                  <img className="topic-item-icon" src={professions} />
                  <div>
                    <Link to="/f/140">Professions</Link>
                    <div>Discuss professions in detail.</div>
                  </div>
                </div>
                <div className="item-row">
                  <img className="topic-item-icon" src={pvp} />
                  <div>
                    <Link to="/f/141">PvP Discussion</Link>
                    <div>Discuss player versus player combat.</div>
                  </div>
                </div>
                <div className="item-row">
                  <img className="topic-item-icon" src={quests} />
                  <div>
                    <Link to="/f/142">Quest Discussion</Link>
                    <div>Talk about and get help with the countless quests in World of Warcraft.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="topic-row">
              {this.renderTopic(
                '/realms',
                'Realm Forums',
                realms,
                `Discuss topics related to World of Warcraft with players on your specific Realm.`,
              )}
              {this.renderTopic(131, 'Off-topic', offtopic, `Off-topic posts of interest to the World of Warcraft community.`)}
            </div>
            <div className="topic-row">
              {this.renderTopic(134, 'Suggestions', suggestions, `Have a suggestion for World of Warcraft? Please post it here.`)}
              {this.renderTopic(132, 'Guild Recruitment', guilds, `Searching for a guild, or do you want to advertise your guild?`)}
            </div>
            <div className="topic-row">
              {this.renderTopic(
                135,
                'Role-Playing',
                roleplaying,
                `Pull up a chair, drink a mug of ale, meet new friends, tell stories, and role-play in this forum.`,
              )}
              {this.renderTopic(133, 'General Discussion.', general, `Discuss World of Warcraft.`)}
            </div>
            <div className="topic-row">
              {this.renderTopic(
                136,
                'Raid and Dungeon Discussion',
                dungeons,
                `Discuss the instance dungeons and end-game raid encounters in World of Warcraft.`,
              )}
            </div>
          </div>

          <hr className="hr"/>
        </ContentContainer>
      </ScrollToTop>
    );
  }
}
