# Распределение задач TODO List

## ТЫ (Первый разработчик)

### Задачи: 1, 2, 3, 4

#### Задача 1: State и рефакторинг render
**Файлы:** `index.js`
- Добавить в конструктор `TodoList` объект `state` с массивом задач
- Переписать метод `render()` — итерироваться по `state` вместо хардкода трех задач

#### Задача 2: Добавление задач (события)
**Файлы:** `index.js`
- Улучшить функцию `createElement` — добавить 4-й параметр `events` (объект с коллбэками)
- Создать методы `onAddTask()` и `onAddInputChange()` в классе `TodoList`
- Навесить обработчики: `onAddTask` на кнопку "+", `onAddInputChange` на input
- `onAddInputChange` сохраняет текст из input в `state`
- `onAddTask` добавляет новую задачу в `state.tasks`

#### Задача 3: Метод update
**Файлы:** `index.js`
- Создать метод `update()` в классе `Component`
- Метод должен вызывать `render()` и заменять старую DOM-ноду на новую
- Вызывать `update()` после изменения `state`

#### Задача 4: Стили выполненных задач и удаление
**Файлы:** `index.js`, `index.css`
- Добавить обработчик на checkbox — помечать задачу как выполненную
- Добавить CSS-класс для выполненных задач (серый цвет текста)
- Реализовать удаление задачи по клику на кнопку "🗑️"

**Коммит:**
```
Implement state management, task addition, update mechanism, and task deletion

- Add state object to TodoList constructor with tasks array
- Refactor render() to iterate over state instead of hardcoded tasks
- Enhance createElement to accept event callbacks
- Add onAddTask and onAddInputChange methods
- Implement Component.update() for re-rendering
- Add task completion toggle with gray text styling
- Implement task deletion functionality
```

---

## СОКОМАНДНИК (Второй разработчик)

### Задачи: 5, 6

#### Задача 5: Разделение на компоненты
**Файлы:** `index.js`
- Создать класс `AddTask extends Component`
  - Принимает в конструктор коллбэк `onAddTask`
  - Рендерит форму добавления задачи
- Создать класс `Task extends Component`
  - Принимает в конструктор: `task` (объект задачи), `onToggle`, `onDelete`
  - Рендерит один элемент списка (li)
- Переписать `TodoList.render()`:
  - Использовать `new AddTask(...)` вместо прямого createElement для формы
  - Использовать `new Task(...)` для каждой задачи в цикле

#### Задача 6: Защита от дурака при удалении
**Файлы:** `index.js`, `index.css`
- Добавить в `state` компонента `Task` поле `deleteConfirmation` (boolean)
- При первом клике на "🗑️":
  - Установить `deleteConfirmation = true`
  - Изменить цвет кнопки на красный (добавить класс или inline-стиль)
- При втором клике:
  - Вызвать `onDelete` (реально удалить задачу)
- Добавить CSS для красной кнопки удаления

**Коммит:**
```
Refactor into separate components and add delete confirmation

- Extract AddTask component with callback prop
- Extract Task component with toggle and delete callbacks
- Update TodoList to use new components
- Add two-step delete confirmation (red button on first click)
- Store delete confirmation state in Task component
```

---

## ОПЦИОНАЛЬНО (если останется время)

### Задача 7: localStorage (любой из вас)
**Файлы:** `index.js`
- Сохранять `state.tasks` в `localStorage` при каждом изменении
- При загрузке страницы читать из `localStorage` и инициализировать `state`

### Задача 8: Сохранение state детей при ререндере (вместе)
**Файлы:** `index.js`
- Сложная задача: нужно сохранять `state` дочерних компонентов при изменении `props`
- Требует изменения логики `update()` и механизма reconciliation

---

## Порядок работы

1. **ТЫ** делаешь задачи 1-4 последовательно → коммитишь
2. **СОКОМАНДНИК** берет твой код и делает задачи 5-6 → коммитит
3. (Опционально) Задачи 7-8 по желанию

## Файлы, которые будут изменены

- `index.js` — основной файл (оба разработчика)
- `index.css` — стили (оба разработчика, минимально)
- `index.html` — не трогаем
