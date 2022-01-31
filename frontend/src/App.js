import React, { Component } from 'react'; // imrc shortcut
import Modal from "./components/Modal";
import axios from 'axios';  


// using a state based component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      taskList: []
    };
  }


  /* 
    This is invoked immediately after a component is mounted (inserted into the tree)
  */
  componentDidMount() {
    this.refreshList();
  }

 
  refreshList = () => {
    /*
      Axios connects between the backend and the frontend,
      to send and receive HTTP requests;
      i.e send client requests to server, get server response to client
    */
    axios   
      .get("http://localhost:8000/api/tasks/") // this returns a promise
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err)); // incase of err, catch them
  };


  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };


  // renders two spans which control which set of items are displayed
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span onClick={() => this.displayCompleted(true)} className={this.state.viewCompleted ? "active" : ""} >
          completed
        </span>

        <span onClick={() => this.displayCompleted(false)} className={this.state.viewCompleted ? "" : "active"} >
          Incompleted
        </span>
      </div>
    );
  };


  // Main variable to render items on the screen, completed/uncompleted
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    );

    // return new items while mapping each item
    return newItems.map(item => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span
          // check viewCompleted state
          title={item.description}
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
        >
          {item.title}
        </span>

        <span>
          <button onClick={() => this.editItem(item)} className="btn btn-info m-2">
            Edit
          </button>

          <button onClick={() => this.handleDelete(item)} className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };
 
  toggle = () => { 
    this.setState({ modal: !this.state.modal });
  };


  
  // Submit an item
  handleSubmit = item => {
    this.toggle();
    
    // for updating tasks, 
    if (item.id) {
      // get specific item and modify it
      axios
      .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
      .then(res => this.refreshList());
      return;
    }
    
    // post item after modifying, to complete update
    axios
    .post("http://localhost:8000/api/tasks/", item)
    .then(res => this.refreshList());
  };
  /*
    - for testing
    handleSubmit = item => { //added this after modal creation
    this.toggle(); 
    alert("save" + JSON.stringify(item));};
  */

  
  handleDelete = item => {
    axios
    .delete(`http://localhost:8000/api/tasks/${item.id}/`)
    .then(res => this.refreshList());
  };
  /*
  - for testing
    Delete item - function added after modal creation.
    handleDelete = item => {
    alert("delete" + JSON.stringify(item)) };
  */ 

  // Create item
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //Edit item
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };


  render() {
    return (
      <main className="content">
        <h1 className="text-info text-uppercase text-center m-4">Task Manager</h1>

        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">

              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>

              {this.renderTabList()}

              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>

            </div>
          </div>
        </div>
        <footer className='my-3 mb-2 bg-info text-white text-center'>
          Codexgrey Copyright 2022 &copy; All Rights Reserved
        </footer>
        {/* 
          if true, i want activeItem, toggle and onSave as props, else do none
          active item represents the task item i want to edit
        */}
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    );
  }
}


export default App;
