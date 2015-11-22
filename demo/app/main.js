import './assets/common.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './component';
// import {TCInputNumber} from '../components';
import TCInputNumber from '../lib/rc-input-number';


// ReactDOM.render(<TCInputNumber defaultValue={2} step={1}/>,document.getElementById("foo"));
const HotCity = React.createClass({
  getDefaultProps(){
    return {
      citys: [
        {"destName": "韩国","linkUrl": "/dujia/shanghai/package/list/hanguo.html"},
        {"destName": "韩国1","linkUrl": "/dujia/shanghai/package/list/hanguo.html"},
        {"destName": "韩国2","linkUrl": "/dujia/shanghai/package/list/hanguo.html"},
        {"destName": "韩国3","linkUrl": "/dujia/shanghai/package/list/hanguo.html"}
      ]
    }
  },
  componentDidMount(){

  },
  render(){
    return (
      <div className="hot-city">
        <ul>
          {this.props.citys.map((city)=><li><a href={city.linkUrl}>{city.destName}</a></li>)}
        </ul>
      </div>
    )
  }
})

class View extends React.Component {
  constructor(){
    super();
    this.state = {}
  }
  onClick(){
    alert(1)
  }
  render(){
    return (
      <div ref="dom" onClick={this.onClick}>
        <div>header</div>
        <div>body</div>
        <div>footer</div>
        <div><HotCity /></div>
      </div>
    )
  }
}
ReactDOM.render(<View name={1} /> ,document.getElementById("foo"))
