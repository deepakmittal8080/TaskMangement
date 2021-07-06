const Status = {
	Todo: 'todo',
	InProgress: 'inprogress',
	Done: 'done'
};

const LIST_NAME = 'todoList';

// Extract List from Local Storage
const getListFromLocalStorage = () => {
	let todoList = {};
	let tempList = localStorage.getItem(LIST_NAME);
	if (tempList) todoList = JSON.parse(tempList);
	return todoList;
}

// Store List In Local Storage
const storeListInLocalStorage = (list) => {
	localStorage.setItem(LIST_NAME, JSON.stringify(list));
}


// Add Event Listener for Drag and Drop
const addEventListinerToElement = () => {
	const lists = document.querySelectorAll('.list');
	let draggedItem = null;

	const list_items = document.querySelectorAll('.list-item');

	for (let i = 0; i < list_items.length; i++) {
		const item = list_items[i];

		item.addEventListener('dragstart', function () {
			draggedItem = item;
			setTimeout(function () {
				item.style.display = 'none';
			}, 0)
		});

		item.addEventListener('dragend', function () {
			setTimeout(function () {
				draggedItem.style.display = 'block';
				draggedItem = null;
			}, 0);
		})

		for (let j = 0; j < lists.length; j++) {
			const list = lists[j];

			list.addEventListener('dragover', function (e) {
				e.preventDefault();
			});

			list.addEventListener('dragenter', function (e) {
				e.preventDefault();
				this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
			});

			list.addEventListener('dragleave', function (e) {
				this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
			});

			list.addEventListener('drop', function (e) {
				// Change Task Status
				const list = getListFromLocalStorage();
				if (draggedItem?.id) {
					let status = Status.Todo;
					if (this.id === Status.InProgress) status = Status.InProgress;
					if (this.id === Status.Done) status = Status.Done;

					list[draggedItem.id] = {...list[draggedItem.id],status};
					storeListInLocalStorage(list);
				}
				this.append(draggedItem);
				this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
			});
		}
	}
}

window.onload = function () {
	const todoList = getListFromLocalStorage();
	const lists = document.querySelectorAll('.list');
	let tempArr = Object.values(todoList);

	tempArr.forEach((el, index) => {
		let item = document.createElement('div');
		item.className = 'list-item';
		item.draggable = true;
		item.id = index;

		let title = document.createElement('h3');
		title.className = 'list-item-title';
		title.innerHTML = el.title
		item.append(title);

		let description = document.createElement('p');
		description.className = 'list-item-desc';
		description.innerHTML = el.description
		item.append(description);

		if (el.status === Status.Todo) lists[0].append(item);
		else if (el.status === Status.InProgress) lists[1].append(item);
		else if (el.status === Status.Done) lists[2].append(item);
	});

	addEventListinerToElement();
};


// Handle Task in List
function handleAdd() {
	// Create Task
	const title = document.getElementById('title');
	const description = document.getElementById('description');
	const task = { title: title.value, description: description.value, status: Status.Todo };

	// Store Task In List
	const list = getListFromLocalStorage();
	list[Object.keys(list).length] = task;
	storeListInLocalStorage(list);
}