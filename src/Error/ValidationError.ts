export class ValidationError extends Error {
    messages: string[];
    
    constructor(messages: string[]) {
        super();
        this.messages = messages;
    }
}