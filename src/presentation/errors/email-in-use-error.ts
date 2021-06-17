export class EmailInUseError extends Error {
  constructor () {
    super('The recieved email is alredy in use') // this is the error object constructor, we pass the message we want to display
    this.name = 'EmailInUseError' // this.name asign the error name to the name of the class
  }
}
