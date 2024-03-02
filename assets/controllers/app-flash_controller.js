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
        function alertCounter()
        {
            const alerts = document.getElementsByClassName("alert");
            for (let alert of alerts) {
                alert.textContent += " || suppression dans 5 secondes";
                setTimeout(function () {
                    alert.remove(); }, 5000)
            }
        }
        alertCounter();

    }
}
