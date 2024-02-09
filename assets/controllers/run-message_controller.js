import { Controller } from '@hotwired/stimulus';
import axios from 'axios';

/*
 * This is an example Stimulus controller!
 *
 * Any element with a data-controller="hello" attribute will cause
 * this controller to be executed. The name "hello" comes from the filename:
 * hello_controller.js -> "hello"
 *
 * Delete this file or adapt it for your use!
 */
export default class extends Controller {
    connect() {

        let flag = false;
        let messagesBus = [];
        let allMessages;
        let maxId = 0;

        const startStopButton = document.getElementById('start-stop-btn');
        const testButton = document.getElementById('test-btn');
        const messageArea = document.getElementById('message-area');

        startStopButton.addEventListener('click', async () => {
            console.log(flag);
            if(flag === false) {
                startStopButton.textContent = 'Stop';
                flag = true;
                await start();
            } else {
                startStopButton.textContent = 'Start';
                flag = false;
                document.getElementById('message-area').innerHTML = '';
            }
        });

        testButton.addEventListener('click', () => {
            console.log('test');
            messagesBus.splice(4,1)
            console.log('élément retiré');

        });

        async function start() {
            allMessages = await getMessages(maxId, 'read');
            console.log('initialisation read messages', allMessages.length);
            await Promise.all([runDisplayLoop(), runApiCallLoop()]);
        }

        async function runDisplayLoop() {
            let indexMessage = 0;
            while(flag) {
                if (messagesBus.length > 0) {
                    console.log('messagesBus à traiter', messagesBus.length);
                    const messageToDisplay = messagesBus.shift();
                    displayOneMessage(messageToDisplay);
                    allMessages.push(messageToDisplay);
                } else {
                    displayOneMessage(allMessages[indexMessage]);
                    indexMessage++;
                    if(indexMessage === allMessages.length) {
                        indexMessage = 0;
                    }
                }

                await sleep(1000);
            }
        }

        async function runApiCallLoop() {

            console.log('initialisation messageBus', messagesBus.length);
            console.log('initialisation maxId', maxId);

            while(flag) {
                const newMessages = await getMessages(maxId, 'unread');
                console.log('new unread messages', newMessages.length);
                maxId = newMessages.length ? newMessages.reduce((maxId, message) => Math.max(maxId, message.id), -1) : maxId;
                console.log('new maxId', maxId);
                mergeMessages(messagesBus, newMessages);
                console.log('merge done messageBus', messagesBus.length);
                await sleep(1000);
            }
        }
        function displayOneMessage(message) {
            // Créez un élément de paragraphe
            const p = document.createElement('p');
            p.textContent = message.content;
            // Ajoutez le paragrahe à la page
            messageArea.appendChild(p);
        }

        async function getMessages(index, status) {
            const apiUrl = `/message/get/${index}/${status}`;
            try {
                const response = await axios.get(apiUrl);
                console.log(response.data.messages);
                return response.data.messages;
            } catch (error) {
                console.error('Erreur de l\'appel API :', error);
                throw error;
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function mergeMessages(messagesBus, messages) {
            // Filtrer les messages qui ne sont pas encore dans messageBus
            let nouveauxMessages = messages.filter(message => !messagesBus.some(busMessage => busMessage.id === message.id));
            // Ajouter les nouveaux messages à messageBus
            messagesBus.push(...nouveauxMessages);
        }

        //this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';

        function displayMessages(messages) {
            // Créez un élément de liste
            const messageArea = document.getElementById('message-area')
            const ul = document.createElement('ul');
            // Parcourez les messages
            messages.forEach(message => {
                // Créez un élément de liste
                console.log(message.content);
                const li = document.createElement('li');
                li.textContent = message.content;
                // Ajoutez le message à la liste
                ul.appendChild(li);
            });
            console.log(ul);
            // Ajoutez la liste à la page
            messageArea.appendChild(ul);
        }
    }
}
