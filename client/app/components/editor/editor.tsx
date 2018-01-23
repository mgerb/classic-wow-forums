import React from 'react';
import marked from 'marked';
import { get } from 'lodash';
import axios from '../../axios/axios';
import { ContentContainer } from '../content-container/content-container';
import { ReplyModel } from '../../model';
import './editor.scss';

interface Props {
  categoryId?: number;
  onClose: (cancel: boolean) => any;
  editingReply?: ReplyModel;
  quotedReply?: ReplyModel;
  threadId?: string;
}

interface State {
  title: string;
  content: string;
  contentPreview: string;
  contentCharacterCount: number;
  errorMessage?: string;
}

export class Editor extends React.Component<Props, State> {

  private titleRef: any;
  private contentRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      title: '',
      content: '',
      contentPreview: '',
      contentCharacterCount: 0,
    };
  }

  // disable scrolling in the background
  componentDidMount() {
    document.body.style.overflow = 'hidden';

    // set content if user is editing a reply
    if (this.props.editingReply) {
      this.onContentChange({ target: { value: this.props.editingReply.content } });
    }

    if (this.titleRef) {
      this.titleRef.focus();
    } else {
      this.contentRef.focus();
    }
  }

  componentWillUnmount() {
    document.body.style.removeProperty('overflow');
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

  getErrorMessage(e: any) {
    return get(e, 'response.status') === 429 ?
      'You are doing that too much! Please try again in a few minutes.' :
      'Server error. Please try again later.';
  }

  async newReply() {
    const { content } = this.state;

    if (content === '') {
      this.setState({ errorMessage: 'Content must not be blank.' });
      return;
    }

    const data = {
      content,
      id: get(this.props, 'editingReply.id'),
      thread_id: this.props.threadId,
      quote_id: get(this.props, 'quotedReply.id') || undefined,
    };

    try {
      this.props.editingReply ? await axios.put('/api/reply', data) : await axios.post('/api/reply', data);
      this.props.onClose(false);
    } catch (e) {
      this.setState({ errorMessage: this.getErrorMessage(e) });
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
      this.setState({ errorMessage: this.getErrorMessage(e) });
    }
  }

  private renderTopicInput(): any {
    return (
      <div>
        <div><label>Title</label></div>
        <input type="text"
          ref={ref => this.titleRef = ref}
          className="input editor__title"
          onChange={event => this.onTitleChange(event)}
          maxLength={300}/>
      </div>
    );
  }

  renderQuotedReply() {
    return (this.props.quotedReply &&
      <blockquote className="blockquote">
        <small>Q u o t e:</small>
        <small dangerouslySetInnerHTML={{ __html: marked(this.props.quotedReply!.content, { sanitize: true }) }}/>
      </blockquote>
    );
  }

  getEditorTitle(): string {
    if (!this.props.threadId) {
      return 'New Topic';
    }
    return `${this.props.editingReply ? 'Edit' : 'New'} Reply`;
  }

  render() {
    return (
      <div className="editor-background">
        <ContentContainer className="editor-container">
          <form className="editor" onSubmit={event => this.onSubmit(event)} onReset={() => this.props.onClose(true)}>

            <h2 style={{ color: 'white' }}>{this.getEditorTitle()}</h2>
            {!this.props.threadId && this.renderTopicInput()}

            <div><label>Content</label></div>
            <textarea className="input editor__text-area flex-1"
              value={this.state.content}
              onChange={event => this.onContentChange(event)} maxLength={2000}
              ref={ref => this.contentRef = ref}
            />

            <div className="editor__submit">
              <div>
                <input type="submit" value="Submit" className="input__button"/>
                <input type="reset" value="Cancel" className="input__button" style={{ marginLeft: '10px' }}/>
              </div>
              <div>{this.state.contentCharacterCount}/2000</div>
            </div>

            <div className="editor__error-message red">{this.state.errorMessage}</div>

            <div><label>Preview</label></div>
            <div className="markdown-container">
              {this.renderQuotedReply()}
              <div className="editor__preview" dangerouslySetInnerHTML={{ __html: this.state.contentPreview }}></div>
            </div>

          </form>
        </ContentContainer>
      </div>
    );
  }
}
