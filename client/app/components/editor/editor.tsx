import React from 'react';
import marked from 'marked';
import axios from '../../axios/axios';
import { ContentContainer } from '../content-container/content-container';
import './editor.scss';

interface Props {
  categoryId?: string;
  onClose: (cancel: boolean) => any;
  threadId?: string;
}

interface State {
  title: string;
  content: string;
  contentPreview: string;
  contentCharacterCount: number;
  titleCharacterCount: number;
  errorMessage?: string;
}

export class Editor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: '',
      content: '',
      contentPreview: '',
      contentCharacterCount: 0,
      titleCharacterCount: 0,
    };
  }

  onContentChange(event: any) {
    this.setState({ 
      content: event.target.value,
      contentPreview: marked(event.target.value, { sanitize: true }),
      contentCharacterCount: event.target.value.length,
    });
  }

  onTitleChange(event: any) {
    this.setState({
      title: event.target.value,
      titleCharacterCount: event.target.value.length,
    });
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.props.threadId) {
      this.newReply();
    } else {
      this.newThread();
    }
  }

  async newReply() {
    const { content } = this.state;

    if (content === '') {
      this.setState({ errorMessage: 'Content must not be blank.' });
      return;
    }

    const data = {
      content,
      thread_id: this.props.threadId,
    };

    try {
      await axios.post('/api/reply', data);
      this.props.onClose(false);
    } catch (e) {
      this.setState({ errorMessage: 'Server error. Please try again later.' });
    }
  }

  async newThread() {
    const { title, content } = this.state;

    if (title === '' || content === '') {
      this.setState({ errorMessage: 'One of your inputs is blank.' });
      return;
    }

    const data = {
      content,
      title,
      category_id: this.props.categoryId,
    };

    try {
      await axios.post('/api/thread', data);
      this.props.onClose(false);
    } catch (e) {
      this.setState({ errorMessage: 'Server error. Please try again later.' });
    }
  }

  renderThreadPortion() {
    return (
      <div className="flex flex--column">
        <h2 style={{ color: 'white' }}>New Topic</h2>
        <label>Title</label>
        <input type="text"
          className="input editor__title"
          onChange={event => this.onTitleChange(event)}
          maxLength={300}/>
        <div className="editor__character-count">{this.state.contentCharacterCount}/2000</div>
      </div>
    );
  }

  // TODO: quote
  renderReplyPortion() {
    return (
      <h2 style={{ color: 'white' }}>New Reply</h2>
    );
  }

  render() {

    return (
      <div className="editor-container">
        <form onSubmit={event => this.onSubmit(event)} onReset={() => this.props.onClose(true)}>
          <ContentContainer className="editor">
            {this.props.threadId ? this.renderReplyPortion() : this.renderThreadPortion()}
            <label>Content</label>
            <textarea className="input editor__text-area flex-1" onChange={event => this.onContentChange(event)} maxLength={2000}/>
            <div className="editor__character-count">{this.state.contentCharacterCount}/2000</div>
            <label>Preview</label>
            <div className="editor__preview flex-1" dangerouslySetInnerHTML={{ __html: this.state.contentPreview }}></div>
            <div className="editor__submit">
              <input type="submit" value="Submit" className="input__button"/>
              <input type="reset" value="Cancel" className="input__button" style={{ marginLeft: '10px' }}/>
              <span className="editor__error-message">{this.state.errorMessage}</span>
            </div>
          </ContentContainer>
        </form>
      </div>
    );
  }
}
