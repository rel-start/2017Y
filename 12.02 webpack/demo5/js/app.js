import testImg from '../assets/1.jpg';

const root = document.getElementById('root');

const img = document.createElement('img');

img.src = testImg;

img.onload = function (){
  root.appendChild(this);
}