import React, { Component } from 'react';
import {
    Upload, message, Button, Icon,
  } from 'antd';
  import {API_BASE_URL} from '../../constants/index'
 
  class Uploader extends Component {
    constructor(props){
      super(props);
      this.state={
        fileName:null
      }
    }
     config = {
    
      name: 'file',
      action: API_BASE_URL+'/files',
      headers: {
        authorization: 'authorization-text',
        "Accept-Charset":'UTF-8'
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    
    render() {
        return (
     <div className="Upload">
      <Upload {...this.config} onChange={info => this.props.onUpload(info.fileList)}>
       <Button>
        <Icon type="upload" /> 파일첨부
       </Button>
      </Upload>
     
            </div>
        );
    }
}
 export default Uploader;