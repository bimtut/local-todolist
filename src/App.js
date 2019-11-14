import React, { Component } from 'react';
import './App.css';
import './styles/todomvc-app-css/index.css'
import './styles/todomvc-common/base.css'
import { connect } from 'react-redux'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toDoList: [],
      status: 'all',
      edit: {},
      filter: 'all'
    }
  }
  // awal mula
  componentDidMount = async () => {
    this.props.dispatch({ type: "GET_DATA_REQUESTED" })
    if (localStorage.getItem('list')) {
      await this.setState({ toDoList: JSON.parse(localStorage.getItem('list')) })
    } else {
      await this.setState({ toDoList: [] })
    }
  }

  // adding list
  addData = (val) => {
      console.log('ini val, ', val.target.value)
      if (val.keyCode === 13 && val.target.value.length > 0) {
        val.preventDefault();
        this.state.toDoList.push({ status: 'pending', name: val.target.value})
        val.target.value = ''
        localStorage.setItem('list', JSON.stringify(this.state.toDoList))
        this.setState({ toDoList: this.state.toDoList })
      }

    
  }
  // edit list
  editData = (val) => {
    if (val.keyCode === 13 && val.target.value.length > 0) {
      let index = this.state.toDoList.indexOf(this.state.edit)
      this.state.toDoList[index] = this.state.edit
      val.target.value = ''
      localStorage.setItem('list', JSON.stringify(this.state.toDoList))
      document.getElementsByClassName('edit')[index].style.display = 'none'
      document.getElementsByClassName('view')[index].style.display = 'block'
      this.setState({ toDoList: this.state.toDoList, edit: {} })
    }
  }
  // delete list
  deleteData = (item) => {
    const index = this.state.toDoList.indexOf(item)
    this.state.toDoList.splice(index, 1)
    localStorage.setItem('list', JSON.stringify(this.state.toDoList))
    this.setState({ toDoList: this.state.toDoList })
  }
  // clear list with status : complete
  clearCompleted = async () => {
    const result = this.state.toDoList.filter(item => item.status !== 'completed');
    this.state.toDoList = result
    localStorage.setItem('list', JSON.stringify(this.state.toDoList))
    this.setState({ toDoList: this.state.toDoList })
  }

  // value changed
  onChangeInput = (val) => {
    this.state.edit.name = val.target.value
    this.setState({ edit: this.state.edit })
  }

  // edit by double-click
  editTrigger = (item) => {
    this.setState({ edit: item })
    document.getElementsByClassName('edit')[this.state.toDoList.indexOf(item)].style.display = 'block'
    document.getElementsByClassName('view')[this.state.toDoList.indexOf(item)].style.display = 'none'
  }

  // set status item
  setStatusItem = (item) => {
    const index = this.state.toDoList.indexOf(item)
    this.state.toDoList[index].status = item.status === 'completed' ? 'pending' : 'completed'
    localStorage.setItem('list', JSON.stringify(this.state.toDoList))
    this.setState({ toDoList: this.state.toDoList })
  }
  // render terhadap tipe dari todo list
  renderOption = () => {
    if (this.state.statusList === 'complete') {
      return this.state.toDoList.filter((item) => {
        if (item.status === 'completed') {
          if (this.state.categoryFilter !== 'all') {
            if (item.category === this.state.categoryFilter) {
              return item
            }
          } else {
            return item
          }
        }
      }).map((item, key) => (
        <li className={item.status === 'completed' && 'completed'}>
          <div className="view" onDoubleClick={() => this.editTrigger(item)}>
            <input className="toggle" type="checkbox" checked={item.status === 'completed' ? true : false} onClick={() => this.setStatusItem(item)} />
            <label>{item.name}</label>
            <button className="destroy" onClick={() => this.deleteData(item)}></button>
          </div>
          <input className="edit" value={this.state.edit.name} onKeyUp={(val) => this.editData(val)} onChange={(val) => this.onChangeInput(val)} />
        </li>
      )
      )
    } else if (this.state.statusList === 'active') {
      return this.state.toDoList.filter((item) => {
        if (item.status !== 'completed') {
          if (this.state.categoryFilter !== 'all') {
            if (item.category === this.state.categoryFilter) {
              return item
            }
          } else {
            return item
          }
        }
      }).map((item, key) => (
        <li className={item.status === 'completed' && 'completed'}>
          <div className="view" onDoubleClick={() => this.editTrigger(item)}>
            <input className="toggle" type="checkbox" checked={item.status === 'completed' ? true : false} onClick={() => this.setStatusItem(item)} />
            <label>{item.name}</label>
            <button className="destroy" onClick={() => this.deleteData(item)}></button>
          </div>
          <input className="edit" value={this.state.edit.name} onKeyUp={(val) => this.editData(val)} onChange={(val) => this.onChangeInput(val)} onBlur={(val) => this.editData(val)}/>
        </li>
      )
      )
    } else {
      return this.state.toDoList.filter((item) => this.state.categoryFilter === 'all' ? item : item.category === this.state.categoryFilter).map((item, key) => (
        <li className={item.status === 'completed' && 'completed'}>
          <div className="view" onDoubleClick={() => this.editTrigger(item)}>
            <input className="toggle" type="checkbox" checked={item.status === 'completed' ? true : false} onClick={() => this.setStatusItem(item)} />
            <label>{item.name}</label>
            <button className="destroy" onClick={() => this.deleteData(item)}></button>
          </div>
          <input className="edit" value={this.state.edit.name} onKeyUp={(val) => this.editData(val)} onChange={(val) => this.onChangeInput(val)} onBlur={(val) => this.editData(val)}/>
        </li>
      )
      )
    }
  }

  render() {
    const complete = this.state.toDoList.filter((itemCompleted) => itemCompleted.status !== 'completed')
    return (
      <div>
        <section class="todoapp">
          <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus onKeyUp={(val) => this.addData(val)}/>
          </header>
          <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox" />
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
              {this.renderOption()}
          
            </ul>
          </section>
          <footer class="footer">
            <span class="todo-count"><strong>{complete.length}</strong> item left</span>
            <ul class="filters">
              <li>
                <a className={this.state.statusList === 'all' && "selected"} onClick={() => this.setState({ statusList: 'all' })}>All</a>
              </li>
              <li>
                <a className={this.state.statusList === 'active' && "selected"} onClick={() => this.setState({ statusList: 'active' })}>Active</a>
              </li>
              <li>
                <a className={this.state.statusList === 'complete' && "selected"} onClick={() => this.setState({ statusList: 'complete' })}>Completed</a>
              </li>
              {console.log(this.state)}
            </ul>
            <button class="clear-completed" onClick={() => this.clearCompleted()}>Clear completed</button>
          </footer>
        </section>
        <footer class="info">
          <p>Double-click to edit a todo</p>

        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(App);
