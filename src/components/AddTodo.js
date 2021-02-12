import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'

class AddTodo extends Component {
  state = {
    ...this.returnStateObj()
  }

  returnStateObj() {
    if (this.props.currentIndex == -1) {
      return {
        task: '',
        desc: '',
        completed: false,
      }
    } else {
      return this.props.list[this.props.currentIndex]
    }
  }

  componentDidUpdate(PrevProps) {
    if (PrevProps.currentIndex != this.props.currentIndex ||
      PrevProps.list.length != this.props.list.length) {

      this.setState({
        ...this.returnStateObj()
      })
    }
  }

  addInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      completed: this.state.completed
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onAddOrEdit(this.state)
  }

  render() {
    return (
      <div>
        <h3>TODO App</h3>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <input name='task' placeholder='Title' className='mr-10'
              value={this.state.task} onChange={this.addInput} /> 
            <input name='desc' placeholder='Description' className='mr-10'
              value={this.state.desc} onChange={this.addInput} />
            <Button className='mr-10' type='submit'>Save</Button>
            <Button className='mr-10' type='reset'
              onClick={() => {
                this.setState({
                  task: '',
                  desc: '',
                  completed: false
                })
              }}>Cancel</Button>
          </Form>
        </div>
      </div>
    )
  }

}

export default AddTodo