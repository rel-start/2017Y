import React, {Component} from 'react';
import ReactDOM from 'react-dom';

function Goto(props){
  return <h4>名字：{props.test}</h4>;
}

class App extends Component {
  render(){
    return (
      <div>
        <h1>hello</h1>
        <Welcome text="宁波"/>
        <Welcome text="杭州"/>
        <Goto test="余姚" />
      </div>
    );
  }
};

class Welcome extends Component {
  render(){
    return (
      <div>
        <p>{this.props.text}</p>
      </div>
    );
  }
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);