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

        // CONSTANTES
        let flag = false;
        let messagesBus = [];
        let allMessages;
        let maxId = 0;
        let maxPostIt = 10;
        let currentPostIt = 3;
        let pastelColors = [
            '#FFD1DC', '#FFA07A', '#FFDEAD', '#FFD700', '#FF69B4', '#FF6347', '#FF4500', '#FF1493', '#FF00FF',
            '#FF00FF', '#FF1493', '#FF4500', '#FF6347', '#FF69B4', '#FFD700', '#FFDEAD', '#FFA07A', '#FFD1DC',
            '#ffffcc', '#ffcc99', '#ffcccc', '#ff99cc', '#ffccff', '#cc99ff', '#ccccff', '#99ccff', '#ccffff', '#99ffcc',
            '#ccffcc', '#ccff99'
        ];
        // Fonction pour générer un entier aléatoire entre min et max inclus
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const blackboard = document.getElementById('blackboard');

        document.addEventListener('click', (event) => {
            // afficher les coordonnées de la souris
            console.log(event.clientX, event.clientY);
        });

        document.addEventListener('keydown', async (event) => {
            console.log(event.key);
            if(event.key === 's') {
                console.log('initial flag : ', flag);
                console.log('let\'s start');
                if(flag === false) {
                    flag = true;
                    console.log('new flag : ', flag);
                    await start();
                } else {
                    flag = false;
                    console.log('new flag : ', flag);
                }
            }
            if (event.key === 't') {
                console.log('test');
                createPostItTest();
            }
        });

        async function start() {
            console.log('init getting messages read');
            if (!allMessages) {
                console.log('init allMessages read', allMessages);
                allMessages = await getMessages(maxId, 'read');
                console.log('allMessages read gotten', allMessages);
            }

            for (const message of allMessages) {
                await handleMessage(message, true, 100);
                await sleep(100);
            }
            console.log('initialisation read messages', allMessages.length);
            await Promise.all([runDisplayLoop(), runApiCallLoop()]);
        }

        async function runDisplayLoop() {
            let indexMessage = 0;
            while(flag) {
                await sleep(3000);
                if (messagesBus.length > 0) {
                    console.log('messagesBus à traiter', messagesBus.length);
                    const messageToDisplay = messagesBus.shift();
                    await handleMessage(messageToDisplay, true, 2000);
                    allMessages.push(messageToDisplay);
                    await changeMessageStatus(messageToDisplay.id, 'read');
                } else {
                    console.log('aucun nouveau message à traiter', 'index', indexMessage, 'allMessages', allMessages.length);
                    if (!allMessages.length) {
                        console.log('no messages')
                        continue
                    }
                    await handleMessage(allMessages[indexMessage], true, 2000);
                    indexMessage++;
                    if(indexMessage === allMessages.length) {
                        indexMessage = 0;
                    }
                }
            }
        }

        async function runApiCallLoop() {

            console.log('taille messageBus', messagesBus.length);
            console.log('check maxId', maxId);

            while(flag) {
                const newMessages = await getMessages(maxId, 'unread');
                console.log('new unread messages', newMessages.length);
                maxId = newMessages.length ? newMessages.reduce((maxId, message) => Math.max(maxId, message.id), -1) : maxId;
                console.log('new maxId', maxId);
                mergeMessages(messagesBus, newMessages);
                console.log('merge done messageBus', messagesBus.length);
                await sleep(2000);
            }
        }

        function incrementCurrentPostIt() {
            const nbEltByClass = document.getElementsByClassName('pos' + currentPostIt).length;

            if (nbEltByClass > 5) {
                //supprimer le premier élément de la classe
                const firstElt = document.getElementsByClassName('pos' + currentPostIt)[0];
                firstElt.remove();
            }

            currentPostIt++;
            if (currentPostIt > maxPostIt) {
                currentPostIt = 1;
            }
        }

        function createPostItText(message) {
            if (!message.content) {
                return null;
            }
            const postItText = document.createElement('div');
            const title = document.createElement('h2');
            const content = document.createElement('p');

            title.textContent = message.author;
            content.textContent = message.content;

            postItText.appendChild(title);
            postItText.appendChild(content);

            return postItText;
        }

        function createPostItImage(message) {
            if (!message.image) {
                return null;
            }
            const postItImage = document.createElement('div');
            const title = document.createElement('h2');
            const image = document.createElement('img');

            title.textContent = message.author;
            image.src = `/media/cache/my_thumb/uploads/images/post_it/${message.image}`;

            postItImage.appendChild(title);
            postItImage.appendChild(image);

            return postItImage;
        }

        function addStyleToPostIt(postIt) {
            postIt.classList.add('post-it');
            postIt.classList.add('pos' + currentPostIt);
            postIt.style.backgroundColor = pastelColors[getRandomInt(0, pastelColors.length - 1)];
            return postIt;
        }

        async function handleMessage(message, animate = true, animationDuration = 1000) {
            console.log('createPostIt', message);

            let postItText = createPostItText(message);
            let postItImage = createPostItImage(message);

            if (postItText && postItImage) {
                postItText = addStyleToPostIt(postItText);
                incrementCurrentPostIt();
                postItImage = addStyleToPostIt(postItImage);
                incrementCurrentPostIt();
                await displayDoublePostIt(postItText, postItImage, animate, animationDuration);
                return;
            }

            let postIt = postItText || postItImage;
            postIt = addStyleToPostIt(postIt);
            incrementCurrentPostIt();
            await displayOnePostIt(postIt, animate, animationDuration);
        }

        async function displayOnePostIt(postIt, animate, animationDuration) {
            console.log('createdPostIt', postIt);
            blackboard.appendChild(postIt);


            // Animer le div pour qu'il apparaisse au centre puis se place dans la grille
            if (animate) {
                const rect = postIt.getBoundingClientRect();

                postIt.style.minHeight = rect.width + 'px';


                console.log('rect', rect);
                let absCenter = rect.x + rect.width/2;
                let ordCenter = rect.y + rect.height/2;
                postIt.animate([
                    {opacity: 0, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(0) `, offset: 0},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(2) `, offset: 0.2},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(2) `, offset: 0.8},
                    {opacity: 1, transform: `translate(0, 0) scale(1) rotate(${getRandomInt(-10, 10)}deg`}
                ], {
                    // Durée de l'animation : 3 secondes
                    duration: animationDuration,
                    // Mode de remplissage : conserver le style final
                    fill: "forwards"
                });
            }
        }

        async function displayDoublePostIt(postItText, postItImage, animate, animationDuration) {
            console.log('createdPostIt', postItText);
            console.log('createdPostIt', postItImage);
            blackboard.appendChild(postItText);
            blackboard.appendChild(postItImage);

            //await sleep(1000);

            // Animer le div pour qu'il apparaisse au centre puis se place dans la grille
            if (animate) {


                const rectText = postItText.getBoundingClientRect();
                const rectImage = postItImage.getBoundingClientRect();

                postItText.style.minHeight = rectText.width + 'px';
                postItImage.style.minHeight = rectImage.width + 'px';


                console.log('rect', rectText);
                let absCenterText = rectText.x + rectText.width/2;
                let ordCenterText = rectText.y + rectText.height/2;

                let absCenterImage = rectImage.x + rectImage.width/2;
                let ordCenterImage = rectImage.y + rectImage.height/2;

                postItText.animate([
                    {opacity: 0, transform: `translate(${window.innerWidth/2 - absCenterText - rectText.width - 20}px, ${window.innerHeight/2 - ordCenterText}px) scale(0) `, offset: 0},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenterText - rectText.width - 20}px, ${window.innerHeight/2 - ordCenterText}px) scale(2) `, offset: 0.2},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenterText - rectText.width - 20}px, ${window.innerHeight/2 - ordCenterText}px) scale(2) `, offset: 0.8},
                    {opacity: 1, transform: `translate(0, 0) scale(1) rotate(${getRandomInt(-10, 10)}deg`}
                ], {
                    // Durée de l'animation : 3 secondes
                    duration: animationDuration,
                    // Mode de remplissage : conserver le style final
                    fill: "forwards"
                });
                postItImage.animate([
                    {opacity: 0, transform: `translate(${window.innerWidth/2 - absCenterImage + rectImage.width + 20}px, ${window.innerHeight/2 - ordCenterImage}px) scale(0) `, offset: 0},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenterImage + rectImage.width + 20}px, ${window.innerHeight/2 - ordCenterImage}px) scale(2) `, offset: 0.2},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenterImage + rectImage.width + 20}px, ${window.innerHeight/2 - ordCenterImage}px) scale(2) `, offset: 0.8},
                    {opacity: 1, transform: `translate(0, 0) scale(1) rotate(${getRandomInt(-10, 10)}deg`}
                ], {
                    // Durée de l'animation : 3 secondes
                    duration: animationDuration,
                    // Mode de remplissage : conserver le style final
                    fill: "forwards"
                });
            }
        }

        async function getMessages(index, status) {
            const apiUrl = `/admin/message/get/${index}/${status}`;
            try {
                const response = await axios.get(apiUrl);
                console.log('messages', response.data.messages);
                return response.data.messages;
            } catch (error) {
                console.error('Erreur de l\'appel API :', error);
                return [];
            }
        }

        async function changeMessageStatus(id, status) {
            const apiUrl = `/admin/message/${id}/${status}`;
            try {
                const response = await axios.get(apiUrl);
                console.log('messages', response.data);
                return response.data;
            } catch (error) {
                console.error('Erreur de l\'appel API :', error);
                return [];
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

        // function displayMessages(messages) {
        //     // Créez un élément de liste
        //     const messageArea = document.getElementById('message-area')
        //     const ul = document.createElement('ul');
        //     // Parcourez les messages
        //     messages.forEach(message => {
        //         // Créez un élément de liste
        //         console.log(message.content);
        //         const li = document.createElement('li');
        //         li.textContent = message.content;
        //         // Ajoutez le message à la liste
        //         ul.appendChild(li);
        //     });
        //     console.log(ul);
        //     // Ajoutez la liste à la page
        //     messageArea.appendChild(ul);
        // }
        function createPostItTest(animate = true) {
            const postIt = document.createElement('div')
            const h2 = document.createElement('h2');
            h2.textContent = 'titre post it';
            postIt.appendChild(h2);
            const p = document.createElement('p');
            p.textContent = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.' +
                'Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,' +
                'nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,' +
                'sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec,' +
                'vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet A';
            postIt.appendChild(p);
            postIt.classList.add('post-it');
            postIt.classList.add('pos' + currentPostIt);
            blackboard.appendChild(postIt);
            const rect = postIt.getBoundingClientRect();
            let absCenter = rect.x + rect.width/2;
            let ordCenter = rect.y + rect.height/2;
            // Animer le div pour qu'il apparaisse au centre puis se place dans la grille
            if (animate) {
                postIt.animate([
                    {opacity: 0, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(0) `, offset: 0},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(2) `, offset: 0.2},
                    {opacity: 1, transform: `translate(${window.innerWidth/2 - absCenter}px, ${window.innerHeight/2 - ordCenter}px) scale(2) `, offset: 0.8},
                    {opacity: 1, transform: "translate(0, 0) scale(1)"}
                ], {
                    // Durée de l'animation : 3 secondes
                    duration: 3000,
                    // Mode de remplissage : conserver le style final
                    fill: "forwards"
                });
            }
            currentPostIt++;
            if (currentPostIt > maxPostIt) {
                currentPostIt = 1;
            }
        }
    }
}
