import React, { Component } from 'react';
import { Input, Form, Modal, notification, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import {
    
    withRouter
} from 'react-router-dom';
import ItemTable from './ItemTable';
import { setEvalVersion } from '../util/APIUtils';

class VersionAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: null,
            version: { value: '' },
            states:"off",
            data:[{
                key: 1,
                itemNo: 1,
                content: '평가항목을 입력해주세요.'
            }]
        }
    }

    // versionAdd
    showModal = () => {
        this.setState({
            visible: true,
            states:"on",
        });
    }

    handleCancel = (e) => {
        // modal 초기화
        this.setState({
            visible: false,
            version: {
                value: ''
            },
            dataSource: [],
            states:"off",
        });
        
    }
    dataSourceCallback = (childDataSource) => {
        this.setState({
            dataSource: childDataSource
        });
    }
    handleInputChange = (e) => {
        const target = e.target;
        const inputVersion = target.name; // input 안에 name이 가리키는 값
        const inputValue = target.value;

        this.setState({
            [inputVersion]: {
                value: inputValue,
            }
        });
    }
    handleOk  = async (event) => {
        event.preventDefault();

        const versionValue = {
            version: this.state.version.value,
            dataSource: this.state.dataSource
        }
        await setEvalVersion(versionValue)
            .then(response => {
                notification.success({ // 옆에 표시 띄우기
                    message: 'Message',
                    description: "평가항목이 저장되었습니다."
                })
            }).catch(error => {
                notification.error({
                    message: 'Message',
                    description: "평가항목 저장을 실패하였습니다."
                })
            });
        // ok됐을때 modal 초기화
        this.setState({
            visible: false,
            version: {
                value: ''
            },
            dataSource: [],
            states:"off",
        });
        this.props.changeItemList(true);
       
    }
    render() {
        return (
            <div>
                <div style={{ textAlign: "right" }}>
                    <Button style={{ textAlign: "center", width: '100px', marginTop: 5 }} onClick={this.showModal}> 버전 추가 </Button>
                </div>
                <Modal 
                    title="버전 추가" 
                    visible={this.state.visible} 
                    onOk={this.handleOk} 
                    onCancel={this.handleCancel}>
                    <ItemTable 
                        getDataSource={this.dataSourceCallback}
                        states={this.state.states}
                        dataSource={this.state.data}
                        />
                    <div style={{ marginTop: "10px" }}>
                        <Form>
                            <FormItem>
                                <Input
                                    size="large"
                                    name="version"
                                    placeholder="버전명을 입력해주세요."
                                    value={this.state.version.value}
                                    onChange={event => this.handleInputChange(event)}
                                />
                            </FormItem>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(VersionAdd);