function createElement(tag, attributes, children, events) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (events) {
    Object.keys(events).forEach((eventName) => {
      element.addEventListener(eventName, events[eventName]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else if (child instanceof Component) {
        element.appendChild(child.getDomNode());
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  } else if (children instanceof Component) {
    element.appendChild(children.getDomNode());
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newNode = this.render();
    this._domNode.replaceWith(newNode);
    this._domNode = newNode;
  }
}

class AddTask extends Component {
  constructor(onAddTask, onInputChange, inputValue) {
    super();
    this.onAddTask = onAddTask;
    this.onInputChange = onInputChange;
    this.inputValue = inputValue;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
          "input",
          {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
            value: this.inputValue,
          },
          null,
          { input: this.onInputChange }
      ),
      createElement("button", { id: "add-btn" }, "+", {
        click: this.onAddTask,
      }),
    ]);
  }
}

class Task extends Component {
  constructor(task, onToggle, onDelete) {
    super();
    this.task = task;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.state = {
      deleteConfirmation: false,
    };
  }

  onDeleteClick = () => {
    if (!this.state.deleteConfirmation) {
      this.state.deleteConfirmation = true;
      this.update();
    } else {
      this.onDelete();
    }
  };

  render() {
    return createElement("li", {}, [
      createElement(
          "input",
          {
            type: "checkbox",
            checked: this.task.completed ? "checked" : null,
          },
          null,
          { change: this.onToggle }
      ),
      createElement(
          "label",
          { class: this.task.completed ? "completed" : "" },
          this.task.text
      ),
      createElement(
          "button",
          {
            class: this.state.deleteConfirmation ? "delete-confirm" : "",
          },
          "🗑️",
          { click: this.onDeleteClick }
      ),
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false },
      ],
      inputValue: "",
      nextId: 4,
    };
  }

  onAddInputChange = (e) => {
    this.state.inputValue = e.target.value;
  };

  onAddTask = () => {
    if (this.state.inputValue.trim() === "") return;

    this.state.tasks.push({
      id: this.state.nextId++,
      text: this.state.inputValue,
      completed: false,
    });
    this.state.inputValue = "";
    this.update();
  };

  onToggleTask = (id) => {
    const task = this.state.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.update();
    }
  };

  onDeleteTask = (id) => {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
    this.update();
  };

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask(
          this.onAddTask,
          this.onAddInputChange,
          this.state.inputValue
      ),
      createElement(
          "ul",
          { id: "todos" },
          this.state.tasks.map(
              (task) =>
                  new Task(
                      task,
                      () => this.onToggleTask(task.id),
                      () => this.onDeleteTask(task.id)
                  )
          )
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});