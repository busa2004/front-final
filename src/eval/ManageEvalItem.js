import React, { Component } from 'react';
import { Card } from 'antd';
import VersionSelect from './VersionSelect';
import VersionAdd from './VersionAdd';
import './ManageEvalItem.css';
import SelectedItemTable from './SelectedItemTable';


class ManageEvalItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: null,
            version: '',
            updateVersion: false,
            nCount: 1
        };
    }

    itemListCallback = (childItemList) => {
        childItemList.map((item) => {
            item.itemNo = this.state.nCount;
            // item.key = this.state.nCount;
            this.setState({
                nCount: this.state.nCount + 1
            });
        })
        this.setState({
            itemList: childItemList,
            nCount: 1
        });
        // console.log(this.state.itemList);
    }
    setVersion = (childVersion) => {
        this.setState({
          version: childVersion
        });
    }
    
    changeItemList = (toggle) => {
        this.setState({
            updateVersion: toggle
        });
    }
    
    render() {
        return (
            <div className="Option8">
                <Card title="평가 항목 관리" headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}>
                   <VersionSelect 
                        getItemList={this.itemListCallback}
                        disabled={false} 
                        setVersion={this.setVersion}
                        updateVersion={this.state.updateVersion}
                        changeItemList={this.changeItemList}
                         />
                    <SelectedItemTable 
                        itemList={this.state.itemList}
                         />
                    <VersionAdd 
                        setVersion={this.setVersion}
                        changeItemList={this.changeItemList}
                       />
                </Card>
            </div>
        );
    }
}
export default ManageEvalItem;