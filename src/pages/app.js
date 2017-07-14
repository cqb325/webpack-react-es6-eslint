import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

// import Hello from './hello';
// import Button from './button';
// import List from './list';
// import List from './list2';
// import CheckBox from './checkbox';
import CheckBoxGroup from './checkgroup';


// ReactDOM.render(<Hello />, document.getElementById('app'));
// ReactDOM.render(<Button theme='primary'>PRIMARY</Button>, document.getElementById('app'));

// ReactDOM.render(<List data={[
//     {id: 1, text: 'item1'},
//     {id: 2, text: 'item2'},
//     {id: 3, text: 'item3'},
//     {id: 4, text: 'item4'}
// ]} />, document.querySelector('#app'));


// ReactDOM.render(
//     <div>
//         <CheckBox label='raect' value='0' />
//         <CheckBox label='vue' value='1' />
//         <CheckBox label='angular' value='2' />
//     </div>, document.querySelector('#app'));

let selectChange = function(value){
    console.log(value);
};

let obj = ReactDOM.render(
    <CheckBoxGroup
        // data={[
        //     {value: '0', name: 'raect'},
        //     {value: '1', name: 'vue'},
        //     {value: '2', name: 'angular'}
        // ]}
        url='http://localhost:8415/mock/cdn-ops//warning/nodeList'
        // valueField='value'
        // textField='name'
        onChange={selectChange}
    />, document.querySelector('#app')
);

console.log(obj);
