import React from 'react';
import '../../style/list.less';

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data: props.data || []
        };
    }

    /**
     *
     * @return {[type]} [description]
     */
    renderList(){
        if (this.state.data){
            return this.state.data.map((item, index)=>{
                return <li key={item.id} className='list-item' data-value={item.id}>{item.text}</li>;
            });
        }
        return null;
    }

    render(){
        return (
            <ul className='list'>
                {this.renderList()}
            </ul>
        );
    }
}

export default List;
