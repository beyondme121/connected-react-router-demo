
import {compareTwoVdom} from './react-dom';
import {isFunction} from './utils';
/**
 * 对象 类 
 * 单例 对象就够了 需要很对象或者说实例的话类
 */
 export let updateQueue = {
    updaters:new Set(),//更新器的数组
    isBatchingUpdate:false,//标志 是否处于批量更新模式 默认是非批量更新
    add(updater){//增加一个更新器
        this.updaters.add(updater);
    },
    batchUpdate(){//强制批量实现组件更新
        this.updaters.forEach(updater=>updater.updateComponent())
        this.isBatchingUpdate = false;
        this.updaters.clear()
    }
}
class Updater{
    constructor(classInstance){
        this.classInstance = classInstance;//类组件的实例
        this.pendingStates = [];//等待更新的状态数组 [{number:1},{number:1}]
    }
    addState(partialState){
        //先把这个分状态添加到pendingStates数组中去
        this.pendingStates.push(partialState);
        //如果当前处于批量更新模式,也就是异步更新模式,把当前的 update实例放到updateQueue里
        //如果非批量更新,也就是同步更新的话,则调用updateComponent直接更新
        this.emitUpdate();//发射更新不需要传
    }
    //当属性或者状态变更后都会走emitUpdate
    emitUpdate(nextProps){
        this.nextProps = nextProps;
        //如果有新的属性拿 到了,或者现在处于非批量模式(异步更新模式),直接更新
        (this.nextProps||!updateQueue.isBatchingUpdate)?this.updateComponent():updateQueue.add(this);
    }
    updateComponent(){//开始真正用pendingStates更新状态this.state
        let {classInstance,pendingStates,nextProps}=this;
        if(nextProps||pendingStates.length>0){
            //组件的老状态和数组中的新状态合并后得到最后的新状态
            //classInstance.state = this.getState();
            //classInstance.forceUpdate();//让组件强行更新
            //无论是否真正更新页面,组件的state其实已经在this.getState()的时候更新了
            shouldUpdate(classInstance,nextProps,this.getState());
        }
    }
    getState(){//根据老状态和等待生效的新状态,得到最后新状态
        let {classInstance,pendingStates}=this;
        let {state} = classInstance;//counter.state 
        if(pendingStates.length>0){//说明有等待更新的状态
            pendingStates.forEach(nextState=>{
                if(isFunction(nextState)){//如果函数的话
                    nextState = nextState(state);
                }
                state = {...state,...nextState};//用新状态覆盖老状态
            });
            pendingStates.length=0;
        }
        return state;
    }
}
function shouldUpdate(classInstance,nextProps,nextState){
  if(nextProps){
    classInstance.props = nextProps;
  }
  classInstance.state = nextState;//不管是否要刷新页面,状态一定会改
  if(classInstance.shouldComponentUpdate
    &&!classInstance.shouldComponentUpdate(classInstance.props,nextState)){
        return;//如果提供了shouldComponentUpdate函数,并且它的返回值为false,就更继续走了,更新结束 
  }
  classInstance.forceUpdate();

}
class Component{
    static isReactComponent = true;
    constructor(props){
        this.props = props;
        this.state = {};
        //会为每一个组件实例配一个Updater类的实例
        this.updater = new Updater(this);
    }
    /**
     * 同步更新逻辑
     * @param {*} partialState 新的部分状态
     */
    setState(partialState){
       this.updater.addState(partialState);
    }
    forceUpdate(){
        if(this.componentWillUpdate){//将更新
            this.componentWillUpdate();
        }//我现在要更新 Counter这个类组件了
        let newVdom = this.render();
        //oldVdom就是类的实例的render方法渲染得到的那个虚拟DOM,或者说React元素div
        //this.oldVdom.dom.parentNode是谁?#root 
        //那childCounter的parentNode是谁  div id=‘counter’ 
        let currentVdom = compareTwoVdom(this.oldVdom.dom.parentNode,this.oldVdom,newVdom);
        //每次更新后,最新的vdom会成为最新的上一次的vdom,等待下一次的列新比较
        this.oldVdom = currentVdom;
        if(this.componentDidUpdate){//将更新完成
            this.componentDidUpdate();
        }
        
    }
}

export default Component;