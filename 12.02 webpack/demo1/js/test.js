export function fn1(){
  console.log('fn1');
};

export function fn2(){
  console.log('fn2');
};

// 指定默认导出模块，export default 只能使用一次
export default function fn3(){
  console.log('fn3');
};