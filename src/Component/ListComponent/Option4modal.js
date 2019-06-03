import React from 'react';
import { Modal, Button, Input, Row, Col, Card } from 'antd';
import "./Option4modal.css"
import { API_BASE_URL } from '../../constants/index'

const { TextArea } = Input;
class Option4modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: this.props.record.id,
      textArea: '',
      content: this.props.record.content,
      title: this.props.record.title,
      status: this.props.record.status,
      fileName: this.props.record.fileName
    }
    // console.log(this.props.record)
  }

  showModal = (e) => {
    this.setState({
      visible: true,

    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });

  }

  onChange = (e) => {
    this.setState({
      textArea: e.target.value
    })
  }

  disabled = () => {
    if (this.state.status === 'PROGRESS') {
      return true;
    }
    return false;
  }
 
  componentWillMount() {
    if (this.state.fileName != null) {
        this.setState({
            fileName: this.state.fileName.split(";")
        });

    }
    // console.log(this.state.fileName)
}
  render() {


    return (
      <div>
        <Button onClick={this.showModal}>
          {this.props.title}
        </Button>
        <Modal
          title='보고서 보기'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={1100}
        >
          <Card
            title={this.state.title}
          >
            <Row type="flex" justify="center">
              <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
            </Row>
          </Card>
         <p></p>
         
         <Card
          title="파일"
          >
          {(this.state.fileName === '') || (this.state.fileName === null) ? '' :
              this.state.fileName.map((fileName,key) =>
                                <Button key={key} href={API_BASE_URL + "/report/downloadFile/" + fileName}>{fileName}</Button>
                            )}
                    </Card>
          <p></p>
          <Card className="no"
            title='반려사유'
          >
            <TextArea rows={4} onChange={this.onChange} placeholder="반려 시 필수 입력" />
          </Card>
          <p></p>

          <Row type="flex" justify="end">
            <Col span={4} >

              <Button style={{ marginRight: "5px" }} type="primary" ghost disabled={this.disabled()} size='large' onClick={id => this.props.progress(this.state.id, 'PROGRESS', this.state.textArea, this.state.title)}>
                승인
                </Button>
              <Button style={{ marginRight: "5px" }} type="danger" ghost size='large' onClick={id => this.props.progress(this.state.id, 'HOLD', this.state.textArea, this.state.title)}>
                반려
                </Button>

            </Col>
          </Row>

        </Modal>
      </div>
    );
  }
}


export default Option4modal;