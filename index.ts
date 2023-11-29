import { Response } from './interfaces';
import { TLanguage } from './types';

let response: Response;

const dispatcher = async (event: any) => {
    const { sessionState, bot } = event;
    const { localeId } = bot;
    const botLanguage = localeId as TLanguage;

    console.info('botLanguage => ', botLanguage);

    response = {
        sessionState: {
            sessionAttributes: sessionState.sessionAttributes,
            dialogAction: {
                type: 'Close',
            },
            intent: {
                name: sessionState.intent.name,
                state: 'InProgress',
            },
        },
        messages: [
            {
                contentType: 'PlainText',
                content: '',
            },
            {
                contentType: 'ImageResponseCard',
                content: 'Options',
                imageResponseCard: getDynamicImageResponseCard(botLanguage),
            },
        ],
    };

    response.sessionState.sessionAttributes = sessionState.sessionAttributes;
    response.sessionState.intent.name = sessionState.intent.name;

    console.info('EVENT => ', event);
    console.info(
        'event.sessionState.intent.name => ',
        sessionState.intent.name
    );
    console.info(
        'event.sessionState.intent.slots => ',
        sessionState.intent.slots
    );
    const username = sessionState.sessionAttributes.name;
    const email = sessionState.sessionAttributes.email;
    console.info('User => ', username);
    console.info('Email => ', email);

    let answerMessage: string;

    switch (sessionState.intent.name) {
        case 'MainOptions':
            if (!email && !username) {
                response.messages[1].imageResponseCard =
                    getTryAgain(botLanguage);
                answerMessage =
                    botLanguage === 'es_ES'
                        ? 'Proporcione su nombre y correo electrónico para continuar con las opciones'
                        : 'Please provide your name and email for continue to options';
                await responseFailed(answerMessage);
            } else {
                const option =
                    sessionState.intent.slots.options.value.originalValue;
                await mainOptionsIntent(option, botLanguage);
            }
            break;
        case 'GetEmail':
            const validEmail = await isValidEmail(
                sessionState.sessionAttributes.email
            );
            if (validEmail) {
                response.messages[1].imageResponseCard =
                    getMainOptions(botLanguage);
                answerMessage =
                    botLanguage === 'es_ES'
                        ? 'Gracias por el correo electrónico válido, ¿qué quieres saber?'
                        : 'Thanks for the valid email, what do you want to know?';
                await responseFulfilled(answerMessage);
            } else {
                const badEmail = sessionState.sessionAttributes.email;
                response.messages[1].imageResponseCard =
                    getTryAgain(botLanguage);
                response.sessionState.sessionAttributes.name = null;
                response.sessionState.sessionAttributes.email = null;
                answerMessage =
                    botLanguage === 'es_ES'
                        ? `Este es un correo electrónico no válido '${badEmail}'`
                        : `This is an invalid email '${badEmail}'`;
                await responseFailed(answerMessage);
            }
            break;
        default:
            answerMessage =
                botLanguage === 'es_ES'
                    ? 'No existe esa opción'
                    : 'No option available';
            if (!email && !username) {
                response.messages[1].imageResponseCard =
                    getTryAgain(botLanguage);
                await responseFailed(answerMessage);
            } else {
                await responseFailed(answerMessage);
            }
            break;
    }

    return response;
};

