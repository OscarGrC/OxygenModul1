import { calculateScrollPosition } from '../Utils/utils.js';
import { EmailValidator } from "../Validators/email-validator.js"
import { PopUpErrors } from "../Errors/popUp-errors.js"
class PopUpComponent {
    constructor() {
        //Elementos DOM 
        this.popUp = document.getElementById('popUp')
        this.exitIcon = document.getElementById('exitIcon')
        this.popUpUserInput = document.getElementById('popUpUserInput')
        this.popUpButton = document.getElementById('popUpButton')
        this.popUpError = document.getElementById('popUpError')
        this.porUpErrosCode = new PopUpErrors()
        //PARA PROBAR FORZAMOS BORRAR ANTES DE PRODUCCION 
        sessionStorage.setItem('popUp', 'false')
        this.initializeEvents()
    }
    initializeEvents() {
        this.exitIcon.addEventListener('click', () => this.close())
        this.popUpButton.addEventListener('click', () => this.sendEmail())
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close()
            }
        })
        document.addEventListener('click', (event) => {
            if (!this.popUp.contains(event.target)) {
                this.close()
            }
        })

        window.addEventListener('scroll', () => this.scrollEvent())
        setTimeout(() => {
            if (sessionStorage.getItem('popUp') != 'true') {
                this.open()
            }
        }, 5000)
    }

    close() {
        this.popUp.style.display = 'none'
    }

    open() {
        this.popUp.style.display = 'block'
        sessionStorage.setItem('popUp', 'true')
    }
    scrollEvent() {
        const isLaunched = sessionStorage.getItem('popUp')
        if (calculateScrollPosition() >= 25 && isLaunched != 'true') {
            this.open()
        }
    }
    sendEmail() {
        const validator = new EmailValidator(this.popUpUserInput.value)
        if (validator.isValidEmail() === true) {
            this.send(this.popUpUserInput)
            this.popUpError.style.visibility = 'hidden'

        } else {
            this.popUpError.style.visibility = 'visible'
            this.popUpError.textContent = this.porUpErrosCode.getEmailError()
        }
    }

    send(email) {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
        ///// 
        this.close()
    }
}

const popUp = new PopUpComponent();