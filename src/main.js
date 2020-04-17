import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.formElement = document.getElementById('repo-form');
        this.inputElement = document.querySelector('input[name=repository]');
        this.listElement = document.getElementById('repo-list');
        this.buttonElement = document.querySelector('button[type=submit]');
        
        this.registerHandlers();
        this.render();
    }


    registerHandlers() {
        this.formElement.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true) {
        if(loading === true) {

            let loadingElement = document.createElement('span');
            loadingElement.setAttribute('class', 'spinner-border spinner-border-sm');
            loadingElement.setAttribute('role', 'status');
            loadingElement.setAttribute('aria-hidden', 'true');

            this.buttonElement.setAttribute('disabled', 'true');
            this.buttonElement.innerHTML = '';
            this.buttonElement.appendChild(loadingElement);

        } else {
            this.buttonElement.removeAttribute('disabled');
            this.buttonElement.innerHTML = 'Find/add';
        }
    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputElement.value;

        if (repoInput.length === 0) return;
        
        try {
            this.setLoading();

            const response = await api.get(`/repos/${repoInput}`)

            const { name, description, owner: { avatar_url }, html_url } = response.data
        
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            })

            this.inputElement.value = '';

            this.render();   
        } catch (error) {
            alert('This repository not exists!');
        } finally {
            this.setLoading(false);
        }
    }

    render() {
        this.listElement.innerHTML = '';

        if(this.repositories.length === 0) {
            let textElement = document.createElement('span');
            textElement.setAttribute('class', 'empty-list');
            textElement.appendChild(document.createTextNode('# Empty list... Add a repository!'));
            this.listElement.appendChild(textElement);
        }

        this.repositories.forEach(repo => {
            let imageElement = document.createElement('img');
            imageElement.setAttribute('src', repo.avatar_url);
            
            let titleElement = document.createElement('strong');
            titleElement.appendChild(document.createTextNode(repo.name));

            let descriptionElement = document.createElement('p');
            descriptionElement.appendChild(document.createTextNode(repo.description !== null ? repo.description : 'Este reposiório não possui uma descrição.'));

            let listItemElement = document.createElement('a');
            listItemElement.setAttribute('class', 'list-group-item list-group-item-action')
            listItemElement.setAttribute('target', '_blank');
            listItemElement.setAttribute('href', repo.html_url);
            listItemElement.setAttribute('title', 'Go to repository');
            listItemElement.appendChild(imageElement);
            listItemElement.appendChild(titleElement);
            listItemElement.appendChild(descriptionElement);
            this.listElement.appendChild(listItemElement);
        })
    }
}

new App();