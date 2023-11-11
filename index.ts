interface SessionState {
    sessionAttributes: string;
    dialogAction: {
        type: 'Close';
    };
    intent: {
        name: string;
        state: string; // You might want to specify the type for 'state'
    };
}

interface Message {
    contentType: string;
    content: string;
}

interface Response {
    sessionState: SessionState;
    messages: Message[];
}

let response: Response = {
    sessionState: {
        sessionAttributes: '',
        dialogAction: {
            type: 'Close',
        },
        intent: {
            name: 'Welcome',
            state: '', // Specify the type for 'state' if necessary
        },
    },
    messages: [
        {
            contentType: 'PlainText',
            content: '', // Specify the type for 'content' if necessary
        },
    ],
};

const dispatcher = async (event: any) => {
    response.sessionState.sessionAttributes =
        event.sessionState.sessionAttributes;
    response.sessionState.intent.name = event.sessionState.intent.name;

    console.info('EVENT => ', event);
    console.info(
        'event.sessionState.intent.name => ',
        event.sessionState.intent.name
    );
    console.info(
        'event.sessionState.intent.slots => ',
        event.sessionState.intent.slots
    );

    const botLanguage = event.bot.localeId;
    console.info('botLanguage => ', botLanguage);

    switch (event.sessionState.intent.name) {
        case 'MainOptions':
            const option =
                event.sessionState.intent.slots.options.value.originalValue;
            await mainOptionsIntent(option, botLanguage);
            break;
        case 'SendCVByEmail':
            const email =
                event.sessionState.intent.slots.email.value.originalValue;
            await responseFulfilled(
                `The CV is arriving soon to your email: ${email}`
            );
            break;
        //es_ES
        default:
            const failedMessage =
                botLanguage === 'es_ES'
                    ? 'No existe esa opción'
                    : 'No option available';
            await responseFailed(failedMessage);
            break;
    }

    return response;
};

const mainOptionsIntent = async (option: string, botLanguage: string) => {
    switch (option) {
        case '1':
            await responseFulfilled(
                'Leonardo Aranguren is a Full Stack Developer, Solutions Architect and Technical Lead. Attentive to technological advancements, holding multiple AWS certifications. Enthusiastic about cloud architecture solutions, bilingual, and committed to continuous learning and overcoming every challenge.'
            );
            break;

        case '2':
            await responseFulfilled(
                'Contact Leonardo via: email leoaranguren10@gmail.com'
            );
            break;

        case '3':
            await responseFulfilled(
                'This website has been created by Leonardo Aranguren, utilizing a comprehensive suite of AWS services. Its primary aim is to showcase the methodologies, share knowledges and works of the author'
            );
            break;

        default:
            break;
    }

    return;
};

const responseFulfilled = async (message: string) => {
    console.log('responseFulfilled => ', message);
    response.sessionState.intent.state = 'Fulfilled';
    response.messages[0].content = message;
};

const responseFailed = async (message: string) => {
    console.warn('responseFailed => ', message);
    response.sessionState.intent.state = 'Failed';
    response.messages[0].content = message;
};

export const handler = async (event: any) => {
    return dispatcher(event);
};