//app.js
// підключаємо необхідні модулі
const http = require("http");
const Controller = require("./controller");
const Converter = require('./dataConverter');

// налаштовуємо порт
const PORT = process.env.PORT || 5000;

// створюємо сервер
const server = http.createServer(async (req, res) => {  

    // визначаємо тип даних для спілкування з сервером та клієнтом
    let defineRequestedContentType = function (url) {
        if (url.indexOf('xml') !== -1) return { "Content-Type": "application/xml" };
        if (url.indexOf('encoded') !== -1) return { "Content-Type": "application/x-www-form-urlencoded" };        
        if (url.indexOf('json') !== -1) return { "Content-Type": "application/json" };
    };

    // конвертація JSON даних в різноманітні формати
    let convert = function (url, data) {
        if (url.indexOf('xml') !== -1) return new Converter(data).jsonToXml();
        if (url.indexOf('encoded') !== -1) return new Converter(data).urlEncoded();        
        if (url.indexOf('json') !== -1) return new Converter(data).json();
    };

    let contentType = defineRequestedContentType(req.url);
    
    // /api/todos : GET
    if (req.url.match(/^\/api\/(xml|json|encoded)\/todos$/g) && req.method === "GET") {
        // отримуємо завдання
        const todos = await new Controller().getTodos();
        // встановлюємо response статус і тип контенту 
        res.writeHead(200, contentType);
        // відправляємо дані на клієнт
        res.end(convert(req.url, todos));
    }

    // /api/todos/:id : GET
    else if (req.url.match(/\/api\/(xml|json|encoded)\/todos\/([0-9]+)/) && req.method === "GET") {
        try {
            // отримуємо ідентифікатор з url
            const id = req.url.split("/")[4];
            // отримуємо завдання
            const todo = await new Controller().getTodo(id);
            // встановлюємо response статус і тип контенту
            res.writeHead(200, contentType);
            // відправляємо дані на клієнт
            res.end(convert(req.url, todo));
        } catch (error) {
            // якщо помилка, то встановлюємо responsе статус 404 і тип контенту 
            res.writeHead(404, contentType);
            // відправляємо помилку на клієнт
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/todos/:id : DELETE
    else if (req.url.match(/\/api\/(xml|json|encoded)\/todos\/([0-9]+)/) && req.method === "DELETE") {
        try {
            // отримуємо ідентифікатор з url
            const id = req.url.split("/")[4];
            // видаляємо завдання
            let message = await new Controller().deleteTodo(id);
            // встановлюємо response статус і тип контенту
            res.writeHead(200, contentType);
            // відправляємо дані на клієнт
            res.end(JSON.stringify({ message }));
        } catch (error) {
            // якщо помилка, то встановлюємо responsе статус 404 і тип контенту 
            res.writeHead(404, contentType);
            // відправляємо помилку на клієнт
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/todos/:id : UPDATE
    else if (req.url.match(/\/api\/(xml|json|encoded)\/todos\/([0-9]+)/) && req.method === "PATCH") {
        try {
            // отримуємо ідентифікатор з url
            const id = req.url.split("/")[4];
            // оновлюємо дані завдання
            let updated_todo = await new Controller().updateTodo(id);
            //встановлюємо response статус і тип контенту
            res.writeHead(200, contentType);
            // відправляємо дані на клієнт
            res.end(convert(req.url, updated_todo));
        } catch (error) {
            // якщо помилка, то встановлюємо responsе статус 404 і тип контенту 
            res.writeHead(404, contentType);
            // відправляємо помилку на клієнт
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/todos/ : POST
    else if (req.url.match(/\/api\/(xml|json|encoded)\/todos/) && req.method === "POST") {
        // створюємо нове завдання
        let todo = await new Controller().createTodo();
        // встановлюємо response статус і тип контенту
        res.writeHead(200, contentType);
        // відправляємо дані на клієнт
        res.end(convert(req.url, todo));
    }

    // якщо посилання не існує, або недоступне
    else {
        // встановлюємо responsе статус 404 і тип контенту 
        res.writeHead(404, {"Content-type": "text/html; charset=utf-8"});
        // відправляємо помилку на клієнт
        res.end("<b>404 Page not found!</b>\n\n- The requeted content type is not specified.\n\n- The url must has a content type parameter such as [xml] or [json] or [encoded]\n\n- Example: http://localhost:[port]/[xml|json|encoded]/[parametr]");    }
});

// прослуховуваємо сервер
server.listen(PORT, () => {
    console.log(`[- - - - Server started on port: ${PORT} - - - -]`);
});