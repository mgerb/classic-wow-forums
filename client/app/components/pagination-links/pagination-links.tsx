import React from 'react';
import './pagination-links.scss';

const arrows = {
  right: require('../../assets/arrow-right.gif'),
  left: require('../../assets/arrow-left.gif'),
};

interface Props {
  pageLinks: (number | string)[];
  activePage: number;
  onPageSelect: (page: number) => void;
  showArrows?: boolean;
}

interface State {

}

export class PaginationLinks extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
  }

  onPageSelect(page: number) {
    this.props.onPageSelect(page);
    window.scrollTo(0, 0);
  }

  renderLink(page: number, active: boolean) {
    return active ?
      <b className="page-link">{page}</b> :
      <a className="page-link" onClick={() => this.onPageSelect(page)}>{page}</a>;
  }

  onArrowClick(arrow: 'right' | 'left') {
    const nextPage = this.props.activePage + (arrow === 'right' ? 1 : -1);
    if (this.props.pageLinks.includes(nextPage)) {
      this.onPageSelect(nextPage);
    }
  }

  renderArrow(arrow: 'right' | 'left') {
    if (this.props.showArrows) {
      return <img src={arrows[arrow]} onClick={() => this.onArrowClick(arrow)} className="clickable"/>;
    }
    return null;
  }

  render() {
    const { activePage, pageLinks } = this.props;

    return (
      <span className="pagination-links">
        {this.renderArrow('left')}
        {pageLinks.map((link, index) => {
          const active = link === activePage;
          return (
            <span key={index}>
              {typeof link === 'number' ?
                this.renderLink(link as number, active) :
                <span>.</span>
              }
              {pageLinks.length !== index + 1 && <span>.</span>}
            </span>
          );
        })}
        {this.renderArrow('right')}
      </span>
    );
  }
}
