import React, { Component } from 'react';
import { Table, Checkbox } from 'semantic-ui-react';
import AddTodo from './AddTodo';


class TodoList extends Component {
  state = {
    list: this.returnList(),
    currentIndex: -1,
    completedTaskCount: 0,
    remainTaskCount: 0,
    titleEdit: '',
    descEdit: '',
  }

  componentDidMount = () => {
    this.getCountDone();
  }

  returnList() {
    if (localStorage.getItem('todos') == null) {
      localStorage.setItem('todos', JSON.stringify([]))
    }

    return JSON.parse(localStorage.getItem('todos'))
  }

  getCountDone() {
    let list = this.returnList();
    let completedTaskCount = 0
    let remainTaskCount = 0

    list.forEach(element => {
      if (element.completed) {
        completedTaskCount = completedTaskCount + 1
      } else {
        remainTaskCount = remainTaskCount + 1
      }
    });

    this.setState({
      completedTaskCount: completedTaskCount,
      remainTaskCount: remainTaskCount
    })
  }

  addOrEdit = (data) => {
    let list = this.returnList();

    if (this.state.currentIndex == -1)
      list.push(data);
    else
      list[this.state.currentIndex] = data

    this.reset(list);
  }

  handleEdit = (index) => {
    this.setState({
      currentIndex: index
    })
    this.isEditMode(index);
  }

  handleDelete = (index) => {
    let list = this.returnList();
    list.splice(index, 1);
    this.reset(list);
  }

  handleComplete = (index) => {
    let list = this.returnList();
    let item = list[index]
    item.completed = true;
    this.reset(list);
  }

  handleIncomplete = (index) => {
    let list = this.returnList();
    let item = list[index]
    item.completed = false;
    this.reset(list);
  }

  isEditMode(index) {
    let list = this.returnList();
    let item = list[index];
    list.forEach(element => {
      element.isEdit = false
    });
    item.isEdit = true;
    localStorage.setItem('todos', JSON.stringify(list))
    this.setState({
      list,
      currentIndex: -1,
      titleEdit: item.task,
      descEdit: item.desc
    })
    this.getCountDone();
  }

  handleSave(index) {
    let list = this.returnList();
    let item = list[index];
    item.isEdit = false;
    item.task = this.state.titleEdit;
    item.desc = this.state.descEdit;
    localStorage.setItem('todos', JSON.stringify(list))
    this.setState({
      list,
      currentIndex: -1,
      titleEdit: '',
      descEdit: ''
    })
    this.getCountDone();
  }

  handleCancel(index) {
    let list = this.returnList();
    let item = list[index];
    item.isEdit = false;
    this.reset(list);
  }

  reset = (list) => {
    localStorage.setItem('todos', JSON.stringify(list))
    this.setState({ list, currentIndex: -1 })
    this.getCountDone();
  }

  editInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    return (
      <div className='page-content'>
        <AddTodo
          onAddOrEdit={this.addOrEdit}
          currentIndex={this.state.currentIndex}
          list={this.state.list}
        />
        <span className='page-header'>All tasks ({this.state.list.length})</span>
        <span className='page-header'>Completed tasks ({this.state.completedTaskCount})</span>
        <span className='page-header'>Remain tasks ({this.state.remainTaskCount})</span>
        <hr />
        <Table celled className='data-table'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell className='data-title'>Title</Table.HeaderCell>
              <Table.HeaderCell className='data-desc'>Description</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.state.list.map((item, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>
                      {
                        item.completed ?
                          <Checkbox checked onChange={() => this.handleIncomplete(index)}/>
                          // <input type='checkbox' checked onChange={() => this.handleIncomplete(index)} />
                          :
                          <input type='checkbox' onChange={() => this.handleComplete(index)} />
                      }
                    </Table.Cell>
                    {
                      item.isEdit ?
                        <Table.Cell>
                          <input value={this.state.titleEdit} name='titleEdit' onChange={this.editInput} />
                        </Table.Cell>
                        :
                        <Table.Cell onClick={() => this.handleEdit(index)}>
                          <span className={item.completed ? 'line-through' : ''}>{item.task}</span>
                        </Table.Cell>
                    }
                    {
                      item.isEdit ?
                        <Table.Cell>
                          <input value={this.state.descEdit} name='descEdit' onChange={this.editInput} />
                        </Table.Cell>
                        :
                        <Table.Cell onClick={() => this.handleEdit(index)}>
                          <span className={item.completed ? 'line-through' : ''}>{item.desc}</span>
                        </Table.Cell>
                    }
                    <Table.Cell>
                      {
                        item.isEdit ?
                          <div>
                            <button className='mr-10' onClick={() => this.handleSave(index)}>Save</button>
                            <button onClick={() => this.handleCancel(index)}>Cancel</button>
                          </div>
                          :
                          <button onClick={() => this.handleDelete(index)}>Delete</button>
                        // <button onClick={() => this.handleEdit(index)}>Edit</button>
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        item.completed ?
                          // <button onClick={() => this.handleIncomplete(index)}>
                          <span className='status-text'>Completed</span>
                          // </button>
                          :
                          <button onClick={() => this.handleComplete(index)}>Complete</button>
                      }
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div >
    )
  }
}

export default TodoList