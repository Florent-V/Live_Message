import { Controller } from '@hotwired/stimulus';

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
        // this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';
        const maxLen = 400;
        const messageArea = document.getElementById('message_content')
        const charCounterArea = document.getElementById('charCounter')
        charCounterArea.textContent = `0/${maxLen}`;

        messageArea.addEventListener('input', () => {
            const messageLength = messageArea.value.length;
            charCounterArea.style.color = messageLength >= maxLen ? 'red' : 'black';
            if (messageLength >= maxLen) {
                messageArea.value = messageArea.value.substring(0, maxLen);
                charCounterArea.textContent = `Attention longueur maximale atteinte ${messageArea.value.length}/${maxLen}`;
                return;
            }
            charCounterArea.textContent = `${messageArea.value.length}/${maxLen}`;
        });

    }
}
