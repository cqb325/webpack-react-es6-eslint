import React from 'react';
import '../../style/list.less';
import Button from '../button';

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data: this.props.data || []
        };
    }

    /**
     * 渲染列表
     * @return {[type]} [description]
     */
    renderList(){
        if (this.state.data){
            return this.state.data.map((item)=>{
                return <li className='list-item' data-value={item.id}>{item.text}</li>;
            });
        }
        return null;
    }

    /**
     * 添加选项
     */
    addItem(){
        if (this.refs.item.value){
            this.state.data.push({
                id: new Date().getTime(),
                text: this.refs.item.value
            });
            this.refs.item.value = '';

            this.setState({
                data: this.state.data
            });
        }
    }

    render(){
        return (
            <div>
                <div style={{marginBottom: 5}}>
                    <input ref='item' className='cm-input' />
                    <Button onClick={this.addItem.bind(this)}>Add</Button>
                </div>
                <ul className='list'>
                    {this.renderList()}
                </ul>
            </div>
        );
    }
}

export default List;
