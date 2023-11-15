interface IIntent {
    name: string;
    state:
        | 'Failed'
        | 'Fulfilled'
        | 'FulfillmentInProgress'
        | 'InProgress'
        | 'ReadyForFulfillment'
        | 'Waiting';
    confirmationState?: 'Confirmed' | 'Denied' | 'None';
    slots?: {
        // see Slots for details about the structure
    };
}

interface IDialogAction {
    slotElicitationStyle?: 'Default' | 'SpellByLetter' | 'SpellByWord';
    slotToElicit?: string;
    type:
        | 'Close'
        | 'ConfirmIntent'
        | 'Delegate'
        | 'ElicitIntent'
        | 'ElicitSlot';
}

interface ISessionState {
    sessionAttributes: string;
    dialogAction: IDialogAction;
    intent: IIntent;
}

interface IMessage {
    contentType: 'CustomPayload' | 'ImageResponseCard' | 'PlainText' | 'SSML';
    content: string;
    imageResponseCard?: {
        title: string;
        subtitle?: string;
        imageUrl?: string;
        buttons: Array<{
            text: string;
            value: string;
        }>;
    };
}

export interface Response {
    sessionState: ISessionState;
    messages: IMessage[];
}
