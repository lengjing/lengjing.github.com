import React from 'React';
import InputNumber from '../lib/rc-input-number';

export default class extends React.Component {
  render(){
    return (
      <TCInputNumber defaultValue={1} step={1}/>
    )
  }
}
