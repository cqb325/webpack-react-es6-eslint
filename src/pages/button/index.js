import React from 'react';
import '../../style/button.css';
import classNames from 'classnames';

class Button extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            active: false
        };
    }

    onClick(){
        if (this.props.onClick){
            this.props.onClick();
        }
    }

    onMouseDown(){
        // this.state.active = true;
        this.setState({
            active: true
        });
    }

    onMouseUp(){
        this.setState({
            active: false
        });
    }

    render(){
        let className = classNames('cm-button', {
            'cm-button-active': this.state.active
        });
        return (
            <a
                className={className}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}
            >
                {this.props.children}
            </a>
        );
    }
}

export default Button;
