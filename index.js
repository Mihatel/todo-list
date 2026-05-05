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
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
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
      createElement("div", { class: "add-todo" }, [
        createElement(
            "input",
            {
              id: "new-todo",
              type: "text",
              placeholder: "Задание",
              value: this.state.inputValue,
            },
            null,
            { input: this.onAddInputChange }
        ),
        createElement("button", { id: "add-btn" }, "+", {
          click: this.onAddTask,
        }),
      ]),
      createElement(
          "ul",
          { id: "todos" },
          this.state.tasks.map((task) =>
              createElement("li", {}, [
                createElement(
                    "input",
                    { type: "checkbox", checked: task.completed ? "checked" : null },
                    null,
                    { change: () => this.onToggleTask(task.id) }
                ),
                createElement(
                    "label",
                    { class: task.completed ? "completed" : "" },
                    task.text
                ),
                createElement("button", {}, "🗑️", {
                  click: () => this.onDeleteTask(task.id),
                }),
              ])
          )
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});