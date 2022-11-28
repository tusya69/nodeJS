// controller.js
const data = require("./data");
const fs = require('fs');

class Controller {
    // отримуємо всі завдання
    async getTodos() {
        // надсилаємо всі завдання
        return new Promise((resolve, _) => resolve(data));
    }

    // отримуємо одне завдання
    async getTodo(id) {
        return new Promise((resolve, reject) => {
            // отримуємо завдання
            let todo = data.find((todo) => todo.id === parseInt(id));
            if (todo) {
                // надсилаємо завдання
                resolve(todo);
            } else {
                // відображаємо помилку якщо ідентифікатор завдання не було знайдено
                reject(`Todo with id ${id} not found `);
            }
        });
    }

    // створюємо завдання
    async createTodo() {
        return new Promise((resolve, _) => {
            // створюємо завдання, з рандомним id та надісланими даними
            let newTodo = {
                id: Math.max(...data.map(todo => +todo.id)) + 1,
                title: "New Task",
                description: "update timing",
                completed: false
            };
            // Записуємо нове завдання у файл
            data.push(newTodo);
            // надсилаємо новий створений запис
            fs.writeFile('data.json', JSON.stringify(data), 'utf-8', () => {
                resolve(newTodo);
            });
        });
    }

    // оновлюємо завдання
    async updateTodo(id) {
        return new Promise((resolve, reject) => {
            // отримуємо завдання
            let todo = data.find((todo) => todo.id === parseInt(id));
            // якщо не отримуємо, повертаємо помилку
            if (!todo) {
                reject(`No todo with id ${id} found`);
            }
            // інакше оновлюємо статус завдання як виконане
            todo["completed"] = true;
            // записуємо у файл результат
            fs.writeFile('data.json', JSON.stringify(data), 'utf-8', () => {
                // повертаємо оновлене завдання
                resolve(todo);
            });
        });
    }

    // видаляємо завдання
    async deleteTodo(id) {
        return new Promise((resolve, reject) => {
            // отримуємо ідентифікаційний номер завдання
            let todo = data.findIndex((todo) => todo.id === parseInt(id));
            // якщо не отримуємо, повертаємо помилку
            if (!todo) {
                reject(`No todo with id ${id} found`);
            }
            // видаляємо завдання з файлу (бази даних)
            data.splice(todo, 1);
            // записуємо у файл результат
            fs.writeFile('data.json', JSON.stringify(data), 'utf-8', () => {
                // повертаємо повідомлення про успішне видалення запису 
                resolve(`Todo deleted successfully`);
            });

        });
    }
}
module.exports = Controller;