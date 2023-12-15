import { HubConnectionBuilder,HubConnection } from '@microsoft/signalr';

class SignalRService {
    
    constructor() {
       this.connection=HubConnection;
    }

    async createChatConnection(){
        this.connection = new HubConnectionBuilder()
        .withUrl('https://localhost:44318/hubs/chat')
        //.withAutomaticReconnect()
        .build();

        await this.connection.start()
        .catch(console.error());
        
        this.connection.on('UserConnected', () =>{
            console.log('the server has called here')
        })
    }
    
    userConnected(){
        this.connection.on('UserConnected', () =>{
            console.log('the server has called here')
        })
    }
    
    stopChatConnection(){
        this.connection.stop().catch(error => console.log(error));
    }
}

const signalRService = new SignalRService();
export default signalRService;