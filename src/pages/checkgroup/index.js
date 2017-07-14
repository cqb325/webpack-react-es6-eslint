/**
 * @author cqb 2016-04-27.
 * @module CheckBoxGroup
 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CheckBox from '../checkbox';

/**
 * CheckBoxGroup 类
 * @class CheckBoxGroup
 * @constructor
 * @extend BaseComponent
 */
class CheckBoxGroup extends React.Component {
    static defaultProps = {
        layout: 'inline',
        valueField: 'id',
        textField: 'text'
    };

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            value: props.value === undefined ? '' : props.value
        };

        console.log(props.valueField);

        this.items = [];
    }

    /**
     * 值变化回调
     * @method handleChange
     * @param value {String} 当前操作对象的值
     * @param checked   {Boolean} 知否选中
     * @param event     {Event} 事件对象
     * @param item  {Object} 当前操作对象
     */
    handleChange(value, checked, event, item){
        const {readOnly, disabled} = this.props;

        if (readOnly || disabled) {
            return;
        }

        item._checked = checked;
        let ret = [];
        this.items.forEach((theItem)=>{
            console.log(theItem.isChecked());
            if (theItem.isChecked()){
                let value = theItem.getValue();
                ret.push(value);
            }
        });

        this.handleTrigger(ret.join(','));
    }

    /**
     * 处理值变化
     * @method handleTrigger
     * @param value {String} 当前值
     */
    handleTrigger(value){
        this.state.value = value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    /**
     * 设置值
     * @method setValue
     * @param value {String} 要设置的值
     */
    setValue(value){
        this.setState({value: value});
    }

    /**
     * 获取值
     * @method getValue
     * @returns {*}
     */
    getValue(){
        return this.state.value;
    }

    /**
     * 渲染子节点
     * @method _renderItems
     * @returns {Array} 子对象
     * @private
     */
    _renderItems(){
        let {valueField, textField, name} = this.props;

        let data = this.state.data || [];
        let values = this.state.value.split(',');
        return data.map((item, index)=>{
            let valueKey = valueField;

            let textKey = textField;
            let value = item[valueKey];
            let text = item[textKey];
            let checked = values.indexOf(value) !== -1;

            return (
                <CheckBox
                    key={index}
                    ref={(ref)=>{ this.items.push(ref); }}
                    name={name}
                    disabled={this.props.disabled}
                    readOnly={this.props.readOnly}
                    value={value}
                    label={text}
                    checked={checked}
                    item={item}
                    onChange={this.handleChange.bind(this)}
                />);
        }, this);
    }

    componentWillMount(){
        if (this.props.url && window.fetch){
            this.renderRemoteData();
        }
    }

    async renderRemoteData(){
        // fetch(this.props.url).then((res)=>{
        //     let json = res.json();
        //
        //     this.setState({
        //         data: ret
        //     });
        // });
        let res = await fetch(this.props.url);
        const ret = await res.json();

        this.setState({
            data: ret
        });
    }

    render () {
        let { className, layout } = this.props;
        className = classNames(
            className,
            'cm-checkbox-group',
            {
                stack: layout === 'stack'
            }
        );

        return (
            <span className={className}>
                {this._renderItems()}
            </span>
        );
    }
}

CheckBoxGroup.propTypes = {
    /**
     * 数据源
     * @attribute data
     * @type {Array}
     */
    data: PropTypes.array,
    /**
     * 默认值
     * @attribute value
     * @type {String}
     */
    value: PropTypes.string,
    /**
     * 数据源地址
     * @attribute url
     * @type {String}
     */
    url: PropTypes.string,
    /**
     * 只读属性
     * @attribute readOnly
     * @type {Boolean}
     */
    readOnly: PropTypes.bool,
    /**
     * 禁用属性
     * @attribute disabled
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    /**
     * 组名
     * @attribute name
     * @type {String}
     */
    name: PropTypes.string,
    /**
     * class样式名称
     * @attribute className
     * @type {String}
     */
    className: PropTypes.string,
    /**
     * 行式inline、堆积stack布局
     * @attribute layout
     * @type {String}
     */
    layout: PropTypes.oneOf(['inline', 'stack']),
    /**
     * value字段
     * @attribute valueField
     * @type {String}
     */
    valueField: PropTypes.string,
    /**
     * 显示字段
     * @attribute textField
     * @type {String}
     */
    textField: PropTypes.string,
    /**
     * 值变化回调
     * @attribute onChange
     * @type {Function}
     */
    onChange: PropTypes.func
};

export default CheckBoxGroup;
