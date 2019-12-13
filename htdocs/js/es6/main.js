import obj from '~/js/es6/components/comp.js';

require('./plugins/svg-sprite-loader.js');
require('@babel/polyfill');


function myPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('result');
    }, 1000);
  });
}
async function myAsyncFunc() {
  const param = await myPromise();
  console.log(param);
}
console.log('3343');
console.log(obj);
myAsyncFunc();
