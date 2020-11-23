## 虚拟DOM 渲染
- React.createElement
- ReactDOM.render

## 函数组件
- createElement中type如果是function, 执行函数并将props传递进来, 返回真实的DOM

## 类组件渲染
- 实例化类 调用对象的render方法 render方法中返回了jsx

## 状态更新机制
- 同步更新 react控制不了的 定时器...宏任务等
  - 合并新老状态 {...this.state, ...partialState}
  - 调用子类实例的render方法,根据返回的最新的虚拟DOM, 创建新的DOM
  - 替换原有的DOM,并更新类组件实例上的dom属性
- 异步更新 react可以控制的，生命周期, 事件处理函数

## 事件处理
- 绑定事件
- 组件更新
- 组件异步更新
