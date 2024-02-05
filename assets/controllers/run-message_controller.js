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

        const startStopButton = document.getElementById('start-stop-btn');
        startStopButton.addEventListener('click', () => {
            if(flag === false) {
                startStopButton.textContent = 'Stop';
                flag = true;
                //runDisplay();
                runApiCall();
            } else {
                startStopButton.textContent = 'Start';
                flag = false;
                document.getElementById('message-area').innerHTML = '';
            }
            console.log(flag);
        });

        async function getMessages(route) {
            const apiUrl = '/message/get-'+route;
            try {
                const response = await axios.get(apiUrl);
                console.log(response.data.messages);
                return response.data.messages;
            } catch (error) {
                console.error('Erreur de l\'appel API :', error);
                throw error;
            }
        }

        async function runDisplay() {
            while(flag) {
                await sleep(1000);
                run();
            }
        }

        async function runApiCall() {

            allMessages = await getMessages('read');
            console.log('initialisation', allMessages.length);
            console.log('initialisation', messagesBus.length);

            while(flag) {
                const messages = await getMessages('unread');
                messagesBus = mergeMessages(messagesBus, messages);
                console.log('merge done', messagesBus.length);
                console.log('api call done', messagesBus.length);
                await sleep(1000);
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function mergeMessages(messagesBus, messages) {
            // Fusionner les tableaux sans doublons
            return messagesBus.concat(
                messages.filter(newMsg => !messagesBus.some(existingMsg => existingMsg.id === newMsg.id))
            );
        }



        // async function getUnreadMessages()  {
        //     const apiUrl = '/message/get-unread';
        //     try {
        //         const response = await axios.get(apiUrl);
        //         console.log(response.data.messages);
        //         return response.data.messages;
        //     } catch (error) {
        //         console.error('Erreur de l\'appel API :', error);
        //         throw error;
        //     }
        // }

        // async function getReadMessages()  {
        //     const apiUrl = '/message/get-read';
        //     try {
        //         const response = await axios.get(apiUrl);
        //         console.log(response.data.messages);
        //         return response.data.messages;
        //     } catch (error) {
        //         console.error('Erreur de l\'appel API :', error);
        //         throw error;
        //     }
        // }

        // async function getReadMessages()  {
        //     const apiUrl = '/message/get-all';
        //     try {
        //         const response = await axios.get(apiUrl);
        //         console.log(response.data.messages);
        //         return response.data.messages;
        //     } catch (error) {
        //         console.error('Erreur de l\'appel API :', error);
        //         throw error;
        //     }
        // }


        this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';

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

        function displayOneMessage(message) {
            // Créez un élément de paragraphe
            const p = document.createElement('p');
            p.textContent = message;
            // Ajoutez le paragrahe à la page
            document.body.appendChild(p);
        }


    }
}