const mainOptionsIntent = async (option: string, botLanguage: TLanguage) => {
    let mainOption: string;
    switch (option) {
        case '1':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Leonardo Aranguren es Desarrollador Full Stack, Arquitecto de Soluciones y Líder Técnico. Atento a los avances tecnológicos, ostentando múltiples certificaciones AWS. Entusiasta por las soluciones de arquitectura en la nube, bilingüe y comprometido con el aprendizaje continuo y la superación de cada desafío'
                    : 'Leonardo Aranguren is a Full Stack Developer, Solutions Architect and Technical Lead. Attentive to technological advancements, holding multiple AWS certifications. Enthusiastic about cloud architecture solutions, bilingual, and committed to continuous learning and overcoming every challenge';
            await responseFulfilled(mainOption);
            break;

        case '2':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Contacta con Leonardo vía email: leoaranguren10@gmail.com'
                    : 'Contact Leonardo via email: leoaranguren10@gmail.com';
            response.messages[0].contentType = 'CustomPayload';
            await responseFulfilled(mainOption);
            break;

        case '3':
            mainOption =
                botLanguage === 'es_ES'
                    ? 'Este sitio web ha sido creado por Leonardo Aranguren, utilizando un conjunto completo de servicios de AWS. Su objetivo principal es mostrar las metodologías, compartir conocimientos y trabajos del autor.'
                    : 'This website has been created by Leonardo Aranguren, utilizing a comprehensive suite of AWS services. Its primary aim is to showcase the methodologies, share knowledge, and works of the author';
            await responseFulfilled(mainOption);
            break;

        case '4':
            response.messages[0].contentType = 'CustomPayload';
            mainOption =
                botLanguage === 'es_ES'
                    ? `Está listo para descargar. Haga clic [Leonardo Aranguren CV](${process.env.ES_CV_URL})`
                    : `It's ready for download. Click [Leonardo Aranguren CV](${process.env.EN_CV_URL})`;
            await responseFulfilled(mainOption);
            break;

        default:
            break;
    }
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

const getDynamicImageResponseCard = (botLanguage: TLanguage) => {
    const cardContent = botLanguage === 'es_ES' ? 'Opciones' : 'Options';
    const title = botLanguage === 'es_ES' ? '¿Algo más?' : 'Anything else?';
    const buttons = [
        {
            text: botLanguage === 'es_ES' ? 'Más opciones' : 'More options',
            value: botLanguage === 'es_ES' ? 'Opciones' : 'Options',
        },
        {
            text: botLanguage === 'es_ES' ? 'Adios Lex Jr' : 'Bye Lex Jr',
            value: botLanguage === 'es_ES' ? 'Adios' : 'Bye',
        },
    ];

    return {
        title,
        buttons,
        content: cardContent,
    };
};

const getMainOptions = (botLanguage: TLanguage) => {
    const cardContent =
        botLanguage === 'es_ES' ? 'Opciones de Lex Jr' : 'Lex Jr Options';
    const title = botLanguage === 'es_ES' ? 'Opciones' : 'Options';
    const buttons = [
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Sobre Leonardo Aranguren (1)'
                    : 'About Leonardo Aranguren (1)',
            value: '1',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Contácta a Leonardo Aranguren (2)'
                    : 'Contact Leonardo Aranguren (2)',
            value: '2',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Proposito del sitio web (3)'
                    : 'Purpose of the website (3)',
            value: '3',
        },
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Obtener CV Leonardo Aranguren (4)'
                    : 'Get Leonardo Aranguren CV (4)',
            value: '4',
        },
        {
            text: botLanguage === 'es_ES' ? 'Adios Lex Jr' : 'Bye Lex Jr',
            value: botLanguage === 'es_ES' ? 'Adios' : 'Bye',
        },
    ];

    return {
        title,
        buttons,
        content: cardContent,
    };
};

const getTryAgain = (botLanguage: TLanguage) => {
    const cardContent =
        botLanguage === 'es_ES' ? 'Intenta de Nuevo' : 'Try Again';
    const title = botLanguage === 'es_ES' ? 'Intenta de Nuevo' : 'Try Again';
    const buttons = [
        {
            text:
                botLanguage === 'es_ES'
                    ? 'Saludar a Lex Jr'
                    : 'Say Hi to Lex Jr',
            value: botLanguage === 'es_ES' ? 'Hola' : 'Hi',
        },
        {
            text: botLanguage === 'es_ES' ? 'Adios Lex Jr' : 'Bye Lex Jr',
            value: botLanguage === 'es_ES' ? 'Adios' : 'Bye',
        },
    ];

    return {
        title,
        buttons,
        content: cardContent,
    };
};

const isValidEmail = async (email: string): Promise<boolean> => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
};

export const handler = async (event: any) => {
    return dispatcher(event);
};
