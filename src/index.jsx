import React from 'react';
import ReactDOM from 'react-dom';
import MyApplication from './components/MyApplication.jsx';
import './main.scss';
import Promise from 'bluebird';

ReactDOM.render(
  <MyApplication />,
  document.getElementById('container')
);