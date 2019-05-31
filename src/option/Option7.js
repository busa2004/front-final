import React, { Component } from 'react';
import TextEdit from '../Component/WriteComponent/TextEdit';
import {Card} from 'antd';
import './css/edit.css'

class Option7 extends Component {
    render() {
        return (
                <Card title='업무등록' headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}> 
                <div className="edit">
                <TextEdit router={'task'} />
                </div>
                </Card>
        );
    }
}
 export default Option7;