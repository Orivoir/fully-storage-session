function prepareTodo() {

    const paraEmptyTodo = document.querySelector('.work-finish');
    paraEmptyTodo.parentNode.removeChild( paraEmptyTodo );

    const todosListWrap = document.querySelector('.todo-list-side');

    const list = document.createElement('ul');

    list.classList.add('todos-list');

    todosListWrap.appendChild( list );
}

function appendTodo( text ) {

    let todolist = document.querySelector('.todos-list');

    if( !todolist ) {

        // first todo list not exists
        prepareTodo();
    }

    todolist = document.querySelector('.todos-list');

    const item = document.createElement('li');

    item.classList.add('todos-item');

    item.innerHTML = `
        <div>
            <p>${text}</p>
        </div>
    `;

    todolist.appendChild( item );
}

document.addEventListener('DOMContentLoaded', () => {


    document.querySelector('form').addEventListener('submit', function( e ) {

        e.preventDefault();

        const text = this['todo'].value;

        this['todo'].value = "";

        fetch( this.getAttribute('action'), {

            method: 'POST',

            body: `todo=${text}`,

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } )
        .then( async response => {

            const data = await response.json();

            if( data.statusCode === 201 ) { // created

                appendTodo( text );

            } else {

                console.warn('append todo is reject with:', data );
            }

        } )
        .catch( error => {

            console.error( error );

            throw "fetch POST todo have fail";

        } );

    } );

} );
