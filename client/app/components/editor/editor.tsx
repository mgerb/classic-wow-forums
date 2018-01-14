import React from 'react';
import marked from 'marked';
import axios from '../../axios/axios';
import { ContentContainer } from '../content-container/content-container';
import './editor.scss';

interface Props {
  categoryId: string;
  onClose: (cancel: boolean) => any;
}

interface State {
  title: string;
  content: string;
  contentPreview: string;
  characterCount: number;
  errorMessage?: string;
}

export class Editor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: '',
      content: '',
      contentPreview: '',
      characterCount: 0,
    };
  }

  onContentChange(event: any) {
    this.setState({ 
      content: event.target.value,
      contentPreview: marked(event.target.value, { sanitize: true }),
      characterCount: event.target.value.length,
    });
  }

  onSubmit() {

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

    this.newThread(data);
  }

  async newThread(data: any) {
    try {
      await axios.post('/api/thread', data);
      this.props.onClose(false);
    } catch (e) {
      this.setState({ errorMessage: 'Server error. Please try again later.' });
    }
  }

  render() {

    return (
      <div className="editor-container">
        <ContentContainer className="editor">
          <h2 style={{ color: 'white' }}>New Topic</h2>
          <label>Title</label>
          <input type="text" className="input editor__title" onChange={event => this.setState({ title: event.target.value })}/>
          <label>Content</label>
          <textarea className="input editor__text-area flex-1" onChange={event => this.onContentChange(event)}/>
          <label>Content Preview</label>
          <div className="editor__preview flex-1" dangerouslySetInnerHTML={{ __html: this.state.contentPreview }}></div>
          <div className="editor__submit">
            <a onClick={() => this.onSubmit()}>Submit</a>
            <a onClick={() => this.props.onClose(true)} style={{ marginLeft: '10px' }}>Cancel</a>
            <span className="editor__error-message">{this.state.errorMessage}</span>
            <span style={{ float: 'right' }}>{this.state.characterCount}/2000</span>
          </div>
        </ContentContainer>
      </div>
    );
  }
}
