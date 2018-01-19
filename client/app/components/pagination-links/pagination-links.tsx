import React from 'react';

interface Props {
  pageLinks: (number | string)[];
  activePage: number;
  onPageSelect: (page: number) => void;
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

  render() {
    const { activePage, pageLinks } = this.props;

    return (
      <span>
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
      </span>
    );
  }
}
