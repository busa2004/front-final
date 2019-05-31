import React, { Component } from 'react';
import TextEdit from '../Component/WriteComponent/TextEdit';
import {Card} from 'antd';
import './css/edit.css'
class Option2 extends Component {
    render() {
        return (
                <Card headStyle={{backgroundColor:"#00B1B6",color:"#FBFBFB",fontWeight:"bold"}}
                 title='보고서등록'>
                <div className='edit'>

                {console.log(this.props.currentUser)}
                <TextEdit currentUser={this.props.currentUser} router={'report'} />
                </div>
                </Card>
        );
    }
}
 export default Option2;