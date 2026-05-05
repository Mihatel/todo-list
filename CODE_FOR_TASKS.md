# Код для реализации задач

## ТЫ (Задачи 1-4)

### Полный код index.js (твоя версия после задач 1-4)

```javascript
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
```

### Дополнения в index.css (добавь в конец файла)

```css
.todo-list li label.completed {
    color: #999;
    text-decoration: line-through;
}
```

---

## СОКОМАНДНИК (Задачи 5-6)

### Полный код index.js (версия сокомандника после задач 5-6)

```javascript
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
```

### Дополнения в index.css (добавить в конец файла)

```css
.todo-list li label.completed {
    color: #999;
    text-decoration: line-through;
}

button.delete-confirm {
    background-color: #dc3545;
}
```

---

## Инструкция по применению

### Для тебя (задачи 1-4):
1. Замени весь `index.js` на код из раздела "ТЫ"
2. Добавь CSS для `.completed` в конец `index.css`
3. Проверь работу в браузере
4. Коммит: `git commit -m "Implement state management, task addition, update mechanism, and task deletion"`

### Для сокомандника (задачи 5-6):
1. Возьми твой коммит
2. Замени весь `index.js` на код из раздела "СОКОМАНДНИК"
3. Добавь CSS для `.delete-confirm` в конец `index.css`
4. Проверь работу в браузере
5. Коммит: `git commit -m "Refactor into separate components and add delete confirmation"`

---

## ТЫ (Задача 7 со звездочкой) - localStorage

### Изменения в index.js

Замени конструктор `TodoList` и методы `onAddTask`, `onToggleTask`, `onDeleteTask`:

```javascript
class TodoList extends Component {
  constructor() {
    super();
    
    // Загружаем данные из localStorage или используем дефолтные
    const savedTasks = localStorage.getItem('todoTasks');
    const savedNextId = localStorage.getItem('todoNextId');
    
    this.state = {
      tasks: savedTasks ? JSON.parse(savedTasks) : [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false },
      ],
      inputValue: "",
      nextId: savedNextId ? parseInt(savedNextId) : 4,
    };
  }

  saveToLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.state.tasks));
    localStorage.setItem('todoNextId', this.state.nextId.toString());
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
    this.saveToLocalStorage();
    this.update();
  };

  onToggleTask = (id) => {
    const task = this.state.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToLocalStorage();
      this.update();
    }
  };

  onDeleteTask = (id) => {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
    this.saveToLocalStorage();
    this.update();
  };

  // render() остается без изменений
}
```

**Коммит:**
```
Add localStorage persistence for tasks

- Load tasks from localStorage on initialization
- Save tasks to localStorage after add, toggle, and delete operations
- Persist nextId counter across page reloads
```

---

## СОКОМАНДНИК (Задача 8 со звездочкой) - Сохранение state детей при ререндере

Это сложная задача. Нужно изменить механизм update, чтобы он не пересоздавал компоненты, а переиспользовал существующие.

### Изменения в index.js

Замени класс `Component` и метод `createElement`:

```javascript
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
    this._childComponents = [];
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    // Сохраняем старые дочерние компоненты
    const oldChildren = this._childComponents;
    this._childComponents = [];
    
    const newNode = this.render();
    
    // Пытаемся переиспользовать старые компоненты
    this._childComponents.forEach((newChild, index) => {
      const oldChild = oldChildren[index];
      if (oldChild && oldChild.constructor === newChild.constructor) {
        // Обновляем props старого компонента
        Object.assign(oldChild, newChild);
        // Заменяем новый компонент на старый (с сохраненным state)
        this._childComponents[index] = oldChild;
        oldChild.update();
      }
    });
    
    this._domNode.replaceWith(newNode);
    this._domNode = newNode;
  }

  _registerChild(component) {
    this._childComponents.push(component);
    return component;
  }
}
```

Замени метод `render()` в `TodoList`, чтобы регистрировать дочерние компоненты:

```javascript
class TodoList extends Component {
  // constructor и методы остаются без изменений
  
  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      this._registerChild(
        new AddTask(
          this.onAddTask,
          this.onAddInputChange,
          this.state.inputValue
        )
      ),
      createElement(
        "ul",
        { id: "todos" },
        this.state.tasks.map(
          (task) =>
            this._registerChild(
              new Task(
                task,
                () => this.onToggleTask(task.id),
                () => this.onDeleteTask(task.id)
              )
            )
        )
      ),
    ]);
  }
}
```

**Важно:** Эта реализация базовая и не покрывает все edge cases (например, изменение количества задач). Полноценное решение требует более сложного алгоритма reconciliation (как в React).

**Коммит:**
```
Preserve child component state during parent re-render

- Add child component registration mechanism
- Implement component reuse in update() method
- Match old and new components by constructor
- Update props while preserving internal state
```

---

## Итоговое распределение со звездочками

**ТЫ:**
- Задачи 1-4 (основные)
- Задача 7 (localStorage) - проще, независимая

**СОКОМАНДНИК:**
- Задачи 5-6 (компоненты)
- Задача 8 (сохранение state детей) - сложнее, требует понимания архитектуры компонентов
